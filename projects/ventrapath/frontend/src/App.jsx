import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api'
const DEV_USER_ID = import.meta.env.VITE_DEV_USER_ID ?? '11111111-1111-4111-8111-111111111111'

const blueprintSectionMeta = [
  { key: 'business', label: 'Business' },
  { key: 'market', label: 'Market' },
  { key: 'monetisation', label: 'Monetisation' },
  { key: 'execution', label: 'Execution' },
  { key: 'legal', label: 'Legal' },
  { key: 'website', label: 'Website' },
  { key: 'risks', label: 'Risks' },
]

const defaultPhaseCards = [
  { number: 1, title: 'Brand', state: 'available', summary: 'Turn the blueprint into a sharp external identity.' },
  { number: 2, title: 'Legal', state: 'locked', summary: 'Jurisdiction-aware setup, filing, tax, and protection.' },
  { number: 3, title: 'Finance', state: 'locked', summary: 'Pricing, banking, tax, and financial foundations.' },
  { number: 4, title: 'Protection', state: 'locked', summary: 'Risk controls, policies, and core safeguards.' },
  { number: 5, title: 'Infrastructure', state: 'locked', summary: 'Tools, systems, and operating stack.' },
  { number: 6, title: 'Marketing', state: 'locked', summary: 'Audience reach, positioning, and growth channels.' },
]

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function inferProjectName(idea) {
  const trimmed = idea.trim()
  if (!trimmed) {
    return ''
  }

  const words = trimmed.split(/\s+/).slice(0, 6)
  return words.join(' ')
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': DEV_USER_ID,
      ...(options.headers ?? {}),
    },
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload?.error?.message ?? 'Request failed')
  }

  return payload
}

function Sidebar({ projects, activeProjectId, onSelectProject, onCreateNew, phases, onOpenPhase }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div>
          <p className="eyebrow">VentraPath</p>
          <h1>Build businesses that are actually testable.</h1>
        </div>
        <button className="ghost-button" onClick={onCreateNew} type="button">
          New project
        </button>
      </div>

      <div className="sidebar__section">
        <div className="sidebar__section-header">
          <h2>Your projects</h2>
          <span>{projects.length}</span>
        </div>
        <div className="project-list">
          {projects.length === 0 ? (
            <div className="empty-card">
              <strong>No projects yet.</strong>
              <p>Create one and generate the first blueprint.</p>
            </div>
          ) : (
            projects.map((project) => (
              <button
                key={project.id}
                type="button"
                className={`project-tile ${project.id === activeProjectId ? 'project-tile--active' : ''}`}
                onClick={() => onSelectProject(project.id)}
              >
                <div>
                  <strong>{project.name}</strong>
                  <p>{project.country}{project.region ? ` · ${project.region}` : ''}</p>
                </div>
                <span>{project.status.replaceAll('_', ' ')}</span>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="sidebar__section">
        <div className="sidebar__section-header">
          <h2>Phase ladder</h2>
          <span>10</span>
        </div>
        <div className="phase-list">
          {phases.map((phase) => (
            <button
              key={phase.number}
              type="button"
              className={`phase-tile ${phase.number === 1 ? 'phase-tile--button' : ''}`}
              onClick={() => {
                onOpenPhase(phase.number)
              }}
            >
              <div className="phase-tile__number">0{phase.number}</div>
              <div>
                <strong>{phase.title}</strong>
                <p>{phase.summary}</p>
              </div>
              <span>{phase.state.replaceAll('_', ' ')}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}

function ProjectForm({ formState, onChange, onSubmit, busy }) {
  const suggestedName = useMemo(() => inferProjectName(formState.rawIdea), [formState.rawIdea])

  useEffect(() => {
    if (!formState.name && suggestedName) {
      onChange('name', suggestedName)
    }
  }, [suggestedName, formState.name, onChange])

  return (
    <section className="panel hero-panel">
      <div className="hero-panel__copy">
        <p className="eyebrow">Phase 0 · Blueprint</p>
        <h2>From idea to launch-ready business blueprint.</h2>
        <p>
          Capture the business, market, monetisation, execution, legal setup, website direction, and major risks in one pass.
        </p>
      </div>

      <form className="project-form" onSubmit={onSubmit}>
        <label>
          Project name
          <input
            value={formState.name}
            onChange={(event) => onChange('name', event.target.value)}
            placeholder="VentraPath project name"
          />
        </label>

        <label>
          Business idea
          <textarea
            value={formState.rawIdea}
            onChange={(event) => onChange('rawIdea', event.target.value)}
            placeholder="Describe the business you want VentraPath to shape."
            rows={5}
          />
        </label>

        <div className="form-grid">
          <label>
            Country
            <input
              value={formState.country}
              onChange={(event) => onChange('country', event.target.value)}
              placeholder="Australia"
            />
          </label>
          <label>
            Region / state
            <input
              value={formState.region}
              onChange={(event) => onChange('region', event.target.value)}
              placeholder="Western Australia"
            />
          </label>
          <label>
            Currency
            <input
              value={formState.currencyCode}
              onChange={(event) => onChange('currencyCode', event.target.value.toUpperCase())}
              placeholder="AUD"
              maxLength={3}
            />
          </label>
          <label>
            Hours per week
            <input
              value={formState.hoursPerWeek}
              onChange={(event) => onChange('hoursPerWeek', event.target.value)}
              placeholder="10"
              inputMode="numeric"
            />
          </label>
        </div>

        <button className="primary-button" disabled={busy} type="submit">
          {busy ? 'Generating…' : 'Create project and generate blueprint'}
        </button>
      </form>
    </section>
  )
}

function BlueprintViewer({ project, blueprint, selectedSection, onSelectSection, onRegenerate, onGenerateBrand, onGenerateLegal, busy }) {
  if (!project) {
    return (
      <section className="panel empty-state">
        <h2>No project selected yet.</h2>
        <p>Create a project on the left and I’ll build the first blueprint loop.</p>
      </section>
    )
  }

  return (
    <section className="workspace">
      <div className="panel project-summary">
        <div>
          <p className="eyebrow">Current project</p>
          <h2>{project.name}</h2>
          <p>{project.country}{project.region ? ` · ${project.region}` : ''} · {project.currencyCode}</p>
        </div>
        <div className="project-summary__actions">
          <span className="status-pill">{project.status.replaceAll('_', ' ')}</span>
          <button className="ghost-button" onClick={onGenerateBrand} disabled={busy || !blueprint} type="button">
            {busy ? 'Working…' : 'Generate Phase 1 Brand'}
          </button>
          <button className="ghost-button" onClick={onGenerateLegal} disabled={busy || !blueprint} type="button">
            {busy ? 'Working…' : 'Generate Phase 2 Legal'}
          </button>
          <button className="ghost-button" onClick={onRegenerate} disabled={busy || !blueprint} type="button">
            {busy ? 'Working…' : 'Regenerate blueprint'}
          </button>
        </div>
      </div>

      {blueprint ? (
        <div className="blueprint-layout">
          <div className="panel section-nav">
            <div className="section-nav__header">
              <div>
                <p className="eyebrow">Blueprint</p>
                <h3>Seven-section workspace</h3>
              </div>
              <span>v{blueprint.version}</span>
            </div>
            <div className="section-nav__list">
              {blueprintSectionMeta.map((section) => (
                <button
                  key={section.key}
                  type="button"
                  className={`section-link ${selectedSection === section.key ? 'section-link--active' : ''}`}
                  onClick={() => onSelectSection(section.key)}
                >
                  <span>{section.label}</span>
                  <small>{slugify(section.label)}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="panel section-content">
            <div className="section-content__header">
              <div>
                <p className="eyebrow">{blueprintSectionMeta.find((section) => section.key === selectedSection)?.label}</p>
                <h3>{project.name}</h3>
              </div>
              <span>{new Date(blueprint.createdAt).toLocaleString()}</span>
            </div>
            <article>
              {blueprint.sections[selectedSection]}
            </article>
          </div>
        </div>
      ) : (
        <section className="panel empty-state">
          <h2>Blueprint not generated yet.</h2>
          <p>Create a project or regenerate the blueprint when you’re ready.</p>
        </section>
      )}
    </section>
  )
}

function BrandPhaseViewer({ project, phase, onBack }) {
  if (!project || !phase) {
    return null
  }

  return (
    <section className="workspace">
      <div className="panel project-summary">
        <div>
          <p className="eyebrow">Phase 1 of 10</p>
          <h2>Brand</h2>
          <p>Guided identity workflow for {project.name}</p>
        </div>
        <div className="project-summary__actions">
          <span className="status-pill">{phase.state}</span>
          <button className="ghost-button" onClick={onBack} type="button">
            Back to blueprint
          </button>
        </div>
      </div>

      <div className="panel phase-header-card">
        <div>
          <p className="eyebrow">0/{phase.generatedContent.progress.totalSteps} steps complete</p>
          <h3>{phase.summary}</h3>
        </div>
        <p>{phase.generatedContent.brandLayer.corePromise}</p>
      </div>

      <div className="phase-steps">
        {phase.generatedContent.steps.map((step) => (
          <section key={step.slug} className="panel phase-step-card">
            <div className="phase-step-card__header">
              <div className="phase-step-card__title">
                <span className="phase-step-card__number">{step.number}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
              <div className="phase-step-card__actions">
                <span>How to do this</span>
                <span>Example</span>
              </div>
            </div>

            <div className="helper-grid">
              <div className="helper-card">
                <strong>How to do this</strong>
                <p>{step.helper.howToDoThis}</p>
              </div>
              <div className="helper-card">
                <strong>Example</strong>
                <p>{step.helper.example}</p>
              </div>
            </div>

            {step.suggestions ? (
              <div className="content-grid three-up">
                {step.suggestions.nameOptions.map((option) => (
                  <div key={option.name} className="content-card">
                    <strong>{option.name}</strong>
                    <p>{option.rationale}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.fields ? (
              <div className="content-grid">
                {step.fields.map((field) => (
                  <label key={field.key} className="field-card">
                    <span>{field.label}</span>
                    <textarea rows={3} defaultValue={field.placeholder} />
                  </label>
                ))}
              </div>
            ) : null}

            {step.colourPalette ? (
              <div className="content-grid">
                {Object.entries(step.colourPalette).map(([group, colours]) => (
                  <div key={group} className="content-card">
                    <strong>{group}</strong>
                    <div className="swatch-row">
                      {colours.map((colour) => (
                        <span key={colour} className="swatch" style={{ background: colour }} title={colour} />
                      ))}
                    </div>
                  </div>
                ))}
                <div className="content-card">
                  <strong>Font options</strong>
                  <p>{step.fontOptions.map((font) => `${font.name} · ${font.style}`).join(' / ')}</p>
                </div>
              </div>
            ) : null}

            {step.providers ? (
              <div className="content-grid three-up">
                {step.providers.map((provider) => (
                  <div key={provider.name} className="content-card">
                    <strong>{provider.name}</strong>
                    <p>{provider.reason}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.platforms ? (
              <div className="content-grid">
                {step.platforms.map((platform) => (
                  <div key={platform.platform} className="content-card">
                    <strong>{platform.platform}</strong>
                    <p>{platform.handle ?? platform.placeholder}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        ))}
      </div>
    </section>
  )
}

function LegalPhaseViewer({ project, phase, onBack }) {
  if (!project || !phase) {
    return null
  }

  return (
    <section className="workspace">
      <div className="panel project-summary">
        <div>
          <p className="eyebrow">Phase 2 of 10</p>
          <h2>Legal</h2>
          <p>{phase.generatedContent.jurisdiction.tailoredBanner}</p>
        </div>
        <div className="project-summary__actions">
          <span className="status-pill">{phase.state}</span>
          <button className="ghost-button" onClick={onBack} type="button">
            Back to blueprint
          </button>
        </div>
      </div>

      <div className="panel phase-header-card">
        <div>
          <p className="eyebrow">0/{phase.generatedContent.progress.totalSteps} steps complete</p>
          <h3>{phase.summary}</h3>
        </div>
        <p>{phase.generatedContent.jurisdiction.disclaimer}</p>
      </div>

      <div className="phase-steps">
        {phase.generatedContent.steps.map((step) => (
          <section key={step.slug} className="panel phase-step-card">
            <div className="phase-step-card__header">
              <div className="phase-step-card__title">
                <span className="phase-step-card__number">{step.number}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
              <div className="phase-step-card__actions">
                <span>How to do this</span>
                <span>Example</span>
              </div>
            </div>

            <div className="helper-grid">
              <div className="helper-card">
                <strong>How to do this</strong>
                <p>{step.helper.howToDoThis}</p>
              </div>
              <div className="helper-card">
                <strong>Example</strong>
                <p>{step.helper.example}</p>
              </div>
            </div>

            {step.options ? (
              <div className="content-grid three-up">
                {step.options.map((option) => (
                  <div key={option.name} className="content-card">
                    <strong>{option.name}{option.recommended ? ' · Recommended' : ''}</strong>
                    <p>{option.summary}</p>
                    <p><strong>Pros:</strong> {option.pros.join(', ')}</p>
                    <p><strong>Cons:</strong> {option.cons.join(', ')}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.input ? (
              <div className="content-grid">
                <label className="field-card">
                  <span>{step.input.label}</span>
                  <input defaultValue={step.input.value ?? ''} placeholder={step.input.label} />
                </label>
                {step.linkCard ? (
                  <div className="content-card">
                    <strong>{step.linkCard.label}</strong>
                    <p>{step.linkCard.subtext}</p>
                    <p>{step.linkCard.url}</p>
                  </div>
                ) : null}
              </div>
            ) : null}

            {step.taxSummary ? (
              <div className="content-grid three-up">
                <div className="content-card">
                  <strong>Tax type</strong>
                  <p>{step.taxSummary.taxType}</p>
                </div>
                <div className="content-card">
                  <strong>Rate</strong>
                  <p>{step.taxSummary.rate}</p>
                </div>
                <div className="content-card">
                  <strong>Threshold</strong>
                  <p>{step.taxSummary.threshold}</p>
                </div>
              </div>
            ) : null}

            {step.providers ? (
              <div className="content-grid three-up">
                {step.providers.map((provider) => (
                  <div key={provider.name} className="content-card">
                    <strong>{provider.name}</strong>
                    <p>{provider.reason}</p>
                    <p>{provider.url}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.documents ? (
              <div className="content-grid three-up">
                {step.documents.map((document) => (
                  <div key={document.name} className="content-card">
                    <strong>{document.name}</strong>
                    <p>{document.purpose}</p>
                    <p>{document.cta}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.checklist ? (
              <div className="content-grid">
                {step.checklist.map((item) => (
                  <div key={item} className="content-card">
                    <strong>Checklist</strong>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.disclaimer ? (
              <div className="helper-card">
                <strong>Disclaimer</strong>
                <p>{step.disclaimer}</p>
              </div>
            ) : null}
          </section>
        ))}

        <section className="panel phase-step-card">
          <div className="phase-step-card__header">
            <div>
              <p className="eyebrow">Supporting legal layer</p>
              <h3>Risks, permits, claims, and compliance</h3>
            </div>
          </div>
          <div className="content-grid">
            {phase.generatedContent.legalLayer.licensingChecks.map((item) => (
              <div key={item.area} className="content-card">
                <strong>{item.area}</strong>
                <p>{item.reason}</p>
                <p>{item.followUp}</p>
              </div>
            ))}
            {phase.generatedContent.legalLayer.complianceObligations.map((item) => (
              <div key={item.title} className="content-card">
                <strong>{item.title}</strong>
                <p>{item.whyItMatters}</p>
              </div>
            ))}
            {phase.generatedContent.legalLayer.legalRisks.map((item) => (
              <div key={item.risk} className="content-card">
                <strong>{item.risk}</strong>
                <p>{item.why}</p>
                <p>{item.nextStep}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}

function App() {
  const [projects, setProjects] = useState([])
  const [activeProjectId, setActiveProjectId] = useState(null)
  const [blueprint, setBlueprint] = useState(null)
  const [phases, setPhases] = useState(defaultPhaseCards)
  const [brandPhase, setBrandPhase] = useState(null)
  const [legalPhase, setLegalPhase] = useState(null)
  const [selectedSection, setSelectedSection] = useState('business')
  const [currentView, setCurrentView] = useState('blueprint')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [formState, setFormState] = useState({
    name: '',
    rawIdea: '',
    country: 'Australia',
    region: 'Western Australia',
    currencyCode: 'AUD',
    hoursPerWeek: '10',
  })

  const activeProject = projects.find((project) => project.id === activeProjectId) ?? null

  useEffect(() => {
    async function loadProjects() {
      try {
        const payload = await apiRequest('/projects')
        const nextProjects = payload.projects ?? []
        setProjects(nextProjects)

        if (!activeProjectId && nextProjects.length > 0) {
          setActiveProjectId(nextProjects[0].id)
        }
      } catch (loadError) {
        setError(loadError.message)
      }
    }

    loadProjects()
  }, [activeProjectId])

  useEffect(() => {
    async function loadProjectData() {
      if (!activeProjectId) {
        setBlueprint(null)
        setBrandPhase(null)
        setLegalPhase(null)
        setPhases(defaultPhaseCards)
        return
      }

      try {
        const [blueprintPayload, phasesPayload] = await Promise.allSettled([
          apiRequest(`/projects/${activeProjectId}/blueprint`),
          apiRequest(`/projects/${activeProjectId}/phases`),
        ])

        if (blueprintPayload.status === 'fulfilled') {
          setBlueprint(blueprintPayload.value.blueprint)
        } else {
          setBlueprint(null)
        }

        if (phasesPayload.status === 'fulfilled') {
          setPhases(phasesPayload.value.phases ?? defaultPhaseCards)
        } else {
          setPhases(defaultPhaseCards)
        }

        try {
          const brandPayload = await apiRequest(`/projects/${activeProjectId}/phases/1`)
          setBrandPhase(brandPayload.phase)
        } catch {
          setBrandPhase(null)
        }

        try {
          const legalPayload = await apiRequest(`/projects/${activeProjectId}/phases/2`)
          setLegalPhase(legalPayload.phase)
        } catch {
          setLegalPhase(null)
        }
      } catch {
        setBlueprint(null)
        setBrandPhase(null)
        setLegalPhase(null)
        setPhases(defaultPhaseCards)
      }
    }

    loadProjectData()
  }, [activeProjectId])

  function handleFormChange(key, value) {
    setFormState((current) => ({ ...current, [key]: value }))
  }

  async function refreshProjects(preferredProjectId = null) {
    const payload = await apiRequest('/projects')
    const nextProjects = payload.projects ?? []
    setProjects(nextProjects)

    if (preferredProjectId) {
      setActiveProjectId(preferredProjectId)
      return
    }

    if (!activeProjectId && nextProjects.length > 0) {
      setActiveProjectId(nextProjects[0].id)
    }
  }

  async function handleCreateProject(event) {
    event.preventDefault()
    setBusy(true)
    setError('')

    try {
      const projectPayload = {
        name: formState.name.trim() || inferProjectName(formState.rawIdea) || 'Untitled project',
        idea: formState.rawIdea.trim(),
        country: formState.country.trim(),
        region: formState.region.trim() || null,
        hoursPerWeek: Number(formState.hoursPerWeek || 0),
      }

      const projectResponse = await apiRequest('/projects', {
        method: 'POST',
        body: JSON.stringify(projectPayload),
      })

      const project = projectResponse.project
      const blueprintResponse = await apiRequest(`/projects/${project.id}/blueprint/generate`, {
        method: 'POST',
        body: JSON.stringify({ regenerate: true }),
      })

      await refreshProjects(project.id)
      setFormState({
        name: '',
        rawIdea: '',
        country: formState.country,
        region: formState.region,
        currencyCode: formState.currencyCode,
        hoursPerWeek: formState.hoursPerWeek,
      })
      setBlueprint(blueprintResponse.blueprint)
      setBrandPhase(null)
      setLegalPhase(null)
      setPhases(defaultPhaseCards)
      setSelectedSection('business')
      setCurrentView('blueprint')
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleRegenerateBlueprint() {
    if (!activeProjectId) {
      return
    }

    setBusy(true)
    setError('')

    try {
      const payload = await apiRequest(`/projects/${activeProjectId}/blueprint/generate`, {
        method: 'POST',
        body: JSON.stringify({ regenerate: true }),
      })

      setBlueprint(payload.blueprint)
      await refreshProjects(activeProjectId)
    } catch (regenerateError) {
      setError(regenerateError.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleGenerateBrand() {
    if (!activeProjectId) {
      return
    }

    setBusy(true)
    setError('')

    try {
      const payload = await apiRequest(`/projects/${activeProjectId}/phases/1/generate`, {
        method: 'POST',
        body: JSON.stringify({}),
      })

      setBrandPhase(payload.phase)
      const phasesPayload = await apiRequest(`/projects/${activeProjectId}/phases`)
      setPhases(phasesPayload.phases ?? defaultPhaseCards)
      setCurrentView('brand')
      await refreshProjects(activeProjectId)
    } catch (phaseError) {
      setError(phaseError.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleGenerateLegal() {
    if (!activeProjectId) {
      return
    }

    setBusy(true)
    setError('')

    try {
      const payload = await apiRequest(`/projects/${activeProjectId}/phases/2/generate`, {
        method: 'POST',
        body: JSON.stringify({}),
      })

      setLegalPhase(payload.phase)
      const phasesPayload = await apiRequest(`/projects/${activeProjectId}/phases`)
      setPhases(phasesPayload.phases ?? defaultPhaseCards)
      setCurrentView('legal')
      await refreshProjects(activeProjectId)
    } catch (phaseError) {
      setError(phaseError.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="app-shell">
      <Sidebar
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={(projectId) => {
          setActiveProjectId(projectId)
          setCurrentView('blueprint')
        }}
        onCreateNew={() => {
          setActiveProjectId(null)
          setBlueprint(null)
          setBrandPhase(null)
          setLegalPhase(null)
          setCurrentView('blueprint')
        }}
        phases={phases}
        onOpenPhase={(phaseNumber) => {
          if (phaseNumber === 1 && brandPhase) {
            setCurrentView('brand')
          }

          if (phaseNumber === 2 && legalPhase) {
            setCurrentView('legal')
          }
        }}
      />

      <main className="main-content">
        {error ? <div className="error-banner">{error}</div> : null}

        <ProjectForm
          formState={formState}
          onChange={handleFormChange}
          onSubmit={handleCreateProject}
          busy={busy}
        />

        {currentView === 'brand' && brandPhase ? (
          <BrandPhaseViewer project={activeProject} phase={brandPhase} onBack={() => setCurrentView('blueprint')} />
        ) : currentView === 'legal' && legalPhase ? (
          <LegalPhaseViewer project={activeProject} phase={legalPhase} onBack={() => setCurrentView('blueprint')} />
        ) : (
          <BlueprintViewer
            project={activeProject}
            blueprint={blueprint}
            selectedSection={selectedSection}
            onSelectSection={setSelectedSection}
            onRegenerate={handleRegenerateBlueprint}
            onGenerateBrand={handleGenerateBrand}
            onGenerateLegal={handleGenerateLegal}
            busy={busy}
          />
        )}
      </main>
    </div>
  )
}

export default App
