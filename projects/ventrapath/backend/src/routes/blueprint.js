import { randomUUID } from 'node:crypto';
import {
  createBlueprintVersionForProject,
  getProjectByIdForUser,
  getLatestBlueprintForProject,
  listBlueprintVersionsForProject,
} from '../lib/project-store.js';
import { fail, ok, parseJsonBody } from '../lib/http.js';

const DEFAULT_DEV_USER_ID = 'dev-user-001';

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

function buildBlueprintSections(project) {
  const location = project.region ? `${project.region}, ${project.country}` : project.country;
  const currency = project.currencyCode;
  const idea = project.rawIdea;

  return {
    business: `${idea} becomes a structured VentraPath blueprint for ${location}, positioned as a differentiated business rather than a vague concept. The operating angle is framed to feel commercially legible fast, with the location and customer context baked in from the start.`,
    market: `Primary market focus is shaped around buyers in ${location} who already spend in this category and can recognise the offer quickly. The MVP market thesis should stay narrow first, then widen only after proof of demand and repeatable pull.`,
    monetisation: `Use ${currency} pricing from day one and anchor the first offer to a clear commercial path rather than fuzzy interest. Initial pricing should be tested as a directional market entry point, then lifted only when the differentiation is obvious within seconds.`,
    execution: `First prove this can sell in ${location} with a tight launch path, clear buyer targeting, and a simple operating workflow. Do not overbuild the stack before real customer response exists.`,
    legal: `Legal setup will depend on ${location} rules and should be treated as information only, not legal advice. The user must verify local registration, licensing, claims, privacy, tax, and compliance requirements themselves.`,
    website: `The website should immediately explain what this business is, why it is different, who it is for, and what the next step is. Keep the landing flow tight: clear promise, proof angle, offer, and CTA.`,
    risks: `Biggest early risks are fake differentiation, unclear buyer urgency, sloppy pricing confidence, and building too much before proof. If the commercial edge is not legible quickly, the concept should be narrowed before scaling effort.`,
  };
}

export async function handleGenerateBlueprint(req, res, projectId, env) {
  const userId = getRequestUserId(req, env);

  if (!userId) {
    return fail(res, 401, 'UNAUTHENTICATED', 'Authenticated user is required');
  }

  let body;

  try {
    body = await parseJsonBody(req);
  } catch {
    return fail(res, 400, 'INVALID_JSON', 'Request body must be valid JSON');
  }

  const regenerate = Boolean(body?.regenerate);
  const existing = await getLatestBlueprintForProject(projectId, userId);

  if (existing && !regenerate) {
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

  const project = await getProjectByIdForUser(projectId, userId);

  if (!project) {
    return fail(res, 404, 'PROJECT_NOT_FOUND', `Project ${projectId} was not found`);
  }

  const blueprint = await createBlueprintVersionForProject(projectId, userId, buildBlueprintSections(project));

  if (!blueprint) {
    return fail(res, 404, 'PROJECT_NOT_FOUND', `Project ${projectId} was not found`);
  }

  return ok(res, {
    run: {
      id: randomUUID(),
      type: regenerate ? 'blueprint_regeneration' : 'blueprint_generation',
      status: 'completed',
    },
    blueprint,
  });
}

export async function handleGetBlueprint(req, res, projectId, env) {
  const userId = getRequestUserId(req, env);

  if (!userId) {
    return fail(res, 401, 'UNAUTHENTICATED', 'Authenticated user is required');
  }

  const blueprint = await getLatestBlueprintForProject(projectId, userId);

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

  const versions = await listBlueprintVersionsForProject(projectId, userId);

  if (!versions) {
    return fail(res, 404, 'PROJECT_NOT_FOUND', `Project ${projectId} was not found`);
  }

  return ok(res, { versions });
}
