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

function cleanName(value) {
  return String(value ?? '')
    .replace(/["'`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function generateBrandNamesWithOpenAI({ apiKey, model, project, blueprint }) {
  const business = String(blueprint?.sections?.business ?? '').trim();
  const market = String(blueprint?.sections?.market ?? '').trim();
  const idea = String(project?.rawIdea ?? '').trim();
  const country = String(project?.country ?? '').trim() || 'Australia';
  const region = String(project?.region ?? '').trim();

  const userPrompt = [
    'You are naming a real business brand.',
    'Return valid JSON only.',
    'Generate exactly 6 brand name candidates and recommend 1 of them.',
    'Names must be short, brand-like, and usable as actual company names.',
    'Do not return descriptive phrases like "AI Ice Cream Parlour" or "Australia Subscription Box".',
    'Do not return sentences, taglines, or explanations as the names.',
    'Avoid generic suffix spam like Studio, Co, Group, Hub unless it genuinely helps.',
    'Make the names feel specific to the business concept and its twist.',
    '',
    'Return JSON with this shape only:',
    '{',
    '  "recommendedName": { "name": "string", "rationale": "string" },',
    '  "nameOptions": [',
    '    { "name": "string", "rationale": "string" }',
    '  ]',
    '}',
    '',
    `Business idea: ${idea}`,
    `Country: ${country}`,
    `Region: ${region || 'not specified'}`,
    `Blueprint business section: ${business}`,
    `Blueprint market section: ${market}`,
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
    throw new Error(`OpenAI brand naming request failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content ?? '';
  const parsed = extractJsonObject(content);

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Brand naming response did not contain valid JSON object content');
  }

  const nameOptions = Array.isArray(parsed.nameOptions) ? parsed.nameOptions : [];
  const cleanedOptions = nameOptions
    .map((option) => ({
      name: cleanName(option?.name),
      rationale: String(option?.rationale ?? '').trim(),
    }))
    .filter((option) => option.name)
    .slice(0, 6);

  const recommendedSource = parsed.recommendedName ?? cleanedOptions[0] ?? null;
  const recommendedName = recommendedSource
    ? {
        name: cleanName(recommendedSource.name),
        rationale: String(recommendedSource.rationale ?? '').trim(),
      }
    : null;

  if (!recommendedName?.name || cleanedOptions.length === 0) {
    throw new Error('Brand naming response missing usable name candidates');
  }

  return {
    recommendedName,
    nameOptions: cleanedOptions,
    raw: data,
  };
}
