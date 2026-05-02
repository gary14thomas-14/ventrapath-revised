const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

function extractJsonObject(text) {
  const trimmed = String(text ?? '').trim();

  if (!trimmed) return null;

  try {
    return JSON.parse(trimmed);
  } catch {}

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced) {
    try {
      return JSON.parse(fenced[1]);
    } catch {}
  }

  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    try {
      return JSON.parse(trimmed.slice(start, end + 1));
    } catch {}
  }

  return null;
}

export async function generateBlueprintWithOpenAI({ apiKey, model, prompt, idea, country, region }) {
  const userPrompt = [
    prompt,
    '',
    'Return valid JSON only with exactly these top-level string fields:',
    'business, market, monetisation, execution, legal, website, risks',
    '',
    `Business idea: ${idea}`,
    `Country: ${country}`,
    `Region: ${region || 'not specified'}`,
  ].join('\n');

  const response = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.9,
      messages: [
        {
          role: 'system',
          content: 'Return valid JSON only. No markdown, no commentary, no code fences.',
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content ?? '';
  const parsed = extractJsonObject(content);

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('OpenAI response did not contain valid JSON object content');
  }

  const requiredKeys = ['business', 'market', 'monetisation', 'execution', 'legal', 'website', 'risks'];
  for (const key of requiredKeys) {
    if (typeof parsed[key] !== 'string') {
      throw new Error(`OpenAI response missing string field: ${key}`);
    }
  }

  return {
    sections: Object.fromEntries(requiredKeys.map((key) => [key, String(parsed[key]).trim()])),
    raw: data,
  };
}
