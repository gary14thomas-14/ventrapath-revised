import { buildAgentDrivenBlueprint } from '../src/lib/blueprint-writer.js';

const cases = [
  { name: 'Gelato Drop', rawIdea: 'AI-powered ice cream parlour', country: 'Australia', region: 'Perth', currencyCode: 'AUD' },
  { name: 'FIFO Flow', rawIdea: 'support platform for FIFO families', country: 'Australia', region: 'Perth', currencyCode: 'AUD' },
  { name: 'Tradie Books', rawIdea: 'bookkeeping for tradies', country: 'Australia', region: 'Perth', currencyCode: 'AUD' },
  { name: 'Glow Run', rawIdea: 'beauty salon', country: 'Australia', region: 'Perth', currencyCode: 'AUD' },
  { name: 'Nourish Loop', rawIdea: 'meal prep service for gym mums', country: 'Australia', region: 'Perth', currencyCode: 'AUD' },
  { name: 'Paw Mobile', rawIdea: 'mobile dog grooming service', country: 'Australia', region: 'Perth', currencyCode: 'AUD' },
  { name: 'Signal Nest', rawIdea: 'NDIS support coordination platform', country: 'Australia', region: 'Perth', currencyCode: 'AUD' },
  { name: 'Fixday', rawIdea: 'handyman service', country: 'Australia', region: 'Perth', currencyCode: 'AUD' },
  { name: 'Quiet Origin', rawIdea: 'online course for burnout recovery', country: 'Australia', region: 'Perth', currencyCode: 'AUD' },
  { name: 'Mirror Mobile', rawIdea: 'mobile car detailing service', country: 'Australia', region: 'Perth', currencyCode: 'AUD' },
  { name: 'Yard Reset', rawIdea: 'gardening service for busy homeowners', country: 'Australia', region: 'Perth', currencyCode: 'AUD' },
  { name: 'Exam Lift', rawIdea: 'online tutoring platform for high school maths', country: 'Australia', region: 'Perth', currencyCode: 'AUD' },
];

const requiredSectionChecks = [
  ['business', ['Unique twist:', 'Business form:', 'Primary buyer:', 'Primary payer:', 'Owned edge:', 'Operating spine:']],
  ['monetisation', ['AUD', 'Primary revenue model:']],
  ['execution', ['Launch around one sharp promise only:', 'Operating spine:']],
];

const bannedPhrases = [
  'standout service business',
  'sharper software business',
  'clearer signature promise',
  'clearer operational advantage',
  'buyers already looking for a credible solution',
  'the customer receiving the core value',
  'actual numbers attached before anything ships',
];

let failures = 0;
const openingLeads = [];

for (const project of cases) {
  const result = buildAgentDrivenBlueprint(project, {});
  openingLeads.push(String(result.sections.business ?? '').split(/\r?\n/)[0]?.trim() ?? '');

  for (const [sectionName, snippets] of requiredSectionChecks) {
    const section = String(result.sections[sectionName] ?? '');
    for (const snippet of snippets) {
      if (!section.includes(snippet)) {
        console.error(`FAIL [${project.rawIdea}] ${sectionName} missing snippet: ${snippet}`);
        failures += 1;
      }
    }
  }

  for (const phrase of bannedPhrases) {
    for (const [sectionName, text] of Object.entries(result.sections)) {
      if (String(text).toLowerCase().includes(phrase.toLowerCase())) {
        console.error(`FAIL [${project.rawIdea}] ${sectionName} contains banned phrase: ${phrase}`);
        failures += 1;
      }
    }
  }
}

if (new Set(openingLeads.map((value) => value.replace(/\s+/g, ' ').trim())).size < Math.ceil(cases.length / 2)) {
  console.error('FAIL opening lines are still collapsing into too few repeated patterns');
  failures += 1;
}

if (failures > 0) {
  console.error(`\n${failures} blueprint review check(s) failed.`);
  process.exit(1);
}

console.log(`Reviewed ${cases.length} blueprint fixtures: all checks passed.`);
