import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { specimenName, structures, question, selectedLabel } = await req.json();
    if (!specimenName || typeof specimenName !== 'string' || specimenName.length > 200) {
      return Response.json({ error: 'specimenName is required' }, { status: 400 });
    }
    if (!Array.isArray(structures) || structures.length > 30 || JSON.stringify(structures).length > 8000) {
      return Response.json({ error: 'structures is required' }, { status: 400 });
    }
    if (!question || typeof question !== 'string' || question.length > 500) {
      return Response.json({ error: 'question is required' }, { status: 400 });
    }

    const structureList = structures.map(s => `- ${s.label} (${s.category}): chức năng "${s.function}". Đặc điểm/nhận biết: "${s.info}".`).join('\n');

    const prompt = `Bạn là trợ lý phòng thí nghiệm Sinh học cho học sinh THPT đang quan sát tiêu bản "${specimenName}" dưới kính hiển vi.

DANH SÁCH CẤU TRÚC CÓ THẬT trong tiêu bản này (đây là TOÀN BỘ những gì tồn tại — không có gì khác ngoài danh sách này):
${structureList}
${selectedLabel ? `\nHọc sinh vừa chọn cấu trúc: "${selectedLabel}".` : ''}

Câu hỏi của học sinh: "${question}"

QUY TẮC BẮT BUỘC:
1. LUÔN giải thích "NÓ LÀ GÌ" trước tiên, dù học sinh hỏi vị trí hay chức năng. Không được bỏ qua phần định nghĩa.
2. Chỉ trả lời đúng trọng tâm cấu trúc/bộ phận được hỏi, không lan man.
3. Nếu cấu trúc được hỏi KHÔNG có trong danh sách trên → status = "not_in_specimen". TUYỆT ĐỐI không bịa định nghĩa, vị trí, chức năng hay đặc điểm cho nó.
4. Nếu cấu trúc có trong danh sách nhưng câu hỏi cần thông tin ảnh (vị trí chính xác) mà dữ liệu không đủ rõ → status = "uncertain_from_image". Vẫn điền definition (nó là gì) vì đó là kiến thức chung, chỉ phần vị trí/đặc điểm cụ thể trên ảnh là chưa chắc chắn.
5. Nếu cấu trúc có trong danh sách và đủ thông tin → status = "found", điền đầy đủ: definition (nó là gì — bản chất, đặc điểm cơ bản, 1-3 câu), structure_name, location (vị trí tương đối trong tiêu bản/vật thể, ví dụ "trên biểu bì lá, mặt dưới"), features (đặc điểm nhận biết), function_role (chức năng, giải thích đủ ý không chỉ liệt kê cụm từ).
6. Dù học sinh hỏi "X là gì?", "X nằm ở đâu?", "X có tác dụng gì?" hay hỏi đủ cả ba, LUÔN trả lời đủ 4 phần: định nghĩa, vị trí, đặc điểm nhận biết, chức năng.
7. Ngôn ngữ ngắn gọn, dễ hiểu, phù hợp học sinh lớp 10-12. Chỉ mở rộng kiến thức khi được yêu cầu.
8. note: dùng khi status khác "found" để giải thích ngắn gọn, hoặc để bổ sung ghi chú ngắn khi "found" (có thể để rỗng).

Trả lời bằng tiếng Việt cho tất cả các trường text.`;

    const schema = {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['found', 'not_in_specimen', 'uncertain_from_image'] },
        structure_name: { type: 'string' },
        definition: { type: 'string' },
        location: { type: 'string' },
        features: { type: 'string' },
        function_role: { type: 'string' },
        note: { type: 'string' }
      },
      required: ['status', 'note']
    };

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({ prompt, response_json_schema: schema });

    const name = result.structure_name || selectedLabel || '';
    let answer;
    if (result.status === 'found') {
      answer = `${name} là gì?\n${result.definition || ''}\n\nVị trí:\n${result.location || ''}\n\nĐặc điểm nhận biết:\n${result.features || ''}\n\nChức năng:\n${result.function_role || ''}`;
      if (result.note) answer += `\n\n${result.note}`;
    } else if (result.status === 'not_in_specimen') {
      answer = `${name} là gì?\n${result.definition || ''}\n\nVị trí:\nCấu trúc này không có trong ${specimenName}.`;
      if (result.note) answer += `\nGiải thích: ${result.note}`;
    } else {
      answer = `${name} là gì?\n${result.definition || ''}\n\nVị trí:\nCấu trúc này có thể có, nhưng hình ảnh hiện tại chưa đủ rõ để xác định.`;
      if (result.features) answer += `\n\nĐặc điểm nhận biết:\n${result.features}`;
      if (result.function_role) answer += `\n\nChức năng:\n${result.function_role}`;
      if (result.note) answer += `\n\n${result.note}`;
    }

    return Response.json({ answer });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}