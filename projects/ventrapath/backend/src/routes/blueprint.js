import { randomUUID } from 'node:crypto';
import {
  createBlueprintVersionForProject,
  getAgentOutputCacheEntry,
  getProjectByIdForUser,
  getLatestBlueprintForProject,
  listBlueprintVersionsForProject,
  upsertAgentOutputCacheEntry,
} from '../lib/project-store.js';
import { buildBlueprintCacheIdentity } from '../lib/cache.js';
import { fail, ok, parseJsonBody } from '../lib/http.js';
import { runtimePrompts } from '../lib/runtime-prompts.js';
import { buildAgentDrivenBlueprint } from '../lib/blueprint-writer.js';
import { generateBlueprintWithOpenAI } from '../lib/openai-client.js';

const DEFAULT_DEV_USER_ID = '11111111-1111-4111-8111-111111111111';
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function getRequestUserId(req, env) {
  const headerUserId = req.headers['x-user-id'];

  if (typeof headerUserId === 'string' && headerUserId.trim()) {
    return headerUserId.trim();
  }

  if (env.nodeEnv === 'development') {
    return DEFAULT_DEV_USER_ID;
  }

  return null;
}

function validateUserId(userId, env) {
  if (env.persistenceDriver === 'postgres' && !UUID_PATTERN.test(userId)) {
    return 'User id must be a UUID when using postgres persistence';
  }

  return null;
}

async function loadPromptPack() {
  return runtimePrompts;
}

function isExistingBlueprintGood(existing) {
  const businessSection = String(existing?.sections?.business ?? '').toLowerCase();
  const marketSection = String(existing?.sections?.market ?? '').toLowerCase();
  const monetisationSection = String(existing?.sections?.monetisation ?? '').toLowerCase();
  const executionSection = String(existing?.sections?.execution ?? '').toLowerCase();
  const websiteSection = String(existing?.sections?.website ?? '').toLowerCase();
  const combined = [businessSection, marketSection, monetisationSection, executionSection, websiteSection].join('\n');
  const qualitySignals = existing?.meta?.sourceMeta?.qualitySignals ?? existing?.sourceMeta?.qualitySignals ?? null;

  if (!businessSection) return false;

  const staleSignals = [
    'becomes a structured ventrapath blueprint',
    'this company should become',
    'standout service business',
    'sharper software business',
    'clearer signature promise',
    'clearer operational advantage',
    'buyers already looking for a credible solution',
    'the customer receiving the core value',
    'actual numbers attached before anything ships',
    'positioned as a differentiated business rather than a vague concept',
    'the operating angle is framed to feel commercially legible fast',
    'primary market focus is shaped around buyers',
    'initial pricing should be tested as a directional market entry point',
    'first prove this can sell',
    'it is fundamentally',
    'build the repeatable system early',
    'local legend',
    'emotional reasons',
    'repeatable ritual',
  ];

  if (staleSignals.some((signal) => combined.includes(signal))) return false;
  const writer = existing?.meta?.sourceMeta?.writer ?? existing?.sourceMeta?.writer ?? null;

  if (writer === 'openai-direct-blueprint-v1') {
    return true;
  }

  if (!businessSection.includes('business form:')) return false;
  if (!businessSection.includes('primary buyer:')) return false;
  if (!businessSection.includes('primary payer:')) return false;
  if (!businessSection.includes('operating spine:')) return false;
  if (!businessSection.includes('core mechanic:')) return false;
  if (!monetisationSection.includes('primary revenue model:')) return false;
  if (!executionSection.includes('launch around one sharp promise only:')) return false;
  if (!executionSection.includes('core loop:')) return false;
  if (qualitySignals && qualitySignals.pass === false) return false;
  if (qualitySignals && qualitySignals.mechanismPresent === false) return false;
  if (qualitySignals && Number(qualitySignals.genericSignalCount) > 1) return false;

  return true;
}

export async function handleGenerateBlueprint(req, res, projectId, env) {
  const userId = getRequestUserId(req, env);

  if (!userId) {
    return fail(res, 401, 'UNAUTHENTICATED', 'Authenticated user is required');
  }

  const userIdError = validateUserId(userId, env);
  if (userIdError) {
    return fail(res, 400, 'INVALID_USER_ID', userIdError);
  }

  let body;

  try {
    body = await parseJsonBody(req);
  } catch {
    return fail(res, 400, 'INVALID_JSON', 'Request body must be valid JSON');
  }

  const regenerate = Boolean(body?.regenerate);
  const existing = await getLatestBlueprintForProject(projectId, userId, env);

  if (existing && !regenerate && isExistingBlueprintGood(existing)) {
    return ok(res, {
      run: {
        id: randomUUID(),
        type: 'blueprint_generation',
        status: 'completed',
      },
      blueprint: existing,
      reusedExisting: true,
    });
  }

  const project = await getProjectByIdForUser(projectId, userId, env);

  if (!project) {
    return fail(res, 404, 'PROJECT_NOT_FOUND', `Project ${projectId} was not found`);
  }

  const prompts = await loadPromptPack();
  const cacheIdentity = buildBlueprintCacheIdentity(project, {
    promptVersion: 'phase0-v24-prompt-only-shell',
    model: 'agent-writer-synth',
    agentId: 'bob.phase0-agent-writer',
    routingMode: 'phase0-agent-writer',
  });
  const cachedSections = await getAgentOutputCacheEntry(projectId, userId, cacheIdentity.cacheKey, env);

  let sections;
  let cacheHit = false;
  let sourceMeta;

  if (cachedSections && !regenerate) {
    sections = cachedSections.outputJson.sections;
    sourceMeta = cachedSections.sourceMetaJson ?? {};
    cacheHit = true;
  } else {
    let generated;

    if (env.openAiApiKey) {
      const ai = await generateBlueprintWithOpenAI({
        apiKey: env.openAiApiKey,
        model: env.openAiModel,
        prompt: prompts.bob,
        idea: project.rawIdea,
        country: project.country,
        region: project.region,
      });

      generated = {
        sections: ai.sections,
        sourceMeta: {
          routing: ['bob'],
          runtimePromptsLoaded: Object.fromEntries(Object.entries(prompts).map(([key, value]) => [key, Boolean(value?.trim())])),
          model: env.openAiModel,
          provider: 'openai',
          writer: 'openai-direct-blueprint-v1',
        },
      };
    } else {
      generated = buildAgentDrivenBlueprint(project, prompts);
    }

    sections = generated.sections;
    sourceMeta = generated.sourceMeta;

    await upsertAgentOutputCacheEntry(
      projectId,
      userId,
      {
        phaseNumber: cacheIdentity.phaseNumber,
        stepKey: cacheIdentity.stepKey,
        agentId: cacheIdentity.agentId,
        taskKind: cacheIdentity.taskKind,
        cacheKey: cacheIdentity.cacheKey,
        model: cacheIdentity.model,
        promptVersionHash: cacheIdentity.promptVersionHash,
        normalizedInputHash: cacheIdentity.normalizedInputHash,
        dependencyHash: cacheIdentity.dependencyHash,
        outputJson: { sections },
        sourceMetaJson: {
          ...cacheIdentity.sourceMeta,
          ...sourceMeta,
          jurisdictionKey: cacheIdentity.jurisdictionKey,
        },
      },
      env,
    );
  }

  const blueprint = await createBlueprintVersionForProject(projectId, userId, sections, env);

  if (!blueprint) {
    return fail(res, 404, 'PROJECT_NOT_FOUND', `Project ${projectId} was not found`);
  }

  const hydratedBlueprint = blueprint
    ? {
        ...blueprint,
        meta: {
          ...(blueprint.meta ?? {}),
          sourceMeta,
        },
      }
    : blueprint;

  return ok(res, {
    run: {
      id: randomUUID(),
      type: regenerate ? 'blueprint_regeneration' : 'blueprint_generation',
      status: 'completed',
    },
    blueprint: hydratedBlueprint,
    cache: {
      specialistSections: cacheHit ? 'hit' : 'miss',
    },
    routing: sourceMeta?.routing ?? null,
  });
}

export async function handleGetBlueprint(req, res, projectId, env) {
  const userId = getRequestUserId(req, env);

  if (!userId) {
    return fail(res, 401, 'UNAUTHENTICATED', 'Authenticated user is required');
  }

  const userIdError = validateUserId(userId, env);
  if (userIdError) {
    return fail(res, 400, 'INVALID_USER_ID', userIdError);
  }

  const blueprint = await getLatestBlueprintForProject(projectId, userId, env);

  if (!blueprint) {
    return fail(res, 404, 'BLUEPRINT_NOT_FOUND', `No blueprint exists for project ${projectId}`);
  }

  return ok(res, { blueprint });
}

export async function handleListBlueprintVersions(req, res, projectId, env) {
  const userId = getRequestUserId(req, env);

  if (!userId) {
    return fail(res, 401, 'UNAUTHENTICATED', 'Authenticated user is required');
  }

  const userIdError = validateUserId(userId, env);
  if (userIdError) {
    return fail(res, 400, 'INVALID_USER_ID', userIdError);
  }

  const versions = await listBlueprintVersionsForProject(projectId, userId, env);

  if (!versions) {
    return fail(res, 404, 'PROJECT_NOT_FOUND', `Project ${projectId} was not found`);
  }

  return ok(res, { versions });
}
