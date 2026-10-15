import { useEffect, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { buildChromosome, buildNucleicAcid } from '@/lib/geneticSceneBuilders';
import { STRUCTURE_INFO } from '@/lib/geneticMaterialData';

export default function useGeneticScene(hostRef, mode, selected, labelsVisible, onSelect, apiRef, annotationRef) {
  const sceneRef = useRef(null), selectRef = useRef(onSelect), selectedRef = useRef(selected); selectRef.current = onSelect; selectedRef.current = selected;
  useImperativeHandle(apiRef, () => ({
    reset: () => resetView(sceneRef.current),
    zoom: factor => zoom(sceneRef.current, factor),
    setAngle: degrees => { if (sceneRef.current) sceneRef.current.targetAngle = THREE.MathUtils.degToRad(degrees); },
    autoRotate: value => { if (sceneRef.current) sceneRef.current.controls.autoRotate = value; },
    focus: choice => focusSelected(sceneRef.current, choice || selected),
  }), [selected]);

  useEffect(() => {
    const host = hostRef.current; if (!host) return;
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0x061a12); scene.fog = new THREE.FogExp2(0x061a12, .025);
    const camera = new THREE.PerspectiveCamera(42, host.clientWidth / host.clientHeight, .1, 100); camera.position.set(8, 3, 12);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false }); renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(host.clientWidth, host.clientHeight); renderer.outputColorSpace = THREE.SRGBColorSpace; host.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-label', `Mô hình ${mode === 'CHROMOSOME' ? 'nhiễm sắc thể' : mode} 3D tương tác`); renderer.domElement.dataset.testid = 'genetic-scene'; renderer.domElement.style.touchAction = 'none';
    const controls = new OrbitControls(camera, renderer.domElement); controls.enableDamping = true; controls.minDistance = 4; controls.maxDistance = 28; controls.autoRotateSpeed = 1.2;
    scene.add(new THREE.HemisphereLight(0xd1fae5, 0x064e3b, 2.5)); const key = new THREE.DirectionalLight(0xffffff, 3.2); key.position.set(6, 8, 9); scene.add(key); const rim = new THREE.PointLight(0x34d399, 20, 25); rim.position.set(-6, 1, -4); scene.add(rim);
    const built = mode === 'CHROMOSOME' ? buildChromosome() : buildNucleicAcid(mode); scene.add(built.group);
    const floor = new THREE.Mesh(new THREE.CircleGeometry(5.2, 64), new THREE.MeshPhysicalMaterial({ color: 0x0b3b2c, transparent: true, opacity: .34, roughness: .2 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -5.2; scene.add(floor);
    const state = { scene, camera, renderer, controls, ...built, targetAngle: null }; sceneRef.current = state; let start = null;
    const down = event => { start = { x: event.clientX, y: event.clientY }; };
    const up = event => { if (!start || Math.hypot(event.clientX-start.x,event.clientY-start.y)>5) return; const rect=renderer.domElement.getBoundingClientRect(), ray=new THREE.Raycaster(); ray.setFromCamera(new THREE.Vector2((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1),camera); const hit=ray.intersectObjects(built.objects.filter(o=>o.visible))[0]; if(hit) selectRef.current({ id:hit.object.userData.id, pairIndex:hit.object.userData.pairIndex, complementId:hit.object.userData.complementId, nucleotide:hit.object.userData.nucleotide, chromatid:hit.object.userData.chromatid, objectUuid:hit.object.uuid }); };
    const dbl = () => focusSelected(state, null, true); renderer.domElement.addEventListener('pointerdown',down); renderer.domElement.addEventListener('pointerup',up); renderer.domElement.addEventListener('dblclick',dbl);
    const resize = new ResizeObserver(()=>{if(!host.clientWidth||!host.clientHeight)return;camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();renderer.setSize(host.clientWidth,host.clientHeight);}); resize.observe(host);
    let frame; const animate=()=>{frame=requestAnimationFrame(animate);if(state.targetAngle!==null){built.group.rotation.y=THREE.MathUtils.lerp(built.group.rotation.y,state.targetAngle,.08);if(Math.abs(built.group.rotation.y-state.targetAngle)<.005)state.targetAngle=null;}controls.update();updateAnnotation(state,selectedRef.current,annotationRef);renderer.render(scene,camera);renderer.domElement.dataset.camera=camera.position.toArray().map(v=>v.toFixed(2)).join(',');renderer.domElement.dataset.rotation=built.group.rotation.y.toFixed(3);};animate();
    return()=>{cancelAnimationFrame(frame);resize.disconnect();controls.dispose();renderer.dispose();renderer.domElement.remove();built.objects.forEach(o=>{o.geometry?.dispose();o.material?.dispose();});built.labels.forEach(l=>l.material.map?.dispose());sceneRef.current=null;};
  }, [hostRef, mode]);

  useEffect(()=>{const state=sceneRef.current;if(!state)return;state.labels.forEach(label=>label.visible=labelsVisible);applySelection(state,selected);state.renderer.domElement.dataset.selected=selected?.id||'';state.renderer.domElement.dataset.selectedObject=selected?.objectUuid||'';state.renderer.domElement.dataset.dimmed=selected?.id?'true':'false';},[selected,labelsVisible,mode]);
}

function resetView(state){if(!state)return;state.camera.position.set(8,3,12);state.controls.target.set(0,0,0);state.group.rotation.set(0,0,0);state.controls.autoRotate=false;state.controls.update();}
function zoom(state,factor){if(!state)return;state.camera.position.sub(state.controls.target).multiplyScalar(1/factor).clampLength(4,28).add(state.controls.target);state.controls.update();}
function focusSelected(state,choice,fallback=false){if(!state)return;const targets=choice?selectionObjects(state,choice):[];const list=targets.length?targets:(fallback?state.objects:[]);if(!list.length)return;const box=new THREE.Box3();list.forEach(o=>box.expandByObject(o));const center=box.getCenter(new THREE.Vector3());state.controls.target.copy(center);const direction=state.camera.position.clone().sub(center).normalize();state.camera.position.copy(center).add(direction.multiplyScalar(Math.max(4,box.getSize(new THREE.Vector3()).length()*1.7)));state.controls.update();}

function selectionObjects(state, choice) {
  if (!choice?.id) return [];
  if (choice.objectUuid) return state.objects.filter(o => o.uuid === choice.objectUuid);
  if (choice.id === 'dna' || choice.id === 'rna') return state.objects.filter(o => (o.userData.baseOpacity ?? 1) > .05);
  if (choice.id === 'chromosome') return state.objects.filter(o => ['chromatid','centromere','telomere'].includes(o.userData.id));
  if (choice.id === 'nucleotide') { const n=choice.nucleotide ?? 0; return state.objects.filter(o => o.userData.nucleotide===n && !['hydrogen_bond','base_pair'].includes(o.userData.id)); }
  if (choice.id === 'base_pair') { const p=choice.pairIndex ?? 0; return state.objects.filter(o => o.userData.pairIndex===p && !['base_pair'].includes(o.userData.id)); }
  return state.objects.filter(o => o.userData.id===choice.id && (choice.pairIndex===undefined || o.userData.pairIndex===choice.pairIndex));
}

function applySelection(state, choice) {
  const direct = new Set(selectionObjects(state, choice));
  const relatedIds = new Set(STRUCTURE_INFO[choice?.id]?.related || []);
  state.objects.forEach(object => {
    const data=object.userData, material=object.material; if(!material?.color)return;
    const baseOpacity=data.baseOpacity ?? 1, outline=object.userData.outline;
    material.color.setHex(data.baseColor ?? material.color.getHex());
    if(!choice?.id){material.transparent=data.baseTransparent;material.opacity=baseOpacity;material.emissive?.setHex(0x000000);if(material.emissiveIntensity!==undefined)material.emissiveIntensity=0;object.scale.setScalar(1);if(outline)outline.visible=false;return;}
    const isDirect=direct.has(object), samePair=choice.pairIndex!==undefined&&data.pairIndex===choice.pairIndex, sameNucleotide=choice.nucleotide!==undefined&&data.nucleotide===choice.nucleotide;
    const isRelated=!isDirect&&(samePair||sameNucleotide||relatedIds.has(data.id)), isBond=isRelated&&data.id==='hydrogen_bond';
    if(!isDirect&&!isRelated){const base=new THREE.Color(data.baseColor);const gray=base.r*.299+base.g*.587+base.b*.114;material.color.lerp(new THREE.Color(gray,gray,gray),.55);}
    material.transparent=data.baseTransparent||(!isDirect&&!isRelated&&baseOpacity>.05);material.opacity=baseOpacity>.05?(isDirect?1:isRelated?.76:.25):baseOpacity;
    material.emissive?.setHex(isDirect?(data.baseColor ?? 0x34d399):isBond?0xffffff:isRelated?0x164e3b:0x000000);if(material.emissiveIntensity!==undefined)material.emissiveIntensity=isDirect?1.35:isBond?.9:isRelated?.38:0;
    object.scale.setScalar(isDirect?1.13:1);
    let rim=outline;
    if(isDirect&&baseOpacity>.05&&!rim){rim=new THREE.Mesh(object.geometry,new THREE.MeshBasicMaterial({color:0x6ee7b7,side:THREE.BackSide,transparent:true,opacity:.72,depthWrite:false}));rim.scale.setScalar(1.1);rim.raycast=()=>{};object.add(rim);object.userData.outline=rim;}
    if(rim)rim.visible=isDirect;
  });
}

function updateAnnotation(state, choice, annotationRef) {
  const targets=selectionObjects(state,choice); if(!targets.length){annotationRef.current?.hide();return;}
  const center=new THREE.Vector3();targets.forEach(o=>center.add(o.getWorldPosition(new THREE.Vector3())));center.multiplyScalar(1/targets.length);center.project(state.camera);
  if(center.z<-1||center.z>1){annotationRef.current?.hide();return;}
  const width=state.renderer.domElement.clientWidth,height=state.renderer.domElement.clientHeight;
  annotationRef.current?.update((center.x*.5+.5)*width,(-center.y*.5+.5)*height,width,height);
}