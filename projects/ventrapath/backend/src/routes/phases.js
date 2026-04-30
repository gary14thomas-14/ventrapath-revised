import { randomUUID } from 'node:crypto';
import {
  getLatestBlueprintForProject,
  getPhaseInstanceForProject,
  getProjectByIdForUser,
  upsertPhaseInstanceForProject,
} from '../lib/project-store.js';
import { buildBrandPhase, buildFinancePhase, buildInfrastructurePhase, buildLaunchScalePhase, buildLegalPhase, buildMarketingPhase, buildOperationsPhase, buildProtectionPhase, buildSalesPhase } from '../lib/phase-data.js';
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
      ? (phase.number <= 3 ? 'available' : 'locked')
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

  const brandPhase = numericPhase >= 2
    ? await getPhaseInstanceForProject(projectId, userId, 1, env)
    : null;
  const legalPhase = numericPhase >= 3
    ? await getPhaseInstanceForProject(projectId, userId, 2, env)
    : null;
  const financePhase = numericPhase >= 4
    ? await getPhaseInstanceForProject(projectId, userId, 3, env)
    : null;
  const protectionPhase = numericPhase >= 5
    ? await getPhaseInstanceForProject(projectId, userId, 4, env)
    : null;
  const infrastructurePhase = numericPhase >= 6
    ? await getPhaseInstanceForProject(projectId, userId, 5, env)
    : null;
  const marketingPhase = numericPhase >= 7
    ? await getPhaseInstanceForProject(projectId, userId, 6, env)
    : null;
  const operationsPhase = numericPhase >= 8
    ? await getPhaseInstanceForProject(projectId, userId, 7, env)
    : null;
  const salesPhase = numericPhase === 9
    ? await getPhaseInstanceForProject(projectId, userId, 8, env)
    : null;

  if (numericPhase >= 2 && !brandPhase) {
    return fail(res, 400, 'BRAND_REQUIRED', 'Generate Phase 1 Brand before creating this phase');
  }

  if (numericPhase >= 3 && !legalPhase) {
    return fail(res, 400, 'LEGAL_REQUIRED', 'Generate Phase 2 Legal before creating this phase');
  }

  if (numericPhase === 4 && !financePhase) {
    return fail(res, 400, 'FINANCE_REQUIRED', 'Generate Phase 3 Finance before creating Phase 4 Protection');
  }

  if (numericPhase === 5 && !protectionPhase) {
    return fail(res, 400, 'PROTECTION_REQUIRED', 'Generate Phase 4 Protection before creating Phase 5 Infrastructure');
  }

  if (numericPhase === 6 && !infrastructurePhase) {
    return fail(res, 400, 'INFRASTRUCTURE_REQUIRED', 'Generate Phase 5 Infrastructure before creating Phase 6 Marketing');
  }

  if (numericPhase === 7 && !marketingPhase) {
    return fail(res, 400, 'MARKETING_REQUIRED', 'Generate Phase 6 Marketing before creating Phase 7 Operations');
  }

  if (numericPhase === 8 && !operationsPhase) {
    return fail(res, 400, 'OPERATIONS_REQUIRED', 'Generate Phase 7 Operations before creating Phase 8 Sales');
  }

  if (numericPhase === 9 && !salesPhase) {
    return fail(res, 400, 'SALES_REQUIRED', 'Generate Phase 8 Sales before creating Phase 9 Growth & Milestones');
  }

  const phase = numericPhase === 1
    ? buildBrandPhase(project, blueprint)
    : numericPhase === 2
      ? buildLegalPhase(project, blueprint, brandPhase)
      : numericPhase === 3
        ? buildFinancePhase(project, blueprint, legalPhase)
        : numericPhase === 4
          ? buildProtectionPhase(project, blueprint, legalPhase, financePhase)
          : numericPhase === 5
            ? buildInfrastructurePhase(project, blueprint, protectionPhase)
            : numericPhase === 6
              ? buildMarketingPhase(project, blueprint, infrastructurePhase)
              : numericPhase === 7
                ? buildOperationsPhase(project, blueprint, marketingPhase)
                : numericPhase === 8
                  ? buildSalesPhase(project, blueprint, operationsPhase)
                  : buildLaunchScalePhase(project, blueprint, salesPhase);
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
