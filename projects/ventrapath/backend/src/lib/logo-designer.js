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

function asString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normaliseConcept(concept, index) {
  return {
    id: asString(concept?.id) || `concept-${index + 1}`,
    name: asString(concept?.name) || `Concept ${index + 1}`,
    style: asString(concept?.style),
    rationale: asString(concept?.rationale),
    prompt: asString(concept?.prompt),
  };
}

function buildFallbackLogoConcepts({ project, blueprint, phase }) {
  const name = asString(project?.name) || 'the business';
  const idea = asString(project?.rawIdea) || asString(project?.idea) || '';
  const business = asString(blueprint?.sections?.business);
  const market = asString(blueprint?.sections?.market);
  const visual = phase?.generatedContent?.brandLayer?.visualDirection ?? {};
  const promptSeed = asString(visual.logoPrompt)
    || `Create a premium, modern logo for ${name}. Dark UI compatible, clean geometry, confident typography, subtle blue-purple tech edge, still human and commercially credible.`;
  const palette = Object.entries(visual.colourPalette ?? {})
    .map(([label, colors]) => `${label}: ${asArray(colors).join(', ')}`)
    .join(' | ');
  const fontDirection = asArray(visual.fontOptions)
    .map((font) => `${asString(font?.name)}${asString(font?.style) ? ` (${asString(font?.style)})` : ''}`)
    .filter(Boolean)
    .join(', ');
  const strategyContext = [business, market, idea].filter(Boolean).join(' ');

  return [
    {
      id: 'wordmark',
      name: 'Wordmark',
      style: 'Typography-first',
      rationale: `Lead with a clean wordmark so ${name} feels credible, premium, and easy to deploy across web, social, and packaging.`,
      prompt: `${promptSeed} Create a wordmark-only logo direction. Focus on distinctive typography, restrained geometry, strong legibility, and a premium dark-UI-friendly finish. Context: ${strategyContext}`.trim(),
    },
    {
      id: 'icon-wordmark',
      name: 'Icon + Wordmark',
      style: 'Symbol plus name',
      rationale: `Give ${name} a recognisable symbol that can work as an app mark, favicon, or packaging badge without losing the premium feel.`,
      prompt: `${promptSeed} Create an icon + wordmark logo direction. The symbol should feel ownable, simple, and commercially credible rather than generic startup fluff. Use this palette where helpful: ${palette || 'keep to a restrained premium palette'}.`.trim(),
    },
    {
      id: 'minimal-premium',
      name: 'Minimal Premium',
      style: 'Editorial / luxury restraint',
      rationale: `Explore a more elevated direction for ${name} with subtle confidence and cleaner restraint, suitable for a premium product or service brand.`,
      prompt: `${promptSeed} Create a minimal premium logo direction with subtle luxury restraint, polished spacing, and confident typography. Font direction to reference: ${fontDirection || 'modern sans with premium restraint'}.`.trim(),
    },
  ];
}

export async function generateLogoConceptsWithOpenAI({ apiKey, model, project, blueprint, phase }) {
  const fallback = buildFallbackLogoConcepts({ project, blueprint, phase });
  const brandLayer = phase?.generatedContent?.brandLayer ?? {};
  const visual = brandLayer.visualDirection ?? {};
  const projectName = asString(project?.name);
  const idea = asString(project?.rawIdea) || asString(project?.idea);
  const country = asString(project?.country) || 'Australia';
  const business = asString(blueprint?.sections?.business);
  const market = asString(blueprint?.sections?.market);
  const positioning = visual.positioning ?? {};
  const palette = JSON.stringify(visual.colourPalette ?? {}, null, 2);
  const fontOptions = JSON.stringify(visual.fontOptions ?? [], null, 2);
  const promptSeed = asString(visual.logoPrompt);

  const userPrompt = [
    'You are the Logo Designer agent for a serious business-building platform.',
    'Return valid JSON only.',
    'Create exactly 3 strong logo concepts for this business.',
    'Concept 1 must be a wordmark direction.',
    'Concept 2 must be an icon + wordmark direction.',
    'Concept 3 must be a premium minimal direction.',
    'Avoid generic startup clichés, swooshes, random gradients, or childish mascot energy unless the business absolutely demands it.',
    'Each concept must feel commercially credible and distinct.',
    '',
    'Return JSON with this exact shape only:',
    '{',
    '  "concepts": [',
    '    {',
    '      "id": "string",',
    '      "name": "string",',
    '      "style": "string",',
    '      "rationale": "string",',
    '      "prompt": "string"',
    '    }',
    '  ]',
    '}',
    '',
    `Project name: ${projectName}`,
    `Business idea: ${idea}`,
    `Country: ${country}`,
    `Blueprint business section: ${business}`,
    `Blueprint market section: ${market}`,
    `Positioning: ${JSON.stringify(positioning, null, 2)}`,
    `Palette guidance: ${palette}`,
    `Font options: ${fontOptions}`,
    `Existing logo seed: ${promptSeed}`,
  ].join('\n');

  const response = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.8,
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
    throw new Error(`OpenAI logo concept request failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content ?? '';
  const parsed = extractJsonObject(content);
  const concepts = asArray(parsed?.concepts)
    .map(normaliseConcept)
    .filter((concept) => concept.name && concept.prompt)
    .slice(0, 3);

  if (concepts.length !== 3) {
    return {
      concepts: fallback,
      source: 'fallback',
      raw: data,
    };
  }

  return {
    concepts,
    source: 'openai',
    raw: data,
  };
}

export function buildFallbackLogoConceptPayload(input) {
  return {
    concepts: buildFallbackLogoConcepts(input),
    source: 'fallback',
    raw: null,
  };
}
