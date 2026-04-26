import { randomUUID } from 'node:crypto';
import { createProject, getProjectByIdForUser, listProjectsForUser } from '../lib/project-store.js';
import { fail, ok, parseJsonBody } from '../lib/http.js';

const DEFAULT_DEV_USER_ID = 'dev-user-001';

const currencyByCountry = new Map([
  ['australia', 'AUD'],
  ['canada', 'CAD'],
  ['new zealand', 'NZD'],
  ['united kingdom', 'GBP'],
  ['uk', 'GBP'],
  ['england', 'GBP'],
  ['scotland', 'GBP'],
  ['wales', 'GBP'],
  ['northern ireland', 'GBP'],
  ['united states', 'USD'],
  ['usa', 'USD'],
  ['us', 'USD'],
  ['ireland', 'EUR'],
  ['germany', 'EUR'],
  ['france', 'EUR'],
  ['spain', 'EUR'],
  ['italy', 'EUR'],
  ['netherlands', 'EUR'],
  ['portugal', 'EUR'],
  ['austria', 'EUR']
]);

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

function normaliseString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function deriveCurrencyCode(country) {
  return currencyByCountry.get(country.toLowerCase()) ?? 'USD';
}

function toProjectListItem(project) {
  return {
    id: project.id,
    name: project.name,
    country: project.country,
    region: project.region,
    status: project.status,
    currentPhaseNumber: project.currentPhaseNumber,
    updatedAt: project.updatedAt,
  };
}

function validateCreateProjectBody(body) {
  const idea = normaliseString(body?.idea);
  const country = normaliseString(body?.country);
  const region = body?.region == null ? null : normaliseString(body.region) || null;
  const hoursPerWeek = body?.hoursPerWeek == null ? null : Number(body.hoursPerWeek);

  if (!idea || idea.length < 3) {
    return { error: ['INVALID_INPUT', 'idea must be at least 3 characters'] };
  }

  if (!country || country.length < 2) {
    return { error: ['INVALID_INPUT', 'country must be provided'] };
  }

  if (hoursPerWeek !== null && (!Number.isInteger(hoursPerWeek) || hoursPerWeek < 1 || hoursPerWeek > 168)) {
    return { error: ['INVALID_INPUT', 'hoursPerWeek must be an integer between 1 and 168'] };
  }

  return {
    value: {
      idea,
      country,
      region,
      hoursPerWeek,
    },
  };
}

export async function handleListProjects(req, res, env) {
  const userId = getRequestUserId(req, env);

  if (!userId) {
    return fail(res, 401, 'UNAUTHENTICATED', 'Authenticated user is required');
  }

  const projects = await listProjectsForUser(userId);

  return ok(res, {
    projects: projects.map(toProjectListItem),
  });
}

export async function handleCreateProject(req, res, env) {
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

  const validated = validateCreateProjectBody(body ?? {});

  if (validated.error) {
    return fail(res, 400, validated.error[0], validated.error[1]);
  }

  const now = new Date().toISOString();
  const { idea, country, region, hoursPerWeek } = validated.value;
  const project = {
    id: randomUUID(),
    userId,
    name: idea,
    rawIdea: idea,
    country,
    region,
    currencyCode: deriveCurrencyCode(country),
    hoursPerWeek,
    status: 'draft',
    currentPhaseNumber: 0,
    latestBlueprintVersionNumber: null,
    createdAt: now,
    updatedAt: now,
  };

  await createProject(project);

  return ok(res, { project }, 201);
}

export async function handleGetProject(req, res, projectId, env) {
  const userId = getRequestUserId(req, env);

  if (!userId) {
    return fail(res, 401, 'UNAUTHENTICATED', 'Authenticated user is required');
  }

  const project = await getProjectByIdForUser(projectId, userId);

  if (!project) {
    return fail(res, 404, 'PROJECT_NOT_FOUND', `Project ${projectId} was not found`);
  }

  return ok(res, { project });
}
