import { notFound } from './lib/http.js';
import { handleStaticSite } from './lib/static-site.js';
import { handleHealth } from './routes/health.js';
import { handleGenerateBlueprint, handleGetBlueprint, handleListBlueprintVersions } from './routes/blueprint.js';
import { handleCreateProject, handleGetProject, handleListProjects } from './routes/projects.js';
import { handleGeneratePhase, handleGetPhase, handleListPhases } from './routes/phases.js';

function match(pathname, pattern) {
  return pathname.match(pattern);
}

export async function handleRequest(req, res, env) {
  const baseUrl = req.headers.host ? `http://${req.headers.host}` : env.appBaseUrl;
  const url = new URL(req.url, baseUrl);
  const { pathname } = url;

  if (req.method === 'GET' && (pathname === '/health' || pathname === '/api/health')) {
    return handleHealth(req, res, env);
  }

  if (pathname === '/api/projects') {
    if (req.method === 'GET') {
      return handleListProjects(req, res, env);
    }

    if (req.method === 'POST') {
      return handleCreateProject(req, res, env);
    }
  }

  const projectMatch = match(pathname, /^\/api\/projects\/([^/]+)$/);
  if (projectMatch && req.method === 'GET') {
    return handleGetProject(req, res, projectMatch[1], env);
  }

  const generateBlueprintMatch = match(pathname, /^\/api\/projects\/([^/]+)\/blueprint\/generate$/);
  if (generateBlueprintMatch && req.method === 'POST') {
    return handleGenerateBlueprint(req, res, generateBlueprintMatch[1], env);
  }

  const getBlueprintMatch = match(pathname, /^\/api\/projects\/([^/]+)\/blueprint$/);
  if (getBlueprintMatch && req.method === 'GET') {
    return handleGetBlueprint(req, res, getBlueprintMatch[1], env);
  }

  const listBlueprintVersionsMatch = match(pathname, /^\/api\/projects\/([^/]+)\/blueprint\/versions$/);
  if (listBlueprintVersionsMatch && req.method === 'GET') {
    return handleListBlueprintVersions(req, res, listBlueprintVersionsMatch[1], env);
  }

  const listPhasesMatch = match(pathname, /^\/api\/projects\/([^/]+)\/phases$/);
  if (listPhasesMatch && req.method === 'GET') {
    return handleListPhases(req, res, listPhasesMatch[1], env);
  }

  const generatePhaseMatch = match(pathname, /^\/api\/projects\/([^/]+)\/phases\/([^/]+)\/generate$/);
  if (generatePhaseMatch && req.method === 'POST') {
    return handleGeneratePhase(req, res, generatePhaseMatch[1], generatePhaseMatch[2], env);
  }

  const getPhaseMatch = match(pathname, /^\/api\/projects\/([^/]+)\/phases\/([^/]+)$/);
  if (getPhaseMatch && req.method === 'GET') {
    return handleGetPhase(req, res, getPhaseMatch[1], getPhaseMatch[2], env);
  }

  if (!pathname.startsWith('/api') && pathname !== '/health') {
    const served = handleStaticSite(req, res, pathname);

    if (served) {
      return;
    }
  }

  return notFound(res);
}
