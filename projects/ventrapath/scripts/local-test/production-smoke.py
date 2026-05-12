import json
import os
import sys
import urllib.error
import urllib.request
import uuid

BASE = os.environ.get('VENTRAPATH_BASE', 'https://ventrapath-backend-live.vercel.app/api')
USER_ID = os.environ.get('VENTRAPATH_USER_ID', str(uuid.uuid4()))
HEADERS = {
    'Content-Type': 'application/json',
    'x-user-id': USER_ID,
}
EXPECTED_SECTIONS = {
    'business', 'market', 'monetisation', 'execution', 'legal', 'website', 'risks'
}


def request(path, method='GET', data=None):
    body = None if data is None else json.dumps(data).encode()
    req = urllib.request.Request(f'{BASE}{path}', data=body, method=method, headers=HEADERS)

    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            payload = json.loads(response.read().decode())
    except urllib.error.HTTPError as error:
        payload = error.read().decode()
        raise RuntimeError(f'HTTP {error.code} on {path}: {payload}') from error

    if not payload.get('ok'):
        raise RuntimeError(f'Request failed on {path}: {json.dumps(payload)}')

    return payload['data']


def assert_true(condition, message):
    if not condition:
        raise AssertionError(message)


def main():
    health = request('/health')
    assert_true(health['status'] == 'ok', 'health status must be ok')

    project = request('/projects', 'POST', {
        'name': 'Production Smoke Test',
        'idea': 'AI ice cream parlour',
        'country': 'Australia',
        'region': 'Perth',
        'currencyCode': 'AUD',
        'hoursPerWeek': 10,
    })['project']
    project_id = project['id']

    blueprint_response = request(f'/projects/{project_id}/blueprint/generate', 'POST', {'regenerate': True})
    blueprint = blueprint_response['blueprint']
    source_meta = blueprint.get('meta', {}).get('sourceMeta', {})
    sections = blueprint['sections']

    assert_true(set(sections.keys()) == EXPECTED_SECTIONS, 'blueprint must contain the expected seven sections')
    assert_true(source_meta.get('provider') == 'openai', 'production blueprint must use OpenAI provider')
    assert_true(source_meta.get('writer') == 'openai-direct-blueprint-v1', 'production blueprint must use the direct OpenAI writer')
    assert_true(source_meta.get('runtimePromptsLoaded', {}).get('bob') is True, 'bob prompt must be loaded')

    business = str(sections.get('business', ''))
    assert_true('locally tailored business concept designed for' not in business.lower(), 'fallback template business text should not appear')
    assert_true('you are writing a high-quality business blueprint' not in business.lower(), 'raw prompt dump text should not appear')

    print(json.dumps({
        'ok': True,
        'base': BASE,
        'projectId': project_id,
        'provider': source_meta.get('provider'),
        'writer': source_meta.get('writer'),
        'model': source_meta.get('model'),
        'businessPreview': business[:280],
    }, indent=2))


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print(f'PRODUCTION SMOKE TEST FAILED: {error}', file=sys.stderr)
        raise
