import { ellipse, polygon, regionArea, regionCenter, regionContains, toRegion } from '@/lib/microscopeRegions';

// Knowledge shared by every instance of a structure type in the stomata specimen.
const stomataTypes = {
  stomata: { label: "Khí khổng", category: "Cấu trúc trao đổi khí của lá", function: "Điều tiết trao đổi khí và thoát hơi nước ở lá.", info: "Cấu tạo: hai tế bào khí khổng bao quanh khe khí khổng.", priority: 1 },
  guard_cell: { label: "Tế bào khí khổng", category: "Tế bào biểu bì chuyên hóa", function: "Hai tế bào bao quanh khe khí khổng và điều tiết độ mở của khí khổng.", info: "Có dạng hạt đậu và chứa nhiều lục lạp.", priority: 2 },
  stomatal_pore: { label: "Khe khí khổng", category: "Khoảng mở giữa hai tế bào khí khổng", function: "Cho phép trao đổi khí và liên quan đến quá trình thoát hơi nước.", info: "Là khe hẹp nằm chính giữa hai tế bào khí khổng.", priority: 3 },
  chloroplast: { label: "Lục lạp", category: "Bào quan quang hợp", function: "Thực hiện quang hợp nhờ chất diệp lục.", info: "Là các hạt tròn màu xanh lục trong tế bào khí khổng.", priority: 3 },
  epidermal_cell: { label: "Tế bào biểu bì", category: "Mô bảo vệ bề mặt lá", function: "Bảo vệ các mô phía trong lá và hạn chế mất nước.", info: "Xếp khít như mảnh ghép và không chứa lục lạp.", priority: 2 }
};
const structure = (type, id, region, relatedStructures = []) => ({ ...stomataTypes[type], type, id, region, relatedStructures });

// Each visible stoma in the image is annotated separately, with its own guard cells,
// pore and chloroplast clusters.
const stomaInstances = [
  { n: '01', body: ellipse(36, 34, 13, 15), guards: [ellipse(30, 34, 5.5, 13), ellipse(42, 34, 5.5, 13)], pore: ellipse(36, 34, 2.2, 11), chloroplasts: [ellipse(29.5, 28, 3, 3), ellipse(42, 40, 3, 3)] },
  { n: '02', body: ellipse(83, 15, 11.5, 13, 12), guards: [ellipse(78, 15, 5, 11), ellipse(88, 15, 5, 11)], pore: ellipse(83, 15, 2, 9, 12), chloroplasts: [ellipse(87, 9, 2.8, 2.8)] },
  { n: '03', body: ellipse(7, 71, 11, 11), guards: [ellipse(2, 71, 4.5, 10), ellipse(12, 71, 4.5, 10)], pore: ellipse(7, 71, 2, 8), chloroplasts: [ellipse(13, 74, 2.8, 2.8)] },
  { n: '04', body: ellipse(71, 73, 12, 14), guards: [ellipse(66, 73, 5, 12), ellipse(77, 73, 5, 12)], pore: ellipse(71, 73, 2.2, 10.5), chloroplasts: [ellipse(66, 67, 3, 3), ellipse(77, 79, 3, 3)] }
];
const stomataHotspots = [
  ...stomaInstances.flatMap(({ n, body, guards, pore, chloroplasts }) => [
    structure('stomata', `stomata_${n}`, body, [`guard_cell_${n}a`, `stomatal_pore_${n}`]),
    ...guards.map((region, i) => structure('guard_cell', `guard_cell_${n}${i ? 'b' : 'a'}`, region, [`stomatal_pore_${n}`])),
    structure('stomatal_pore', `stomatal_pore_${n}`, pore, [`guard_cell_${n}a`]),
    ...chloroplasts.map((region, i) => structure('chloroplast', `chloroplast_${n}_${i + 1}`, region, [`guard_cell_${n}${i ? 'b' : 'a'}`]))
  ]),
  structure('epidermal_cell', 'epidermal_cell_01', polygon([[57, 26], [70, 23], [87, 27], [89, 42], [80, 51], [64, 50], [56, 40]])),
  structure('epidermal_cell', 'epidermal_cell_02', polygon([[32, 50], [47, 47], [59, 53], [58, 70], [47, 78], [35, 74], [30, 62]])),
  structure('epidermal_cell', 'epidermal_cell_03', polygon([[5, 12], [14, 3], [27, 4], [31, 15], [28, 25], [13, 26], [4, 20]])),
  structure('epidermal_cell', 'epidermal_cell_04', polygon([[4, 33], [16, 30], [24, 38], [22, 47], [10, 50], [2, 44]]))
];

// Each specimen owns its own structure map: only these hotspots are clickable and
// only their information may be displayed for that specimen.
export const microscopeSpecimens = [
  { id: "leaf-epidermis", name: "Biểu bì lá", description: "Lớp tế bào bảo vệ bề mặt lá.", recommended: 400, image: "https://media.base44.com/images/public/6aabb82352d885cecdb66e2a/85b8329a4_image.png", hotspots: [
    { id: "stomata", x: 42, y: 50, radius: 7, label: "Khí khổng", category: "Cấu trúc trao đổi khí", function: "Điều tiết trao đổi khí và thoát hơi nước.", info: "Gồm hai tế bào bảo vệ bao quanh một lỗ khí.", related: ["Tế bào bảo vệ", "Lỗ khí"] },
    { id: "guard-cell", x: 36, y: 41, radius: 6, label: "Tế bào bảo vệ", category: "Tế bào biểu bì chuyên hóa", function: "Đóng và mở khí khổng nhờ thay đổi sức trương nước.", info: "Có dạng hạt đậu và chứa lục lạp.", related: ["Khí khổng"] },
    { id: "pore", x: 42, y: 57, radius: 4, label: "Lỗ khí", category: "Khe hở giữa hai tế bào bảo vệ", function: "Là đường đi của CO₂, O₂ và hơi nước.", info: "Độ mở thay đổi theo trạng thái nước của lá.", related: ["Khí khổng", "Tế bào bảo vệ"] },
    { id: "epidermal-cell", x: 24, y: 24, radius: 9, label: "Tế bào biểu bì", category: "Mô bảo vệ", function: "Bảo vệ các mô phía trong lá và hạn chế mất nước.", info: "Các tế bào xếp khít như những mảnh ghép, không chứa lục lạp.", related: ["Khí khổng"] }
  ]},
  // Bản đồ vùng tương tác riêng của tiêu bản khí khổng, vẽ theo cấu trúc thật trên ảnh này.
  { id: "stomata_leaf_epidermis", name: "Cận cảnh khí khổng", description: "Biểu bì lá với khí khổng, tế bào khí khổng và lục lạp.", recommended: 100, image: "https://media.base44.com/images/public/6aabb82352d885cecdb66e2a/c16e47d23_generated_image.png", hotspots: stomataHotspots },
  { id: "leaf-section", name: "Mặt cắt ngang lá", description: "Lát cắt cho thấy biểu bì, mô giậu, mô xốp và bó mạch.", recommended: 400, image: "https://media.base44.com/images/public/6aabb82352d885cecdb66e2a/81640bf76_image.png", hotspots: [
    { id: "upper-epidermis", x: 50, y: 18, radius: 7, label: "Biểu bì trên", category: "Mô bảo vệ", function: "Bảo vệ lá và hạn chế mất nước.", info: "Thường được phủ lớp cutin trong suốt.", related: ["Mô giậu"] },
    { id: "palisade", x: 50, y: 32, radius: 8, label: "Mô giậu", category: "Mô quang hợp", function: "Hấp thụ ánh sáng và thực hiện phần lớn quang hợp.", info: "Tế bào hình trụ xếp sít nhau, rất nhiều lục lạp.", related: ["Biểu bì trên", "Mô xốp"] },
    { id: "spongy", x: 54, y: 58, radius: 8, label: "Mô xốp", category: "Mô quang hợp và trao đổi khí", function: "Tạo khoảng gian bào cho khí khuếch tán trong lá.", info: "Tế bào xếp lỏng lẻo, nhiều khoảng trống.", related: ["Mô giậu", "Bó mạch"] },
    { id: "vascular-bundle", x: 30, y: 55, radius: 9, label: "Bó mạch", category: "Mô dẫn", function: "Vận chuyển nước, khoáng và chất hữu cơ.", info: "Mạch gỗ thường ở phía trên, mạch rây ở phía dưới.", related: ["Mô xốp"] },
    { id: "lower-epidermis", x: 50, y: 82, radius: 7, label: "Biểu bì dưới", category: "Mô bảo vệ", function: "Bảo vệ mặt dưới lá và mang khí khổng.", info: "Có nhiều khí khổng hơn biểu bì trên.", related: ["Mô xốp"] }
  ]},
  { id: "vascular", name: "Bó mạch", description: "Bó mạch gồm mạch gỗ và mạch rây.", recommended: 100, image: "https://media.base44.com/images/public/6aabb82352d885cecdb66e2a/81640bf76_image.png", hotspots: [
    { id: "vascular-bundle", x: 30, y: 55, radius: 9, label: "Bó mạch", category: "Mô dẫn", function: "Vận chuyển nước, khoáng và chất hữu cơ.", info: "Là cụm mạch gỗ và mạch rây nằm cạnh nhau.", related: ["Mạch gỗ"] },
    { id: "xylem", x: 30, y: 49, radius: 5, label: "Mạch gỗ", category: "Mô dẫn nước", function: "Dẫn nước và ion khoáng từ rễ lên lá.", info: "Thành tế bào hóa gỗ tạo ống dẫn bền chắc.", related: ["Bó mạch"] }
  ]},
  { id: "stem", name: "Mặt cắt thân cây", description: "Mặt cắt cho thấy biểu bì, mô nền và bó mạch.", recommended: 100, image: "https://media.base44.com/images/public/6aabb82352d885cecdb66e2a/81640bf76_image.png", hotspots: [
    { id: "stem-epidermis", x: 50, y: 18, radius: 7, label: "Biểu bì thân", category: "Mô bảo vệ", function: "Bảo vệ thân non khỏi tác động môi trường.", info: "Là lớp tế bào ngoài cùng của thân non.", related: ["Bó mạch thân"] },
    { id: "vascular-bundle", x: 30, y: 55, radius: 9, label: "Bó mạch thân", category: "Mô dẫn", function: "Liên kết hệ vận chuyển giữa rễ và lá.", info: "Cách sắp xếp bó mạch khác nhau ở cây một và hai lá mầm.", related: ["Biểu bì thân"] }
  ]},
  { id: "root", name: "Mặt cắt rễ cây", description: "Mặt cắt rễ với mô vỏ và trụ giữa.", recommended: 100, image: "https://media.base44.com/images/public/6aabb82352d885cecdb66e2a/fea05529d_image.png", hotspots: [
    { id: "root-cortex", x: 34, y: 38, radius: 8, label: "Mô vỏ rễ", category: "Mô nhu mô", function: "Dẫn nước từ lông hút vào trụ giữa.", info: "Gồm nhiều lớp tế bào nhu mô.", related: ["Trụ giữa"] },
    { id: "root-stele", x: 55, y: 50, radius: 8, label: "Trụ giữa", category: "Mô dẫn của rễ", function: "Chứa mạch gỗ và mạch rây của rễ.", info: "Được lớp nội bì bao quanh.", related: ["Mô vỏ rễ"] }
  ]},
  { id: "plant-cell", name: "Tế bào thực vật", description: "Quan sát thành tế bào, nhân và các lục lạp.", recommended: 1000, image: "https://media.base44.com/images/public/6aabb82352d885cecdb66e2a/83acb5a2a_image.png", hotspots: [
    { id: "cell-wall", x: 30, y: 30, radius: 7, label: "Thành tế bào", category: "Cấu trúc bao ngoài", function: "Nâng đỡ và bảo vệ tế bào.", info: "Cấu tạo chủ yếu từ cellulose.", related: ["Màng sinh chất"] },
    { id: "plasma-membrane", x: 33, y: 40, radius: 5, label: "Màng sinh chất", category: "Màng tế bào", function: "Kiểm soát các chất đi vào và ra khỏi tế bào.", info: "Nằm sát bên trong thành tế bào.", related: ["Thành tế bào", "Tế bào chất"] },
    { id: "nucleus", x: 55, y: 50, radius: 6, label: "Nhân", category: "Bào quan điều khiển", function: "Chứa DNA và điều khiển hoạt động của tế bào.", info: "Được bao bọc bởi màng nhân kép.", related: ["Tế bào chất"] },
    { id: "vacuole", x: 45, y: 62, radius: 9, label: "Không bào", category: "Bào quan dự trữ", function: "Dự trữ nước, chất tan và duy trì sức trương.", info: "Thường rất lớn, chiếm phần giữa tế bào.", related: ["Tế bào chất"] },
    { id: "chloroplast", x: 68, y: 34, radius: 5, label: "Lục lạp", category: "Bào quan quang hợp", function: "Thực hiện quang hợp nhờ chất diệp lục.", info: "Có dạng hạt hoặc bầu dục màu xanh lục.", related: ["Tế bào chất"] },
    { id: "cytoplasm", x: 66, y: 66, radius: 7, label: "Tế bào chất", category: "Chất nền tế bào", function: "Nơi diễn ra nhiều phản ứng chuyển hóa.", info: "Bao quanh và giữ vị trí các bào quan.", related: ["Nhân", "Lục lạp"] }
  ]}
];

export const microscopeChallenges = [
  { specimenId: "stomata_leaf_epidermis", targetId: "stomata_01", trainingSlide: false, objective: "Đâu là khí khổng?", hint: "Tìm cấu trúc gồm hai tế bào bao quanh một khe nhỏ." },
  { specimenId: "stomata_leaf_epidermis", targetId: "stomatal_pore_01", trainingSlide: false, objective: "Tìm khe khí khổng.", hint: "Tìm khoảng mở hẹp nằm chính giữa hai tế bào khí khổng." },
  { specimenId: "stomata_leaf_epidermis", targetId: "guard_cell_01a", trainingSlide: false, objective: "Tìm tế bào khí khổng.", hint: "Quan sát hai tế bào hình hạt đậu chứa nhiều lục lạp." },
  { specimenId: "stomata_leaf_epidermis", targetId: "chloroplast_01_1", trainingSlide: false, objective: "Tìm lục lạp.", hint: "Tìm các hạt tròn nhỏ màu xanh lục đậm." },
  { specimenId: "stomata_leaf_epidermis", targetId: "epidermal_cell_01", trainingSlide: false, objective: "Tìm một tế bào biểu bì.", hint: "Tìm tế bào lớn dạng đa giác, không chứa lục lạp." },
  { specimenId: "leaf-epidermis", targetId: "stomata", objective: "Xác định khí khổng trên tiêu bản biểu bì lá.", hint: "Hãy tìm cấu trúc gồm hai tế bào bảo vệ bao quanh một lỗ nhỏ." },
  { specimenId: "vascular", targetId: "vascular-bundle", objective: "Tìm bó mạch trong lát cắt mô thực vật.", hint: "Tìm cụm tế bào tạo thành vùng dẫn truyền rõ rệt." },
  { specimenId: "leaf-section", targetId: "palisade", objective: "Xác định mô giậu của lá.", hint: "Quan sát lớp tế bào hình trụ nằm ngay dưới biểu bì trên." },
  { specimenId: "plant-cell", targetId: "nucleus", objective: "Tìm nhân của tế bào thực vật.", hint: "Tìm cấu trúc tròn đậm màu nằm trong tế bào chất." },
  { specimenId: "plant-cell", targetId: "chloroplast", objective: "Tìm lục lạp trong tế bào thực vật.", hint: "Tìm các hạt nhỏ màu xanh lục nằm trong tế bào chất." }
];

// Region based identification: a click anywhere inside a structure's region selects it.
// When regions overlap, the more specific structure (higher priority, then smaller area) wins.
export function findHotspot(specimen, tapped) {
  const hit = (specimen.hotspots || [])
    .map(h => ({ hotspot: h, region: toRegion(h) }))
    .filter(item => regionContains(item.region, tapped))
    .sort((a, b) => (b.hotspot.priority || 2) - (a.hotspot.priority || 2) || regionArea(a.region) - regionArea(b.region))[0];
  return hit ? resolveStructure(specimen, hit.hotspot) : null;
}

// One biological structure type = one interaction group. Clicking any instance
// resolves its whole group so every instance of that structure is highlighted at once.
const groupIdOf = hotspot => hotspot.type || hotspot.id;

export function resolveStructure(specimen, hotspot) {
  const region = toRegion(hotspot), centre = regionCenter(region), groupId = groupIdOf(hotspot);
  const group = (specimen.hotspots || []).filter(h => groupIdOf(h) === groupId).map(h => ({ ...h, region: toRegion(h) }));
  const siblings = group.filter(h => h.id !== hotspot.id);
  return { ...hotspot, region, x: centre.x, y: centre.y, groupId, groupCount: group.length || 1, relatedSpots: siblings };
}