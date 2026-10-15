export const GENETIC_COLORS = {
  adenine: 0xf43f5e, thymine: 0x3b82f6, uracil: 0xa855f7, guanine: 0x22c55e,
  cytosine: 0xf59e0b, deoxyribose: 0xe2e8f0, ribose: 0xf8fafc, phosphate: 0x8b5cf6,
  hydrogen_bond: 0x67e8f9, backbone: 0x94a3b8, chromosome: 0x34d399,
};

export const STRUCTURE_INFO = {
  dna: { name: 'DNA xoắn kép', type: 'Phân tử vật chất di truyền', function: 'Lưu giữ và truyền đạt thông tin di truyền.', feature: 'Hai mạch ngược chiều xoắn quanh cùng một trục.', related: ['strand_a', 'strand_b', 'gene', 'nucleotide'] },
  rna: { name: 'RNA', type: 'Phân tử acid nucleic', function: 'Tham gia biểu hiện thông tin di truyền và tổng hợp protein.', feature: 'Thường gồm một mạch nucleotide.', related: ['ribose', 'uracil', 'nucleotide'] },
  strand_a: { name: 'Mạch DNA 1', type: 'Chuỗi polynucleotide', function: 'Mang một nửa cấu trúc xoắn kép.', feature: 'Chạy ngược chiều với mạch DNA 2.', related: ['strand_b', 'backbone', 'base_pair'] },
  strand_b: { name: 'Mạch DNA 2', type: 'Chuỗi polynucleotide', function: 'Tạo mạch bổ sung giúp DNA sao chép chính xác.', feature: 'Trình tự base bổ sung với mạch 1.', related: ['strand_a', 'hydrogen_bond'] },
  nucleotide: { name: 'Nucleotide', type: 'Đơn phân của acid nucleic', function: 'Là đơn vị cấu tạo nên DNA và RNA.', feature: 'Gồm đường, nhóm phosphate và một base nitrogen.', related: ['phosphate', 'deoxyribose', 'adenine'] },
  adenine: { name: 'Adenine (A)', type: 'Base nitrogen purine', function: 'Trong DNA, A bắt cặp bổ sung với T bằng hai liên kết hydrogen.', feature: 'Base có hai vòng carbon–nitrogen.', related: ['thymine', 'base_pair', 'hydrogen_bond'] },
  thymine: { name: 'Thymine (T)', type: 'Base nitrogen pyrimidine', function: 'Bắt cặp bổ sung với Adenine trong DNA.', feature: 'Chỉ có trong DNA, không có trong RNA.', related: ['adenine', 'base_pair'] },
  uracil: { name: 'Uracil (U)', type: 'Base nitrogen pyrimidine', function: 'Thay Thymine và bắt cặp với Adenine trong RNA.', feature: 'Đặc trưng cho RNA.', related: ['adenine', 'rna'] },
  guanine: { name: 'Guanine (G)', type: 'Base nitrogen purine', function: 'Bắt cặp bổ sung với Cytosine bằng ba liên kết hydrogen.', feature: 'Cặp G–C bền hơn cặp A–T.', related: ['cytosine', 'hydrogen_bond'] },
  cytosine: { name: 'Cytosine (C)', type: 'Base nitrogen pyrimidine', function: 'Bắt cặp bổ sung với Guanine.', feature: 'Có trong cả DNA và RNA.', related: ['guanine', 'base_pair'] },
  deoxyribose: { name: 'Đường deoxyribose', type: 'Đường pentose', function: 'Liên kết base với phosphate trong nucleotide DNA.', feature: 'Ít hơn ribose một nguyên tử oxygen.', related: ['phosphate', 'nucleotide'] },
  ribose: { name: 'Đường ribose', type: 'Đường pentose', function: 'Tạo khung đường–phosphate của RNA.', feature: 'Có nhóm –OH tại carbon số 2.', related: ['phosphate', 'rna'] },
  phosphate: { name: 'Nhóm phosphate', type: 'Nhóm chức PO₄³⁻', function: 'Nối các phân tử đường thành khung ngoài của mạch.', feature: 'Tạo điện tích âm cho acid nucleic.', related: ['backbone', 'nucleotide'] },
  backbone: { name: 'Khung đường–phosphate', type: 'Khung ngoài acid nucleic', function: 'Giữ trình tự base ổn định và bảo vệ thông tin di truyền.', feature: 'Lặp lại xen kẽ đường và phosphate.', related: ['phosphate', 'deoxyribose'] },
  base_pair: { name: 'Cặp base bổ sung', type: 'Liên kết giữa hai mạch', function: 'Giữ hai mạch DNA và đảm bảo sao chép chính xác.', feature: 'A–T có 2, G–C có 3 liên kết hydrogen.', related: ['hydrogen_bond', 'adenine', 'guanine'] },
  hydrogen_bond: { name: 'Liên kết hydrogen', type: 'Liên kết yếu giữa các base', function: 'Giữ hai mạch DNA nhưng vẫn cho phép chúng tách khi sao chép.', feature: 'Hai liên kết ở A–T, ba ở G–C.', related: ['base_pair', 'adenine', 'guanine'] },
  gene: { name: 'Gene', type: 'Một đoạn DNA', function: 'Mang thông tin tạo RNA hoặc sản phẩm có chức năng.', feature: 'Trình tự nucleotide quyết định thông tin của gene.', related: ['dna', 'nucleotide'] },
  chromosome: { name: 'Nhiễm sắc thể', type: 'DNA đóng gói với protein', function: 'Tổ chức và phân phối DNA khi tế bào phân chia.', feature: 'Dạng kép gồm hai chromatid chị em.', related: ['chromatid', 'centromere', 'telomere'] },
  chromatid: { name: 'Chromatid chị em', type: 'Bản sao nhiễm sắc thể', function: 'Mỗi chromatid mang một bản DNA giống nhau trước phân bào.', feature: 'Hai chromatid nối nhau tại tâm động.', related: ['centromere', 'telomere'] },
  centromere: { name: 'Tâm động', type: 'Vùng co thắt nhiễm sắc thể', function: 'Giữ hai chromatid và là nơi thoi phân bào bám.', feature: 'Nằm tại vùng thắt rõ của nhiễm sắc thể.', related: ['chromatid'] },
  telomere: { name: 'Đầu mút nhiễm sắc thể', type: 'Trình tự bảo vệ đầu DNA', function: 'Bảo vệ nhiễm sắc thể khỏi mất thông tin và kết dính sai.', feature: 'Nằm ở hai đầu mỗi chromatid.', related: ['chromatid', 'dna'] },
};

export const COMPARISON = [
  ['Cấu trúc', 'Xoắn kép', 'Thường là mạch đơn'], ['Đường', 'Deoxyribose', 'Ribose'],
  ['Base', 'A, T, G, C', 'A, U, G, C'], ['Số mạch', '2', '1'],
  ['Vai trò', 'Lưu thông tin', 'Biểu hiện thông tin'],
];

export const DNA_SEQUENCE = ['A', 'T', 'G', 'C', 'C', 'A', 'T', 'G'];
export const CHALLENGES = {
  DNA: [
    { prompt: 'Tìm base bổ sung của Adenine.', answer: 'thymine', hint: 'Hãy tìm base thuộc cặp bổ sung với Adenine.' },
    { prompt: 'Tìm nhóm phosphate.', answer: 'phosphate', hint: 'Tìm nhóm nằm xen kẽ với đường ở khung ngoài.' },
    { prompt: 'Base nào liên kết bổ sung với Guanine?', answer: 'cytosine', hint: 'Đó là một base pyrimidine tạo ba liên kết hydrogen.' },
    { prompt: 'Xác định liên kết hydrogen.', answer: 'hydrogen_bond', hint: 'Tìm các nét nhỏ nối hai base ở giữa xoắn kép.' },
  ],
  RNA: [{ prompt: 'Tìm base chỉ có ở RNA.', answer: 'uracil', hint: 'Base này thay thế Thymine.' }, { prompt: 'Tìm đường của RNA.', answer: 'ribose', hint: 'Đường này có thêm một nhóm –OH.' }],
  CHROMOSOME: [{ prompt: 'Tìm tâm động trên nhiễm sắc thể.', answer: 'centromere', hint: 'Tìm vùng co thắt nối hai chromatid.' }, { prompt: 'Tìm đầu mút bảo vệ nhiễm sắc thể.', answer: 'telomere', hint: 'Quan sát các đầu của hình chữ X.' }],
};

export const baseId = letter => ({ A: 'adenine', T: 'thymine', U: 'uracil', G: 'guanine', C: 'cytosine' }[letter]);