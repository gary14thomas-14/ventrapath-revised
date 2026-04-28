import { randomUUID } from 'node:crypto';
import {
  getLatestBlueprintForProject,
  getPhaseInstanceForProject,
  getProjectByIdForUser,
  upsertPhaseInstanceForProject,
} from '../lib/project-store.js';
import { buildBrandPhase, buildLegalPhase } from '../lib/phase-data.js';
import { fail, ok } from '../lib/http.js';

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
  { number: 9, title: 'Launch & Scale' },
]

const phaseSummaries = new Map([
  [1, 'Turn the blueprint into a usable external identity.'],
  [2, 'Translate the business into a practical legal setup path for the user\'s location.'],
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
        title: stored.title,
        state: stored.state,
        summary: stored.summary,
        progress: stored.generatedContent?.progress ?? null,
        taskCount: stored.tasks?.length ?? 0,
      };
    }

    const state = project.latestBlueprintVersionNumber
      ? (phase.number <= 2 ? 'available' : 'locked')
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

  const [brandPhase, legalPhase] = await Promise.all([
    getPhaseInstanceForProject(projectId, userId, 1, env),
    getPhaseInstanceForProject(projectId, userId, 2, env),
  ]);

  return ok(res, {
    phases: toPhaseOverview(project, [brandPhase, legalPhase].filter(Boolean)),
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

  if (![1, 2].includes(numericPhase)) {
    return fail(res, 400, 'PHASE_NOT_IMPLEMENTED', 'Only Phases 1 and 2 are implemented right now');
  }

  const project = await getProjectByIdForUser(projectId, userId, env);

  if (!project) {
    return fail(res, 404, 'PROJECT_NOT_FOUND', `Project ${projectId} was not found`);
  }

  const blueprint = await getLatestBlueprintForProject(projectId, userId, env);

  if (!blueprint) {
    return fail(res, 400, 'BLUEPRINT_REQUIRED', 'Generate a blueprint before creating Phase 1 Brand');
  }

  const brandPhase = numericPhase === 2
    ? await getPhaseInstanceForProject(projectId, userId, 1, env)
    : null;

  if (numericPhase === 2 && !brandPhase) {
    return fail(res, 400, 'BRAND_REQUIRED', 'Generate Phase 1 Brand before creating Phase 2 Legal');
  }

  const phase = numericPhase === 1
    ? buildBrandPhase(project, blueprint)
    : buildLegalPhase(project, blueprint, brandPhase);
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
      tasks: phase.tasks,
      generatedAt,
      latestRunId: randomUUID(),
    },
    env,
  );

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

  return ok(res, { phase });
}
