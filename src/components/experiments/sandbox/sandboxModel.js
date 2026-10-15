export const sandboxEquipment = {
  enzyme: [
    { type: "beaker", label: "Cốc phản ứng", initial: [28, 62] },
    { type: "catalase", label: "Mẫu catalase", initial: [46, 48] },
    { type: "peroxide", label: "Hydrogen peroxide", initial: [66, 56] },
    { type: "thermometer", label: "Nhiệt kế", initial: [80, 35], rotatable: true },
  ],
  osmosis: [
    { type: "beaker", label: "Cốc dung dịch", initial: [30, 62] },
    { type: "potato", label: "Miếng khoai tây", initial: [48, 55], rotatable: true },
    { type: "solute", label: "Dung dịch muối", initial: [67, 58] },
    { type: "scale", label: "Cân khối lượng", initial: [82, 65] },
  ],
};

export function equipmentDetail(kind, type, params) {
  if (type === "thermometer") return `${params.temp}°C`;
  if (type === "solute") return `${params.concentration}%`;
  if (type === "catalase") return "enzyme";
  if (type === "peroxide") return "H₂O₂";
  if (type === "potato") return "mẫu thử";
  return kind === "osmosis" && type === "scale" ? "Δ khối lượng" : "dụng cụ";
}