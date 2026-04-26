import { notFound } from './lib/http.js';
import { handleHealth } from './routes/health.js';
import { handleGenerateBlueprint, handleGetBlueprint } from './routes/blueprint.js';
import { handleCreateProject, handleGetProject, handleListProjects } from './routes/projects.js';

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
      return handleListProjects(req, res);
    }

    if (req.method === 'POST') {
      return handleCreateProject(req, res);
    }
  }

  const projectMatch = match(pathname, /^\/api\/projects\/([^/]+)$/);
  if (projectMatch && req.method === 'GET') {
    return handleGetProject(req, res, projectMatch[1]);
  }

  const generateBlueprintMatch = match(pathname, /^\/api\/projects\/([^/]+)\/blueprint\/generate$/);
  if (generateBlueprintMatch && req.method === 'POST') {
    return handleGenerateBlueprint(req, res, generateBlueprintMatch[1]);
  }

  const getBlueprintMatch = match(pathname, /^\/api\/projects\/([^/]+)\/blueprint$/);
  if (getBlueprintMatch && req.method === 'GET') {
    return handleGetBlueprint(req, res, getBlueprintMatch[1]);
  }

  return notFound(res);
}
