import { createHash } from 'node:crypto';

export function stableStringify(value) {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }

  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
}

export function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

export function hashObject(value) {
  return sha256(stableStringify(value));
}

export function buildBlueprintCacheIdentity(project, options = {}) {
  const promptVersion = options.promptVersion ?? 'phase0-v1';
  const model = options.model ?? 'template';
  const phaseNumber = 0;
  const taskKind = 'blueprint_sections';
  const agentId = 'blueprint_stub';
  const normalizedInput = {
    rawIdea: project.rawIdea,
    country: project.country,
    region: project.region ?? null,
    currencyCode: project.currencyCode,
    hoursPerWeek: project.hoursPerWeek,
    status: project.status,
    currentPhaseNumber: project.currentPhaseNumber,
  };
  const normalizedInputHash = hashObject(normalizedInput);
  const dependencyHash = hashObject({
    blueprintVersion: project.latestBlueprintVersionNumber ?? 0,
    routingMode: options.routingMode ?? 'phase0-default',
  });
  const promptVersionHash = sha256(promptVersion);
  const jurisdictionKey = `${project.country}::${project.region ?? ''}`;
  const cacheKey = sha256(stableStringify({
    projectId: project.id,
    phaseNumber,
    stepKey: null,
    agentId,
    taskKind,
    model,
    promptVersionHash,
    normalizedInputHash,
    dependencyHash,
    jurisdictionKey,
  }));

  return {
    projectId: project.id,
    phaseNumber,
    stepKey: null,
    agentId,
    taskKind,
    cacheKey,
    model,
    promptVersion,
    promptVersionHash,
    normalizedInputHash,
    dependencyHash,
    jurisdictionKey,
    sourceMeta: {
      normalizedInput,
      routingMode: options.routingMode ?? 'phase0-default',
      cacheLayer: 'specialist-output',
    },
  };
}
