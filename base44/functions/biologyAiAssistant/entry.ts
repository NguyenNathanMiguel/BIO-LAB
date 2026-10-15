import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { observation, evidence, hypothesis, conclusion, image_url, message, topic, explain } = await req.json();
    const textBlob = JSON.stringify({ observation, evidence, hypothesis, conclusion, topic, message });
    if (textBlob.length > 12000 || (image_url && (typeof image_url !== 'string' || image_url.length > 2000 || !image_url.startsWith('https://')))) {
      return Response.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Legacy "explain a selected structure" mode (used by microscope-style explain requests).
    if (explain === true) {
      const explainPrompt = `You are a Socratic high school Biology learning assistant. A student recorded the following in their observation journal${topic ? ` (topic: ${topic})` : ''}:

Observation: ${observation || '(none)'}
Evidence: ${evidence || '(none)'}
Hypothesis: ${hypothesis || '(none)'}

The student explicitly requested a biological explanation of an already selected structure. Explain its name, role and how its form supports its function in the feedback field. Do not invent observations. Respond with:
1. guiding_questions: 1-2 brief follow-up questions.
2. hints: 1-2 short biological hints.
3. feedback: the requested structural explanation (2-4 sentences), but do not write the student's experiment conclusion for them.

Write ALL text content in Vietnamese. Only JSON field names stay in English.`;
      const explainSchema = {
        type: 'object',
        properties: {
          guiding_questions: { type: 'array', items: { type: 'string' } },
          hints: { type: 'array', items: { type: 'string' } },
          feedback: { type: 'string' }
        },
        required: ['guiding_questions', 'hints', 'feedback']
      };
      const explainResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: explainPrompt,
        file_urls: image_url ? [image_url] : undefined,
        response_json_schema: explainSchema
      });
      return Response.json({ guidance: explainResult });
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return Response.json({ error: 'message is required' }, { status: 400 });
    }

    const wantsFullWrite = /vi[ếe]t\s+ho[àa]n\s+ch[ỉi]nh|vi[ếe]t\s+(gi[úu]p|h[ộô])\s+t[oô]i|l[àa]m\s+gi[úu]p\s+t[oô]i/i.test(message);

    const prompt = `Bạn là một TRỢ LÝ HƯỚNG DẪN môn Sinh học cho học sinh lớp 10-12, đang trả lời câu hỏi của học sinh trong khi họ ghi Nhật Ký Quan Sát khoa học. Vai trò của bạn là giúp học sinh biết PHẢI quan sát gì và viết gì — KHÔNG làm bài thay học sinh, trừ khi họ yêu cầu rõ ràng.

Ảnh học sinh đính kèm (nếu có) là bằng chứng duy nhất được phép dùng để đưa ra gợi ý cụ thể. Nếu không có ảnh, hoặc ảnh không đủ rõ, bạn phải nói rõ điều đó và không được bịa ra chi tiết không nhìn thấy được. Hãy phân tích hình ảnh trước khi trả lời.

Nội dung học sinh đã tự viết trong Nhật Ký (có thể trống):
- Quan sát: ${observation || '(chưa viết)'}
- Bằng chứng: ${evidence || '(chưa viết)'}
- Giả thuyết: ${hypothesis || '(chưa viết)'}
- Kết luận: ${conclusion || '(chưa viết)'}

Câu hỏi của học sinh: "${message}"

QUY TẮC BẮT BUỘC:
1. Nếu học sinh hỏi kiểu "viết gì?", "ghi gì?", "không biết viết", "cho tôi gợi ý" — TUYỆT ĐỐI KHÔNG tự viết câu trả lời hoàn chỉnh thay họ. Chỉ hướng dẫn ngắn gọn cần chú ý điều gì, rồi đưa ra 3-5 GỢI Ý cụ thể (mỗi gợi ý một dòng, bắt đầu bằng "- ") dựa trực tiếp trên hình ảnh, KHÔNG chung chung, không bịa đặc điểm không thấy trong ảnh.
2. Khi giải thích một đối tượng/đặc điểm, PHẢI nói nó là gì trước, rồi mới đến vị trí, đặc điểm, vai trò/tác dụng — chỉ nói vai trò/tác dụng khi có đủ căn cứ từ ảnh.
3. Nếu một đặc điểm/bộ phận không xuất hiện trong ảnh: phải nói đúng câu "Không quan sát thấy trong hình ảnh."
4. Nếu ảnh không đủ rõ để xác định: phải nói đúng câu "Không thể xác định rõ từ hình ảnh."
5. Nếu học sinh hỏi về tác dụng/vai trò nhưng ảnh không đủ để xác định: phải nói đúng câu "Không thể xác định tác dụng chỉ từ hình ảnh; cần thêm thông tin."
6. Phân biệt rõ, không biến suy đoán thành sự thật: Quan sát = thấy trực tiếp; Bằng chứng = chi tiết dùng để chứng minh; Giả thuyết = giải thích có khả năng (dùng "có thể", "có khả năng"); Kết luận = điều có đủ căn cứ để rút ra.
7. Nếu học sinh đã tự viết một phần nào đó (không trống) và câu hỏi liên quan đến phần đó, hãy nhận xét phần nào đúng, phần nào còn thiếu/chưa rõ, rồi gợi ý để họ TỰ bổ sung — không viết lại thay họ.
8. CHỈ khi học sinh yêu cầu RÕ RÀNG kiểu "viết hoàn chỉnh giúp tôi" (${wantsFullWrite ? "ĐÚNG trường hợp này" : "KHÔNG phải trường hợp này"}) thì mới được viết thành câu trả lời hoàn chỉnh cho phần được hỏi, dựa trên ảnh và nội dung đã có. Nếu không, luôn ưu tiên hướng dẫn + gợi ý, không viết bài thay học sinh.

Trả lời ngắn gọn, dễ đọc, chia thành các dòng riêng khi cần (không dùng markdown *, #, chỉ dùng "- " cho danh sách). Toàn bộ nội dung phải bằng tiếng Việt.

Trả lời bằng JSON với cấu trúc: { "answer": "..." }`;

    const schema = {
      type: 'object',
      properties: { answer: { type: 'string' } },
      required: ['answer']
    };

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      file_urls: image_url ? [image_url] : undefined,
      response_json_schema: schema
    });

    return Response.json({ answer: result.answer });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}