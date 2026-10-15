import * as THREE from 'three';
import { GENETIC_COLORS, baseId } from '@/lib/geneticMaterialData';

const material = (color, options = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: .26, metalness: .08, clearcoat: .65, ...options });
const tag = (object, id, extra = {}) => { object.userData = { id, ...extra, baseColor: object.material?.color?.getHex(), baseOpacity: object.material?.opacity ?? 1, baseTransparent: object.material?.transparent ?? false }; return object; };
const sphere = (radius, color, id, position, extra) => { const mesh = tag(new THREE.Mesh(new THREE.SphereGeometry(radius, 20, 14), material(color)), id, extra); mesh.position.copy(position); return mesh; };
const cylinder = (a, b, radius, color, id, extra) => { const delta = b.clone().sub(a), mesh = tag(new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, delta.length(), 12), material(color)), id, extra); mesh.position.copy(a).add(b).multiplyScalar(.5); mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.clone().normalize()); return mesh; };
const labelSprite = (text, position, id) => { const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 72; const ctx = canvas.getContext('2d'); ctx.fillStyle = 'rgba(7,25,17,.88)'; ctx.roundRect(2, 2, 252, 68, 16); ctx.fill(); ctx.strokeStyle = '#6ee7b7'; ctx.stroke(); ctx.fillStyle = '#ecfdf5'; ctx.font = 'bold 24px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(text, 128, 44); const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true, depthTest: false })); sprite.position.copy(position); sprite.scale.set(2.3, .65, 1); sprite.userData = { label: true, id }; return sprite; };

export function buildNucleicAcid(mode) {
  const group = new THREE.Group(), objects = [], labels = [], pairs = mode === 'DNA' ? 18 : 20;
  const sequences = mode === 'DNA' ? ['A', 'G', 'T', 'C'] : ['A', 'U', 'G', 'C'];
  const complement = { A: 'T', T: 'A', G: 'C', C: 'G' };
  const strandPoints = [[], []], sugarId = mode === 'DNA' ? 'deoxyribose' : 'ribose';
  for (let i = 0; i < pairs; i++) {
    const y = (i - (pairs - 1) / 2) * .58, theta = i * .72, first = sequences[i % sequences.length], second = mode === 'DNA' ? complement[first] : null;
    const p1 = new THREE.Vector3(Math.cos(theta) * 2.25, y, Math.sin(theta) * 2.25); strandPoints[0].push(p1);
    const sugar1 = sphere(.25, GENETIC_COLORS[sugarId], sugarId, p1, { strand: 'strand_a', nucleotide: i }); group.add(sugar1); objects.push(sugar1);
    const inward1 = new THREE.Vector3(Math.cos(theta) * .56, y, Math.sin(theta) * .56), base1 = baseId(first);
    const baseMesh1 = cylinder(p1.clone().multiplyScalar(.82).setY(y), inward1, .15, GENETIC_COLORS[base1], base1, { pairIndex: i, complementId: second ? baseId(second) : null, nucleotide: i }); group.add(baseMesh1); objects.push(baseMesh1);
    if (mode === 'DNA') {
      const p2 = new THREE.Vector3(-Math.cos(theta) * 2.25, y, -Math.sin(theta) * 2.25); strandPoints[1].push(p2);
      const sugar2 = sphere(.25, GENETIC_COLORS.deoxyribose, 'deoxyribose', p2, { strand: 'strand_b', nucleotide: i }); group.add(sugar2); objects.push(sugar2);
      const inward2 = new THREE.Vector3(-Math.cos(theta) * .56, y, -Math.sin(theta) * .56), base2 = baseId(second);
      const baseMesh2 = cylinder(p2.clone().multiplyScalar(.82).setY(y), inward2, .15, GENETIC_COLORS[base2], base2, { pairIndex: i, complementId: base1, nucleotide: i }); group.add(baseMesh2); objects.push(baseMesh2);
      const bondCount = first === 'A' || first === 'T' ? 2 : 3;
      for (let bondIndex = 0; bondIndex < bondCount; bondIndex++) { const offset = (bondIndex - (bondCount - 1) / 2) * .11, shift = new THREE.Vector3(0, 0, offset); const bond = cylinder(inward1.clone().add(shift), inward2.clone().add(shift), .035, GENETIC_COLORS.hydrogen_bond, 'hydrogen_bond', { pairIndex: i }); group.add(bond); objects.push(bond); }
      const hitArea = cylinder(inward1, inward2, .19, 0xffffff, 'base_pair', { pairIndex: i }); hitArea.material.transparent = true; hitArea.material.opacity = .01; hitArea.userData.baseTransparent = true; hitArea.userData.baseOpacity = .01; group.add(hitArea); objects.push(hitArea);
    }
  }
  strandPoints.forEach((points, strand) => {
    if (!points.length) return; const id = strand ? 'strand_b' : 'strand_a';
    const tube = tag(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 120, .13, 10, false), material(strand ? 0x60a5fa : 0x34d399)), id); group.add(tube); objects.push(tube);
    points.forEach((point, i) => { if (i === points.length - 1) return; const middle = point.clone().lerp(points[i + 1], .5); const phosphate = sphere(.18, GENETIC_COLORS.phosphate, 'phosphate', middle, { strand: id, nucleotide: i }); group.add(phosphate); objects.push(phosphate); const back = cylinder(point, points[i + 1], .07, GENETIC_COLORS.backbone, 'backbone', { strand: id }); group.add(back); objects.push(back); });
  });
  labels.push(labelSprite(mode === 'DNA' ? 'DNA xoắn kép' : 'RNA mạch đơn', new THREE.Vector3(0, 5.7, 0), mode === 'DNA' ? 'dna' : 'rna'));
  labels.push(labelSprite('Nhóm phosphate', new THREE.Vector3(3.6, 2.8, 0), 'phosphate'));
  labels.push(labelSprite(mode === 'DNA' ? 'Cặp base' : 'Base nitrogen', new THREE.Vector3(-3.4, .2, 0), mode === 'DNA' ? 'base_pair' : 'adenine'));
  labels.forEach(item => group.add(item)); return { group, objects, labels };
}

export function buildChromosome() {
  const group = new THREE.Group(), objects = [], labels = [];
  const paths = [[[-2.6,4],[-1.5,2],[0,0],[-1.7,-2],[-2.8,-4]], [[2.6,4],[1.5,2],[0,0],[1.7,-2],[2.8,-4]]];
  paths.forEach((coords, index) => { const points = coords.map(([x,y]) => new THREE.Vector3(x,y,index ? .25 : -.25)); const mesh = tag(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 80, .48, 18, false), material(index ? 0x2dd4bf : 0x34d399)), 'chromatid', { chromatid: index }); group.add(mesh); objects.push(mesh); points.filter((_,i)=>i===0||i===4).forEach(p=>{const end=sphere(.57,0x86efac,'telomere',p,{chromatid:index});group.add(end);objects.push(end);}); });
  const center = sphere(.72, 0xf59e0b, 'centromere', new THREE.Vector3(0,0,0)); group.add(center); objects.push(center);
  const halo = sphere(4.8, 0xffffff, 'chromosome', new THREE.Vector3()); halo.material.transparent = true; halo.material.opacity = .008; halo.material.depthWrite = false; halo.userData.baseTransparent = true; halo.userData.baseOpacity = .008; group.add(halo); objects.push(halo);
  labels.push(labelSprite('Chromatid chị em', new THREE.Vector3(-3.8, 3, 0), 'chromatid'), labelSprite('Tâm động', new THREE.Vector3(2.8, 0, 0), 'centromere'), labelSprite('Đầu mút', new THREE.Vector3(2.2, 4.35, 0), 'telomere'));
  labels.forEach(label=>group.add(label)); return { group, objects, labels };
}