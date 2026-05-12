function buildBusinessSection(idea, country, region) {
  return [
    `${idea} is a locally tailored business concept designed for ${country}${region ? `, ${region}` : ''}.`,
    'Unique twist: position it as a premium, AI-assisted experience with faster service, tighter customer retention, and a sharper brand than a standard local operator.',
    'Offer a signature angle customers can immediately repeat to others, not just a generic version of an existing business.',
  ].join('\n\n');
}

function buildMarketSection(idea, country) {
  return [
    `Primary buyers: people in ${country} already paying for a solution in this category but frustrated by slow service, inconsistent quality, or forgettable operators.`,
    `Why they switch: ${idea} should feel easier to trust, easier to buy from, and more distinctive than the safe-but-boring alternatives.`,
    'Compete on speed, clarity, presentation, and repeat-worthy differentiation rather than trying to be the cheapest option.',
  ].join('\n\n');
}

function buildMonetisationSection(country) {
  return [
    `Use pricing in ${country} local market terms with a modest premium if the differentiated offer is real and visible to customers.`,
    'Anchor revenue on core offers first, then layer add-ons, bundles, memberships, retainers, or premium tiers where they genuinely fit.',
    'Do not underprice. If the experience is faster, cleaner, or more specialised, charge for that advantage.',
  ].join('\n\n');
}

function buildExecutionSection(region) {
  return [
    'Launch: validate demand with a tight offer, simple landing page, clear conversion path, and direct customer outreach.',
    'Improve: refine positioning, pricing, scripts, and delivery based on real buyer behaviour.',
    `Scale: systemise operations${region ? ` for ${region}` : ''}, protect margins, and expand only after the core workflow is repeatable.`,
  ].join('\n\n');
}

function buildLegalSection(country) {
  return [
    `Check the business structure, registrations, tax obligations, insurance needs, and any sector-specific approvals required in ${country}.`,
    'Only include real obligations tied to the category. Avoid padding with generic legal trivia.',
  ].join('\n\n');
}

function buildWebsiteSection() {
  return [
    'The site should explain the offer fast, show why this business is different, and make the next step obvious.',
    'Prioritise conversion: clear headline, proof, offer detail, FAQ, and direct call to action.',
  ].join('\n\n');
}

function buildRisksSection() {
  return [
    'Main risks: weak differentiation, underpricing, inconsistent execution, and assuming demand without testing.',
    'If the unique twist is not obvious to customers within seconds, the business will collapse back into a generic commodity offer.',
  ].join('\n\n');
}

export function buildAgentDrivenBlueprint(project, prompts) {
  const idea = String(project?.rawIdea ?? '').trim();
  const country = String(project?.country ?? '').trim() || 'Australia';
  const region = String(project?.region ?? '').trim();

  return {
    sections: {
      business: buildBusinessSection(idea, country, region),
      market: buildMarketSection(idea, country),
      monetisation: buildMonetisationSection(country),
      execution: buildExecutionSection(region),
      legal: buildLegalSection(country),
      website: buildWebsiteSection(),
      risks: buildRisksSection(),
    },
    sourceMeta: {
      routing: ['bob'],
      runtimePromptsLoaded: Object.fromEntries(Object.entries(prompts).map(([key, value]) => [key, Boolean(value?.trim())])),
      writer: 'agent-driven-blueprint-writer-v24-fallback-template',
      fallbackUsed: true,
    },
  };
}
