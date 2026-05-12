import json
import os
import sys
import urllib.error
import urllib.request

BASE = os.environ.get('VENTRAPATH_BASE', 'http://127.0.0.1:4000/api')
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


def build_step_state(step, index):
    step_key = str(step.get('slug') or step.get('number') or index)
    state = {
        'notes': f'Persistence smoke note for {step_key}',
    }

    checklist = step.get('checklist') or step.get('scalingChecklist') or step.get('securityChecklist') or step.get('offerChecklist') or step.get('preLaunchChecklist') or []
    if checklist:
        first_item = checklist[0]
        if isinstance(first_item, dict):
            label = str(first_item.get('item') or first_item.get('task') or first_item.get('stage') or first_item.get('metric') or first_item)
        else:
            label = str(first_item)
        state['checkedItems'] = {label: True}

    options = step.get('options') or step.get('providers') or step.get('platforms') or []
    if options:
        first_option = options[0]
        if isinstance(first_option, dict):
            state['selectedOption'] = str(first_option.get('name') or first_option.get('platform') or first_option.get('provider') or '')

    tiers = step.get('tiers') or []
    if tiers:
        first_tier = tiers[0]
        if isinstance(first_tier, dict):
            state['selectedTier'] = str(first_tier.get('name') or '')

    return step_key, state


def main():
    health = request('/health')
    assert_true(health['status'] == 'ok', 'health status must be ok')

    project = request('/projects', 'POST', {
        'name': 'Phase Persistence Smoke Test',
        'idea': 'A guided business builder for regulated local services',
        'country': 'Australia',
        'region': 'Western Australia',
        'currencyCode': 'AUD',
        'hoursPerWeek': 10,
    })['project']
    project_id = project['id']

    request(f'/projects/{project_id}/blueprint/generate', 'POST', {})

    checked_phases = {}

    for phase_number in range(3, 10):
        generated_phase = request(f'/projects/{project_id}/phases/{phase_number}/generate', 'POST', {})['phase']
        steps = generated_phase.get('generatedContent', {}).get('steps', [])
        assert_true(len(steps) > 0, f'phase {phase_number} should expose steps')

        selected_steps = steps[: min(2, len(steps))]
        completed_step_ids = []
        rich_step_state = {}

        for index, step in enumerate(selected_steps):
            step_key, state = build_step_state(step, index)
            completed_step_ids.append(step_key)
            rich_step_state[step_key] = state

        updated_phase = request(f'/projects/{project_id}/phases/{phase_number}', 'PATCH', {
            'userState': {
                'completedStepIds': completed_step_ids,
                'richStepState': rich_step_state,
            },
            'progress': {
                'totalSteps': len(steps),
                'completedSteps': len(completed_step_ids),
            },
        })['phase']

        assert_true(updated_phase['userState']['completedStepIds'] == completed_step_ids, f'phase {phase_number} should save completedStepIds')
        assert_true(updated_phase['progress']['completedSteps'] == len(completed_step_ids), f'phase {phase_number} should save completedSteps')

        fetched_phase = request(f'/projects/{project_id}/phases/{phase_number}')['phase']
        assert_true(fetched_phase['userState']['completedStepIds'] == completed_step_ids, f'phase {phase_number} fetch should preserve completedStepIds')
        assert_true(fetched_phase['progress']['completedSteps'] == len(completed_step_ids), f'phase {phase_number} fetch should preserve completedSteps')

        for step_key, expected_state in rich_step_state.items():
            fetched_state = fetched_phase['userState']['richStepState'].get(step_key)
            assert_true(isinstance(fetched_state, dict), f'phase {phase_number} should preserve rich state for {step_key}')
            assert_true(fetched_state.get('notes') == expected_state['notes'], f'phase {phase_number} should preserve notes for {step_key}')
            if 'selectedOption' in expected_state:
                assert_true(fetched_state.get('selectedOption') == expected_state['selectedOption'], f'phase {phase_number} should preserve selectedOption for {step_key}')
            if 'selectedTier' in expected_state:
                assert_true(fetched_state.get('selectedTier') == expected_state['selectedTier'], f'phase {phase_number} should preserve selectedTier for {step_key}')
            if 'checkedItems' in expected_state:
                assert_true(fetched_state.get('checkedItems') == expected_state['checkedItems'], f'phase {phase_number} should preserve checkedItems for {step_key}')

        regenerated_phase = request(f'/projects/{project_id}/phases/{phase_number}/generate', 'POST', {})['phase']
        assert_true(regenerated_phase['userState']['completedStepIds'] == completed_step_ids, f'phase {phase_number} regenerate should preserve completedStepIds')
        assert_true(regenerated_phase['progress']['completedSteps'] == len(completed_step_ids), f'phase {phase_number} regenerate should preserve progress')

        checked_phases[f'phase{phase_number}'] = True

    phases = request(f'/projects/{project_id}/phases')['phases']
    phase_map = {item['number']: item for item in phases}

    for phase_number in range(3, 10):
        assert_true(phase_map[phase_number]['progress']['completedSteps'] == 2, f'phase ladder should reflect persisted progress for phase {phase_number}')

    print(json.dumps({
        'ok': True,
        'projectId': project_id,
        'checks': {
            'health': True,
            'blueprint': True,
            'phase3Persistence': True,
            'phase4Persistence': True,
            'phase5Persistence': True,
            'phase6Persistence': True,
            'phase7Persistence': True,
            'phase8Persistence': True,
            'phase9Persistence': True,
            'phaseLadderProgress': True,
        },
    }, indent=2))


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print(f'PERSISTENCE SMOKE FAILED: {error}', file=sys.stderr)
        raise
