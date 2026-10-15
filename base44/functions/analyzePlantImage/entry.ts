import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { image_url } = await req.json();
    if (!image_url || typeof image_url !== 'string') {
      return Response.json({ error: 'image_url is required' }, { status: 400 });
    }

    const prompt = `You are a careful biology teaching assistant analyzing a photo of a plant or leaf for a high school Biology class (Grades 10-12).

Look closely at the visible symptoms in the image (spots, yellowing/chlorosis, browning, holes, wilting, deformation, discoloration, mold, etc.).

Then provide:
1. A short guess of the plant type if identifiable (or "unknown").
2. A list of specific detected visible symptoms.
3. 1-3 possible biological conditions/diseases that could explain these symptoms, each with a likelihood (low/medium/high) and a short description.
4. An overall confidence_level (low/medium/high) for this whole analysis, based on image clarity and how distinctive the symptoms are.
5. A clear biological_explanation (2-4 sentences) of the plant biology/pathology behind why such symptoms occur (e.g. nutrient deficiency, fungal infection, pest damage, environmental stress).
6. is_unclear: true if the image is blurry, too zoomed out, not actually a plant, or otherwise insufficient for analysis.
7. A warning message reminding the student this is an educational AI estimate, NOT a professional/certified diagnosis, and that they should consult a real plant pathologist or extension service for real-world plant care decisions. If is_unclear is true, the warning should also explain what's wrong with the image.

Be educational, encouraging, and scientifically grounded. Never claim certainty.

IMPORTANT: Write ALL text content (plant_type_guess, symptoms, possible_conditions names/descriptions, biological_explanation, warning) in Vietnamese. Only the field names in the JSON and the enum values (low/medium/high, true/false) stay in English.`;

    const schema = {
      type: 'object',
      properties: {
        plant_type_guess: { type: 'string' },
        symptoms: { type: 'array', items: { type: 'string' } },
        possible_conditions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              likelihood: { type: 'string', enum: ['low', 'medium', 'high'] },
              description: { type: 'string' }
            },
            required: ['name', 'likelihood', 'description']
          }
        },
        confidence_level: { type: 'string', enum: ['low', 'medium', 'high'] },
        biological_explanation: { type: 'string' },
        is_unclear: { type: 'boolean' },
        warning: { type: 'string' }
      },
      required: ['symptoms', 'possible_conditions', 'confidence_level', 'biological_explanation', 'is_unclear', 'warning']
    };

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      file_urls: [image_url],
      response_json_schema: schema
    });

    return Response.json({ analysis: result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}