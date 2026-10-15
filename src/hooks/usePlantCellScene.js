import { useEffect, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { canvasBlob } from '@/components/microscope/optics';
const parts = [
  ['cell-wall', 0x55c271, [5.8, 4.2, 3.2], .18], ['cell-membrane', 0x38bdf8, [5.45, 3.85, 2.85], .14], ['cytoplasm', 0xfacc15, [5.1, 3.5, 2.5], .08], ['vacuole', 0x60a5fa, 1, .42], ['nucleus', 0xa855f7, .58, .95]
];
export default function usePlantCellScene(ref, onSelect, hidden, isolated, selectedId, captureRef) {
  const state = useRef(null), selectRef = useRef(onSelect); selectRef.current = onSelect;
  useImperativeHandle(captureRef, () => ({
    capture: async () => { const s = state.current; if (!s) throw new Error('Mô hình đang tải.'); s.renderer.render(s.scene, s.camera); return { blob: await canvasBlob(s.renderer.domElement), detail: `Mô hình 3D · Cô lập: ${isolated || 'không'} · Ẩn: ${hidden.join(', ') || 'không'}` }; },
    zoom: factor => { const s = state.current; if (s) { s.camera.position.sub(s.controls.target).multiplyScalar(1 / factor).clampLength(5, 22).add(s.controls.target); s.controls.update(); } },
    pan: (x, y) => { const s = state.current; if (s) { const offset = new THREE.Vector3(x * 5, -y * 5, 0).applyQuaternion(s.camera.quaternion); s.camera.position.add(offset); s.controls.target.add(offset); s.controls.update(); } },
    navigation: mode => { if (state.current) { state.current.controls.mouseButtons.LEFT = mode === 'pan' ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE; state.current.controls.touches.ONE = mode === 'pan' ? THREE.TOUCH.PAN : THREE.TOUCH.ROTATE; } }
  }), [hidden, isolated]);
  useEffect(() => {
    const host = ref.current; if (!host) return;
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0x071911);
    const camera = new THREE.PerspectiveCamera(42, host.clientWidth / host.clientHeight, .1, 100); camera.position.set(7, 5, 9);
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(host.clientWidth, host.clientHeight); host.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-label', 'Mô hình tế bào thực vật 3D'); renderer.domElement.dataset.testid = 'cell-scene'; renderer.domElement.style.touchAction = 'none';
    const controls = new OrbitControls(camera, renderer.domElement); controls.enableDamping = true; controls.minDistance = 5; controls.maxDistance = 22;
    scene.add(new THREE.HemisphereLight(0xffffff, 0x174b36, 2.1)); const light = new THREE.DirectionalLight(0xffffff, 2.4); light.position.set(5, 7, 8); scene.add(light);
    const objects = [];
    parts.forEach(([id, color, shape, opacity]) => { const geometry = Array.isArray(shape) ? new THREE.BoxGeometry(...shape) : new THREE.SphereGeometry(shape, 32, 24); const mesh = new THREE.Mesh(geometry, new THREE.MeshPhysicalMaterial({ color, transparent: true, opacity, roughness: .35, depthWrite: false, side: THREE.DoubleSide })); mesh.userData = { id }; if (id === 'vacuole') mesh.scale.set(1.75, 1.2, .9); if (id === 'nucleus') mesh.position.set(-1.25, .45, .55); scene.add(mesh); objects.push(mesh); });
    for (let i = 0; i < 7; i++) { const mesh = new THREE.Mesh(new THREE.SphereGeometry(.28, 20, 14), new THREE.MeshStandardMaterial({ color: 0x22c55e })); mesh.scale.set(1.7, .65, .6); mesh.position.set(-2 + (i % 4) * 1.25, i < 4 ? -1.25 : 1.25, (i % 2) * .8 - .4); mesh.userData = { id: 'chloroplast' }; scene.add(mesh); objects.push(mesh); }
    state.current = { renderer, camera, scene, controls, objects }; let start = null;
    const down = e => { start = { x: e.clientX, y: e.clientY }; };
    const up = e => { if (!start || Math.hypot(e.clientX - start.x, e.clientY - start.y) > 5) return; const r = renderer.domElement.getBoundingClientRect(), ray = new THREE.Raycaster(); ray.setFromCamera(new THREE.Vector2((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1), camera); const hits = ray.intersectObjects(objects.filter(o => o.visible)); const hit = hits.find(h => ['nucleus', 'chloroplast', 'vacuole'].includes(h.object.userData.id)) || hits[0]; if (hit) selectRef.current(hit.object.userData.id); };
    renderer.domElement.addEventListener('pointerdown', down); renderer.domElement.addEventListener('pointerup', up);
    const report = () => { renderer.domElement.dataset.camera = camera.position.toArray().map(v => v.toFixed(3)).join(','); }; controls.addEventListener('change', report); report();
    const resize = new ResizeObserver(() => { if (!host.clientWidth || !host.clientHeight) return; camera.aspect = host.clientWidth / host.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(host.clientWidth, host.clientHeight); }); resize.observe(host);
    let frame; const animate = () => { frame = requestAnimationFrame(animate); controls.update(); renderer.render(scene, camera); }; animate();
    return () => { cancelAnimationFrame(frame); resize.disconnect(); controls.dispose(); renderer.dispose(); renderer.domElement.remove(); objects.forEach(o => { o.geometry.dispose(); o.material.dispose(); }); state.current = null; };
  }, [ref]);
  useEffect(() => { const s = state.current; if (!s) return; s.objects.forEach(o => { o.visible = !hidden.includes(o.userData.id) && (!isolated || isolated === o.userData.id); o.material.emissive.set(selectedId === o.userData.id ? o.material.color : 0x000000); o.material.emissiveIntensity = .4; }); s.renderer.domElement.dataset.visible = [...new Set(s.objects.filter(o => o.visible).map(o => o.userData.id))].join(','); }, [hidden, isolated, selectedId]);
}