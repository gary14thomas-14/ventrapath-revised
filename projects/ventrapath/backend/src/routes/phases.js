import { randomUUID } from 'node:crypto';
import {
  getLatestBlueprintForProject,
  getPhaseInstanceForProject,
  getProjectByIdForUser,
  upsertPhaseInstanceForProject,
} from '../lib/project-store.js';
import { buildBrandPhase, buildFinancePhase, buildInfrastructurePhase, buildLaunchScalePhase, buildLegalPhase, buildMarketingPhase, buildOperationsPhase, buildProtectionPhase, buildSalesPhase } from '../lib/phase-data.js';
import { generateBrandNamesWithOpenAI } from '../lib/brand-name-generator.js';
import { buildFallbackLogoConceptPayload, generateLogoConceptsWithOpenAI } from '../lib/logo-designer.js';
import { fail, ok, parseJsonBody } from '../lib/http.js';

const DEFAULT_DEV_USER_ID = '11111111-1111-4111-8111-111111111111';
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const phaseDefinitions = [
  { number: 1, title: 'Brand' },
  { number: 2, title: 'Legal' },
  { number: 3, title: 'Finance' },
  { number: 4, title: 'Protection' },
  { number: 5, title: 'Infrastructure' },
  { number: 6, title: 'Marketing' },
  { number: 7, title: 'Operations' },
  { number: 8, title: 'Sales' },
  { number: 9, title: 'Growth & Milestones' },
]

const phaseSummaries = new Map([
  [1, 'Turn the blueprint into a usable external identity.'],
  [2, 'Translate the business into a practical legal setup path for the user\'s location.'],
  [3, 'Set up the financial foundations of the business with guided choices and tracking.'],
  [4, 'Protect the business with risk controls, insurance, contracts, privacy, and compliance habits.'],
  [5, 'Build the systems, tools, automation, and security stack the business runs on every day.'],
  [6, 'Define the audience, message, channels, content rhythm, and lead capture foundation for growth.'],
  [7, 'Set up how the business delivers reliably, communicates clearly, and scales without breaking.'],
  [8, 'Turn interest into paying customers with a clear, repeatable, and measurable sales process.'],
  [9, 'Guide the business through launch, growth, milestone tracking, optimisation, acquisition, and retention as it matures.'],
])

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

function buildPhaseForNumber(phaseNumber, project, blueprint, storedPhases, brandNaming) {
  const brandPhase = storedPhases.get(1) ?? null;
  const legalPhase = storedPhases.get(2) ?? null;
  const financePhase = storedPhases.get(3) ?? null;
  const protectionPhase = storedPhases.get(4) ?? null;
  const infrastructurePhase = storedPhases.get(5) ?? null;
  const marketingPhase = storedPhases.get(6) ?? null;
  const operationsPhase = storedPhases.get(7) ?? null;
  const salesPhase = storedPhases.get(8) ?? null;

  if (phaseNumber === 1) return buildBrandPhase(project, blueprint, brandNaming);
  if (phaseNumber === 2) return buildLegalPhase(project, blueprint, brandPhase);
  if (phaseNumber === 3) return buildFinancePhase(project, blueprint, brandPhase, legalPhase);
  if (phaseNumber === 4) return buildProtectionPhase(project, blueprint, brandPhase, legalPhase, financePhase);
  if (phaseNumber === 5) return buildInfrastructurePhase(project, blueprint, brandPhase, protectionPhase);
  if (phaseNumber === 6) return buildMarketingPhase(project, blueprint, brandPhase, infrastructurePhase);
  if (phaseNumber === 7) return buildOperationsPhase(project, blueprint, brandPhase, marketingPhase);
  if (phaseNumber === 8) return buildSalesPhase(project, blueprint, brandPhase, operationsPhase);

  return buildLaunchScalePhase(project, blueprint, brandPhase, salesPhase);
}

async function ensureStoredPhase(projectId, userId, project, blueprint, phaseNumber, env, storedPhases) {
  const existing = storedPhases.get(phaseNumber);

  if (existing) {
    return existing;
  }

  let brandNaming = null;

  if (phaseNumber === 1 && env.openAiApiKey) {
    try {
      brandNaming = await generateBrandNamesWithOpenAI({
        apiKey: env.openAiApiKey,
        model: env.openAiModel,
        project,
        blueprint,
      });
    } catch (error) {
      console.warn('Brand naming generation failed, falling back to deterministic options:', error);
    }
  }

  const phase = buildPhaseForNumber(phaseNumber, project, blueprint, storedPhases, brandNaming);
  const generatedAt = new Date().toISOString();
  const storedPhase = await upsertPhaseInstanceForProject(
    projectId,
    userId,
    {
      phaseNumber: phase.number,
      title: phase.title,
      state: 'ready',
      summary: phase.summary,
      generatedContent: phase.content,
      userState: phase.userState ?? {},
      progress: phase.progress ?? {},
      tasks: phase.tasks,
      generatedAt,
      latestRunId: null,
    },
    env,
  );

  storedPhases.set(phaseNumber, storedPhase);
  return storedPhase;
}

function validateUserId(userId, env) {
  if (env.persistenceDriver === 'postgres' && !UUID_PATTERN.test(userId)) {
    return 'User id must be a UUID when using postgres persistence';
  }

  return null;
}

function toPhaseOverview(project, storedPhases) {
  return phaseDefinitions.map((phase) => {
    const stored = storedPhases.find((item) => item?.phaseNumber === phase.number);

    if (stored) {
      return {
        number: phase.number,
        title: phase.title,
        state: stored.state,
        summary: phase.number === 9 ? (phaseSummaries.get(phase.number) ?? stored.summary) : stored.summary,
        progress: stored.progress ?? stored.generatedContent?.progress ?? null,
        taskCount: stored.tasks?.length ?? 0,
      };
    }

    const state = project.latestBlueprintVersionNumber
      ? 'available'
      : 'locked';

    return {
      number: phase.number,
      title: phase.title,
      state,
      summary: phaseSummaries.get(phase.number) ?? 'Queued for implementation.',
      progress: null,
      taskCount: 0,
    };
  });
}

export async function handleListPhases(req, res, projectId, env) {
  const userId = getRequestUserId(req, env);

  if (!userId) {
    return fail(res, 401, 'UNAUTHENTICATED', 'Authenticated user is required');
  }

  const userIdError = validateUserId(userId, env);
  if (userIdError) {
    return fail(res, 400, 'INVALID_USER_ID', userIdError);
  }

  const project = await getProjectByIdForUser(projectId, userId, env);

  if (!project) {
    return fail(res, 404, 'PROJECT_NOT_FOUND', `Project ${projectId} was not found`);
  }

  const [brandPhase, legalPhase, financePhase, protectionPhase, infrastructurePhase, marketingPhase, operationsPhase, salesPhase, launchScalePhase] = await Promise.all([
    getPhaseInstanceForProject(projectId, userId, 1, env),
    getPhaseInstanceForProject(projectId, userId, 2, env),
    getPhaseInstanceForProject(projectId, userId, 3, env),
    getPhaseInstanceForProject(projectId, userId, 4, env),
    getPhaseInstanceForProject(projectId, userId, 5, env),
    getPhaseInstanceForProject(projectId, userId, 6, env),
    getPhaseInstanceForProject(projectId, userId, 7, env),
    getPhaseInstanceForProject(projectId, userId, 8, env),
    getPhaseInstanceForProject(projectId, userId, 9, env),
  ]);

  return ok(res, {
    phases: toPhaseOverview(project, [brandPhase, legalPhase, financePhase, protectionPhase, infrastructurePhase, marketingPhase, operationsPhase, salesPhase, launchScalePhase].filter(Boolean)),
  });
}

export async function handleGeneratePhase(req, res, projectId, phaseNumber, env) {
  const userId = getRequestUserId(req, env);

  if (!userId) {
    return fail(res, 401, 'UNAUTHENTICATED', 'Authenticated user is required');
  }

  const userIdError = validateUserId(userId, env);
  if (userIdError) {
    return fail(res, 400, 'INVALID_USER_ID', userIdError);
  }

  const numericPhase = Number(phaseNumber);

  if (![1, 2, 3, 4, 5, 6, 7, 8, 9].includes(numericPhase)) {
    return fail(res, 400, 'PHASE_NOT_IMPLEMENTED', 'Only Phases 1, 2, 3, 4, 5, 6, 7, 8, and 9 are implemented right now');
  }

  const project = await getProjectByIdForUser(projectId, userId, env);

  if (!project) {
    return fail(res, 404, 'PROJECT_NOT_FOUND', `Project ${projectId} was not found`);
  }

  const blueprint = await getLatestBlueprintForProject(projectId, userId, env);

  if (!blueprint) {
    return fail(res, 400, 'BLUEPRINT_REQUIRED', 'Generate a blueprint before creating Phase 1 Brand');
  }

  const storedPhases = new Map();

  for (let prerequisite = 1; prerequisite < numericPhase; prerequisite += 1) {
    const existing = await getPhaseInstanceForProject(projectId, userId, prerequisite, env);

    if (existing) {
      storedPhases.set(prerequisite, existing);
      continue;
    }

    await ensureStoredPhase(projectId, userId, project, blueprint, prerequisite, env, storedPhases);
  }

  const currentPhase = await getPhaseInstanceForProject(projectId, userId, numericPhase, env);

  if (currentPhase) {
    storedPhases.set(numericPhase, currentPhase);
  }

  const storedPhase = await ensureStoredPhase(projectId, userId, project, blueprint, numericPhase, env, storedPhases);

  return ok(res, {
    run: {
      id: randomUUID(),
      type: 'phase_generation',
      status: 'completed',
      phaseNumber: numericPhase,
    },
    phase: storedPhase,
  });
}

export async function handleGenerateLogoConcepts(req, res, projectId, env) {
  const userId = getRequestUserId(req, env);

  if (!userId) {
    return fail(res, 401, 'UNAUTHENTICATED', 'Authenticated user is required');
  }

  const userIdError = validateUserId(userId, env);
  if (userIdError) {
    return fail(res, 400, 'INVALID_USER_ID', userIdError);
  }

  const project = await getProjectByIdForUser(projectId, userId, env);

  if (!project) {
    return fail(res, 404, 'PROJECT_NOT_FOUND', `Project ${projectId} was not found`);
  }

  const blueprint = await getLatestBlueprintForProject(projectId, userId, env);

  if (!blueprint) {
    return fail(res, 400, 'BLUEPRINT_REQUIRED', 'Generate a blueprint before asking the Logo Designer for concepts');
  }

  const phase = await getPhaseInstanceForProject(projectId, userId, 1, env);

  if (!phase) {
    return fail(res, 400, 'BRAND_REQUIRED', 'Generate Phase 1 Brand before asking the Logo Designer for concepts');
  }

  let body = null;

  try {
    body = await parseJsonBody(req);
  } catch {
    return fail(res, 400, 'INVALID_JSON', 'Request body must be valid JSON');
  }

  const requestedPrompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';
  const promptOverride = requestedPrompt
    ? {
        ...phase,
        generatedContent: {
          ...(phase.generatedContent ?? {}),
          brandLayer: {
            ...((phase.generatedContent?.brandLayer && typeof phase.generatedContent.brandLayer === 'object') ? phase.generatedContent.brandLayer : {}),
            visualDirection: {
              ...((phase.generatedContent?.brandLayer?.visualDirection && typeof phase.generatedContent.brandLayer.visualDirection === 'object') ? phase.generatedContent.brandLayer.visualDirection : {}),
              logoPrompt: requestedPrompt,
            },
          },
        },
      }
    : phase;

  try {
    const payload = env.openAiApiKey
      ? await generateLogoConceptsWithOpenAI({
          apiKey: env.openAiApiKey,
          model: env.openAiModel,
          project,
          blueprint,
          phase: promptOverride,
        })
      : buildFallbackLogoConceptPayload({ project, blueprint, phase: promptOverride });

    return ok(res, {
      logoConcepts: payload.concepts,
      source: payload.source,
      agent: 'logo-designer',
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Logo concept generation failed, returning fallback concepts:', error);
    const fallback = buildFallbackLogoConceptPayload({ project, blueprint, phase: promptOverride });

    return ok(res, {
      logoConcepts: fallback.concepts,
      source: fallback.source,
      agent: 'logo-designer',
      generatedAt: new Date().toISOString(),
    });
  }
}

export async function handleUpdatePhase(req, res, projectId, phaseNumber, env) {
  const userId = getRequestUserId(req, env);

  if (!userId) {
    return fail(res, 401, 'UNAUTHENTICATED', 'Authenticated user is required');
  }

  const userIdError = validateUserId(userId, env);
  if (userIdError) {
    return fail(res, 400, 'INVALID_USER_ID', userIdError);
  }

  const numericPhase = Number(phaseNumber);
  const phase = await getPhaseInstanceForProject(projectId, userId, numericPhase, env);

  if (!phase) {
    return fail(res, 404, 'PHASE_NOT_FOUND', `Phase ${phaseNumber} was not found for project ${projectId}`);
  }

  let body = null;

  try {
    body = await parseJsonBody(req);
  } catch {
    return fail(res, 400, 'INVALID_JSON', 'Request body must be valid JSON');
  }

  const nextUserState = body?.userState;
  const nextProgress = body?.progress;

  if (nextUserState != null && (typeof nextUserState !== 'object' || Array.isArray(nextUserState))) {
    return fail(res, 400, 'INVALID_USER_STATE', 'userState must be an object when provided');
  }

  if (nextProgress != null && (typeof nextProgress !== 'object' || Array.isArray(nextProgress))) {
    return fail(res, 400, 'INVALID_PROGRESS', 'progress must be an object when provided');
  }

  const updatedPhase = await upsertPhaseInstanceForProject(
    projectId,
    userId,
    {
      phaseNumber: phase.phaseNumber,
      title: phase.title,
      state: phase.state,
      summary: phase.summary,
      generatedContent: phase.generatedContent,
      userState: nextUserState ? { ...(phase.userState ?? {}), ...nextUserState } : (phase.userState ?? {}),
      progress: nextProgress ? { ...(phase.progress ?? {}), ...nextProgress } : (phase.progress ?? {}),
      tasks: phase.tasks,
      generatedAt: phase.generatedAt ?? new Date().toISOString(),
      latestRunId: phase.latestRunId ?? null,
    },
    env,
  );

  return ok(res, { phase: updatedPhase });
}

export async function handleGetPhase(req, res, projectId, phaseNumber, env) {
  const userId = getRequestUserId(req, env);

  if (!userId) {
    return fail(res, 401, 'UNAUTHENTICATED', 'Authenticated user is required');
  }

  const userIdError = validateUserId(userId, env);
  if (userIdError) {
    return fail(res, 400, 'INVALID_USER_ID', userIdError);
  }

  const numericPhase = Number(phaseNumber);
  const phase = await getPhaseInstanceForProject(projectId, userId, numericPhase, env);

  if (!phase) {
    return fail(res, 404, 'PHASE_NOT_FOUND', `Phase ${phaseNumber} was not found for project ${projectId}`);
  }

  const normalizedPhase = numericPhase === 9
    ? {
        ...phase,
        title: 'Growth & Milestones',
        summary: 'Launch the business cleanly, then keep this final phase evolving around growth, milestones, optimisation, acquisition, and retention.',
        generatedContent: phase.generatedContent
          ? {
              ...phase.generatedContent,
              launchScaleLayer: phase.generatedContent.launchScaleLayer
                ? {
                    ...phase.generatedContent.launchScaleLayer,
                    completionCallout: {
                      ...(phase.generatedContent.launchScaleLayer.completionCallout ?? {}),
                      badge: 'Phase 9 Complete',
                      title: 'Built to Grow With the Company',
                      description: 'Keep evolving this phase around real milestones, growth targets, customer feedback, and operating lessons as the business matures.',
                    },
                  }
                : phase.generatedContent.launchScaleLayer,
            }
          : phase.generatedContent,
      }
    : phase;

  return ok(res, { phase: normalizedPhase });
}
