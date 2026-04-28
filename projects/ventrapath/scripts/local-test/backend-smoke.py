import json
import sys
import urllib.error
import urllib.request

BASE = 'http://127.0.0.1:4000/api'
USER_ID = '11111111-1111-4111-8111-111111111111'
HEADERS = {
    'Content-Type': 'application/json',
    'x-user-id': USER_ID,
}


def request(path, method='GET', data=None):
    body = None if data is None else json.dumps(data).encode()
    req = urllib.request.Request(f'{BASE}{path}', data=body, method=method, headers=HEADERS)

    try:
        with urllib.request.urlopen(req, timeout=20) as response:
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
        'name': 'Backend Smoke Test',
        'idea': 'A guided business builder for regulated local services',
        'country': 'Australia',
        'region': 'Western Australia',
        'currencyCode': 'AUD',
        'hoursPerWeek': 10,
    })['project']
    project_id = project['id']

    blueprint = request(f'/projects/{project_id}/blueprint/generate', 'POST', {})['blueprint']
    assert_true(blueprint['version'] == 1, 'first blueprint version must be 1')
    assert_true(set(blueprint['sections'].keys()) == {
        'business', 'market', 'monetisation', 'execution', 'legal', 'website', 'risks'
    }, 'blueprint must contain the expected seven sections')

    latest_blueprint = request(f'/projects/{project_id}/blueprint')['blueprint']
    assert_true(latest_blueprint['id'] == blueprint['id'], 'latest blueprint fetch should match generated blueprint')

    versions = request(f'/projects/{project_id}/blueprint/versions')['versions']
    assert_true(len(versions) >= 1, 'blueprint versions should contain at least one version')
    assert_true(versions[0]['version'] == 1, 'latest version summary should be version 1')

    brand = request(f'/projects/{project_id}/phases/1/generate', 'POST', {})['phase']
    assert_true(brand['phaseNumber'] == 1, 'brand phase number should be 1')
    assert_true(brand['state'] == 'ready', 'brand phase should be ready')

    brand_fetched = request(f'/projects/{project_id}/phases/1')['phase']
    assert_true(brand_fetched['id'] == brand['id'], 'fetched brand phase should match generated brand phase')

    legal = request(f'/projects/{project_id}/phases/2/generate', 'POST', {})['phase']
    assert_true(legal['phaseNumber'] == 2, 'legal phase number should be 2')
    assert_true(legal['state'] == 'ready', 'legal phase should be ready')

    legal_fetched = request(f'/projects/{project_id}/phases/2')['phase']
    assert_true(legal_fetched['id'] == legal['id'], 'fetched legal phase should match generated legal phase')

    phases = request(f'/projects/{project_id}/phases')['phases']
    phase_map = {item['number']: item for item in phases}
    assert_true(phase_map[1]['state'] == 'ready', 'phase 1 should be ready after generation')
    assert_true(phase_map[2]['state'] == 'ready', 'phase 2 should be ready after generation')
    assert_true(phase_map[3]['state'] == 'locked', 'phase 3 should remain locked')

    refreshed_project = request(f'/projects/{project_id}')['project']
    assert_true(refreshed_project['currentPhaseNumber'] == 2, 'project currentPhaseNumber should advance to 2')
    assert_true(refreshed_project['status'] == 'in_progress', 'project status should be in_progress after phase generation')

    print(json.dumps({
        'ok': True,
        'projectId': project_id,
        'checks': {
            'health': True,
            'project': True,
            'blueprint': True,
            'brandPhase': True,
            'legalPhase': True,
            'phaseLadder': True,
            'projectProgress': True,
        }
    }, indent=2))


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print(f'SMOKE TEST FAILED: {error}', file=sys.stderr)
        raise
