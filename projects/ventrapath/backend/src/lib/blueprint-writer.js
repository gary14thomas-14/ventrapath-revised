export function buildAgentDrivenBlueprint(project, prompts) {
  const idea = String(project?.rawIdea ?? '').trim();
  const country = String(project?.country ?? '').trim() || 'Australia';
  const region = String(project?.region ?? '').trim();
  const prompt = String(prompts?.bob ?? '').trim();

  return {
    sections: {
      business: prompt,
      market: `Business idea: ${idea}`,
      monetisation: `Country: ${country}`,
      execution: region ? `Region: ${region}` : 'Region: not specified',
      legal: '',
      website: '',
      risks: '',
    },
    sourceMeta: {
      routing: ['bob'],
      runtimePromptsLoaded: Object.fromEntries(Object.entries(prompts).map(([key, value]) => [key, Boolean(value?.trim())])),
      writer: 'agent-driven-blueprint-writer-v24-prompt-only-shell',
    },
  };
}
