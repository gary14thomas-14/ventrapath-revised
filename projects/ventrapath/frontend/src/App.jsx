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
  { number: 1, title: 'Brand', state: 'available', summary: 'Turn the blueprint into a usable external identity.' },
  { number: 2, title: 'Legal', state: 'locked', summary: 'Translate the business into a practical legal setup path for the user\'s location.' },
  { number: 3, title: 'Finance', state: 'locked', summary: 'Set up the financial foundations of the business with guided choices and tracking.' },
  { number: 4, title: 'Protection', state: 'locked', summary: 'Protect the business with risk controls, insurance, contracts, privacy, and compliance habits.' },
  { number: 5, title: 'Infrastructure', state: 'locked', summary: 'Build the systems, tools, automation, and security stack the business runs on every day.' },
  { number: 6, title: 'Marketing', state: 'locked', summary: 'Define the audience, message, channels, content rhythm, and lead capture foundation for growth.' },
  { number: 7, title: 'Operations', state: 'locked', summary: 'Set up how the business delivers reliably, communicates clearly, and scales without breaking.' },
  { number: 8, title: 'Sales', state: 'locked', summary: 'Turn interest into paying customers with a clear, repeatable, and measurable sales process.' },
  { number: 9, title: 'Growth & Milestones', state: 'locked', summary: 'Guide the business through launch, growth, milestone tracking, optimisation, acquisition, and retention as it matures.' },
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
          <span>9</span>
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

function BlueprintViewer({ project, blueprint, selectedSection, onSelectSection, onRegenerate, onGenerateBrand, onGenerateLegal, onGenerateFinance, onGenerateProtection, onGenerateInfrastructure, onGenerateMarketing, onGenerateOperations, onGenerateSales, onGenerateLaunchScale, busy }) {
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
          <button className="ghost-button" onClick={onGenerateFinance} disabled={busy || !blueprint} type="button">
            {busy ? 'Working…' : 'Generate Phase 3 Finance'}
          </button>
          <button className="ghost-button" onClick={onGenerateProtection} disabled={busy || !blueprint} type="button">
            {busy ? 'Working…' : 'Generate Phase 4 Protection'}
          </button>
          <button className="ghost-button" onClick={onGenerateInfrastructure} disabled={busy || !blueprint} type="button">
            {busy ? 'Working…' : 'Generate Phase 5 Infrastructure'}
          </button>
          <button className="ghost-button" onClick={onGenerateMarketing} disabled={busy || !blueprint} type="button">
            {busy ? 'Working…' : 'Generate Phase 6 Marketing'}
          </button>
          <button className="ghost-button" onClick={onGenerateOperations} disabled={busy || !blueprint} type="button">
            {busy ? 'Working…' : 'Generate Phase 7 Operations'}
          </button>
          <button className="ghost-button" onClick={onGenerateSales} disabled={busy || !blueprint} type="button">
            {busy ? 'Working…' : 'Generate Phase 8 Sales'}
          </button>
          <button className="ghost-button" onClick={onGenerateLaunchScale} disabled={busy || !blueprint} type="button">
            {busy ? 'Working…' : 'Generate Phase 9 Growth & Milestones'}
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
          <p className="eyebrow">Phase 1 of 9</p>
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
          <p className="eyebrow">0/{phase.progress?.totalSteps ?? phase.generatedContent.steps.length} steps complete</p>
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
          <p className="eyebrow">Phase 2 of 9</p>
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
          <p className="eyebrow">0/{phase.progress?.totalSteps ?? phase.generatedContent.steps.length} steps complete</p>
          <h3>{phase.summary}</h3>
        </div>
        <p>{phase.generatedContent.jurisdiction.disclaimer}</p>
      </div>

      <section className="panel phase-step-card">
        <div className="phase-step-card__header">
          <div>
            <p className="eyebrow">Legal safety</p>
            <h3>{phase.generatedContent.jurisdiction.warningTitle}</h3>
          </div>
        </div>
        <div className="helper-grid">
          <div className="helper-card">
            <strong>Read this first</strong>
            <p>{phase.generatedContent.jurisdiction.warningBody}</p>
          </div>
          <div className="helper-card">
            <strong>Authority rule</strong>
            <p>{phase.generatedContent.legalLayer.authorityReminder}</p>
          </div>
        </div>
        <div className="helper-card">
          <strong>Bottom line</strong>
          <p>{phase.generatedContent.legalLayer.pageDisclaimer}</p>
        </div>
      </section>

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

function FinancePhaseViewer({ project, phase, onBack }) {
  if (!project || !phase) {
    return null
  }

  return (
    <section className="workspace">
      <div className="panel project-summary">
        <div>
          <p className="eyebrow">Phase 3 of 9</p>
          <h2>Finance</h2>
          <p>{phase.summary}</p>
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
          <p className="eyebrow">0/{phase.progress?.totalSteps ?? phase.generatedContent.steps.length} steps complete</p>
          <h3>{phase.generatedContent.financeLayer.completionCallout.title}</h3>
        </div>
        <p>{phase.generatedContent.financeLayer.financialPosture}</p>
      </div>

      <section className="panel phase-step-card">
        <div className="phase-step-card__header">
          <div>
            <p className="eyebrow">Finance risks</p>
            <h3>What breaks first if money stays fuzzy</h3>
          </div>
        </div>
        <div className="content-grid two-up">
          {phase.generatedContent.financeLayer.keyRisks.map((risk) => (
            <div key={risk} className="content-card">
              <strong>Watch this</strong>
              <p>{risk}</p>
            </div>
          ))}
        </div>
      </section>

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

            {step.providers ? (
              <div className="content-grid three-up">
                {step.providers.map((provider) => (
                  <div key={provider.name} className="content-card">
                    <strong>{provider.name}{provider.recommended ? ' · Recommended' : ''}</strong>
                    <p>{provider.bestFor}</p>
                    <p><strong>Fees:</strong> {provider.fees}</p>
                    <p>{provider.features.join(', ')}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.accountingOptions ? (
              <div className="content-grid three-up">
                {step.accountingOptions.map((option) => (
                  <div key={option.name} className="content-card">
                    <strong>{option.name}{option.recommended ? ' · Recommended' : ''}</strong>
                    <p>{option.bestFor}</p>
                    <p><strong>Price:</strong> {option.price}</p>
                    <p>{option.features.join(', ')}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.incomeCategories || step.expenseCategories ? (
              <div className="content-grid two-up">
                {step.incomeCategories ? (
                  <div className="content-card">
                    <strong>Income categories</strong>
                    <ul className="bullet-list">
                      {step.incomeCategories.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {step.expenseCategories ? (
                  <div className="content-card">
                    <strong>Expense categories</strong>
                    <ul className="bullet-list">
                      {step.expenseCategories.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}

            {step.disclaimer ? (
              <div className="helper-card">
                <strong>Tax note</strong>
                <p>{step.disclaimer}</p>
              </div>
            ) : null}

            {step.taxSummary ? (
              <div className="content-grid three-up">
                <div className="content-card">
                  <strong>Tax type</strong>
                  <p>{step.taxSummary.taxType}</p>
                </div>
                <div className="content-card">
                  <strong>Threshold</strong>
                  <p>{step.taxSummary.threshold}</p>
                </div>
                <div className="content-card">
                  <strong>Rate</strong>
                  <p>{step.taxSummary.rate}</p>
                </div>
              </div>
            ) : null}

            {step.taxRegistrations ? (
              <div className="content-grid three-up">
                {step.taxRegistrations.map((item) => (
                  <div key={item.name} className="content-card">
                    <strong>{item.name}{item.required ? ' · Required' : ''}</strong>
                    <p>{item.description}</p>
                    <p>{item.link}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.tiers ? (
              <div className="content-grid three-up">
                {step.tiers.map((tier) => (
                  <div key={tier.name} className="content-card">
                    <strong>{tier.name}{tier.highlighted ? ' · Popular' : ''}</strong>
                    <p>${tier.price}{tier.billingUnit}</p>
                    <p>{tier.features.join(', ')}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.dashboard ? (
              <div className="content-grid two-up">
                <div className="content-card">
                  <strong>{step.dashboard.periodLabel}</strong>
                  <p>Revenue: ${step.dashboard.revenue}</p>
                  <p>Expenses: ${step.dashboard.expenses}</p>
                  <p>Profit: ${step.dashboard.profit}</p>
                </div>
                <div className="content-card">
                  <strong>Weekly rhythm</strong>
                  <p>Keep this review boring, short, and consistent.</p>
                </div>
              </div>
            ) : null}

            {step.weeklyTrackingTasks ? (
              <div className="content-grid two-up">
                {step.weeklyTrackingTasks.map((item) => (
                  <div key={item} className="content-card">
                    <strong>Weekly task</strong>
                    <p>{item}</p>
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

function ProtectionPhaseViewer({ project, phase, onBack }) {
  if (!project || !phase) {
    return null
  }

  return (
    <section className="workspace">
      <div className="panel project-summary">
        <div>
          <p className="eyebrow">Phase 4 of 9</p>
          <h2>Protection</h2>
          <p>{phase.summary}</p>
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
          <p className="eyebrow">0/{phase.progress?.totalSteps ?? phase.generatedContent.steps.length} steps complete</p>
          <h3>{phase.generatedContent.protectionLayer.completionCallout.title}</h3>
        </div>
        <p>{phase.generatedContent.protectionLayer.protectionPosture}</p>
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

            {step.riskCategories ? (
              <div className="content-grid two-up">
                {step.riskCategories.map((group) => (
                  <div key={group.category} className="content-card">
                    <strong>{group.category}</strong>
                    <ul className="bullet-list">
                      {group.risks.map((risk) => (
                        <li key={risk}>{risk}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : null}

            {step.insuranceTypes ? (
              <div className="content-grid two-up">
                {step.insuranceTypes.map((insurance) => (
                  <div key={insurance.name} className="content-card">
                    <strong>{insurance.name}{insurance.recommended ? ' · Recommended' : ''}</strong>
                    <p>{insurance.description}</p>
                    <p><strong>Who needs it:</strong> {insurance.whoNeeds}</p>
                    <p><strong>Typical cost:</strong> {insurance.typicalCost}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.checklist ? (
              <div className="content-grid two-up">
                {step.checklist.map((item) => (
                  <div key={item} className="content-card">
                    <strong>Checklist</strong>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.privacyNotice ? (
              <div className="helper-card">
                <strong>Privacy note</strong>
                <p>{step.privacyNotice}</p>
              </div>
            ) : null}

            {step.privacyItems ? (
              <div className="content-grid two-up">
                {step.privacyItems.map((item) => (
                  <div key={item} className="content-card">
                    <strong>Privacy essential</strong>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.contractItems ? (
              <div className="content-grid two-up">
                {step.contractItems.map((item) => (
                  <div key={item} className="content-card">
                    <strong>Contract element</strong>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.disclaimerTypes ? (
              <div className="content-grid two-up">
                {step.disclaimerTypes.map((item) => (
                  <div key={item} className="content-card">
                    <strong>Disclaimer type</strong>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.complianceItems ? (
              <div className="content-grid two-up">
                {step.complianceItems.map((item) => (
                  <div key={item.name} className="content-card">
                    <strong>{item.name}</strong>
                    <p>{item.frequency}</p>
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

function InfrastructurePhaseViewer({ project, phase, onBack }) {
  if (!project || !phase) {
    return null
  }

  return (
    <section className="workspace">
      <div className="panel project-summary">
        <div>
          <p className="eyebrow">Phase 5 of 9</p>
          <h2>Infrastructure</h2>
          <p>{phase.summary}</p>
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
          <p className="eyebrow">0/{phase.progress?.totalSteps ?? phase.generatedContent.steps.length} steps complete</p>
          <h3>{phase.generatedContent.infrastructureLayer.completionCallout.title}</h3>
        </div>
        <p>{phase.generatedContent.infrastructureLayer.operatingPosture}</p>
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
                <span>What to do</span>
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

            {step.whatToDo ? (
              <div className="content-grid two-up">
                {step.whatToDo.map((item) => (
                  <div key={item} className="content-card">
                    <strong>What to do</strong>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.softwareCategories ? (
              <div className="content-grid two-up">
                {step.softwareCategories.map((category) => (
                  <div key={category.category} className="content-card">
                    <strong>{category.category}</strong>
                    <p>{category.examples.join(', ')}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.folderStructure ? (
              <div className="content-grid two-up">
                {step.folderStructure.map((folder) => (
                  <div key={folder.name} className="content-card">
                    <strong>{folder.name}</strong>
                    <p>{folder.description}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.crmFields ? (
              <div className="content-grid two-up">
                {step.crmFields.map((field) => (
                  <div key={field.field} className="content-card">
                    <strong>{field.field}{field.required ? ' · Required' : ''}</strong>
                  </div>
                ))}
              </div>
            ) : null}

            {step.securityChecklist ? (
              <div className="content-grid two-up">
                {step.securityChecklist.map((item) => (
                  <div key={item.item} className="content-card">
                    <strong>{item.item}</strong>
                    <p>{item.priority}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.tools ? (
              <div className="content-grid two-up">
                {step.tools.map((tool) => (
                  <div key={tool.name} className="content-card">
                    <strong>{tool.name}</strong>
                    <p>{tool.description}</p>
                    <p>{tool.url}</p>
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

function MarketingPhaseViewer({ project, phase, onBack }) {
  if (!project || !phase) {
    return null
  }

  return (
    <section className="workspace">
      <div className="panel project-summary">
        <div>
          <p className="eyebrow">Phase 6 of 9</p>
          <h2>Marketing</h2>
          <p>{phase.summary}</p>
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
          <p className="eyebrow">0/{phase.progress?.totalSteps ?? phase.generatedContent.steps.length} steps complete</p>
          <h3>{phase.generatedContent.marketingLayer.completionCallout.title}</h3>
        </div>
        <p>{phase.generatedContent.marketingLayer.positioning}</p>
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

            {step.whatToDo ? (
              <div className="content-grid two-up">
                {step.whatToDo.map((item) => (
                  <div key={item} className="content-card">
                    <strong>What to do</strong>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.personaFields ? (
              <div className="content-grid two-up">
                {step.personaFields.map((item) => (
                  <div key={item.field} className="content-card">
                    <strong>{item.field}</strong>
                    <p>{item.examples}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.messagePrompts ? (
              <div className="content-grid three-up">
                {step.messagePrompts.map((item) => (
                  <div key={item} className="content-card">
                    <strong>Prompt</strong>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.marketingChannels ? (
              <div className="content-grid two-up">
                {step.marketingChannels.map((channel) => (
                  <div key={channel.name} className="content-card">
                    <strong>{channel.name}</strong>
                    <p>{channel.bestFor}</p>
                    <p>{channel.effort} effort</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.contentPillars ? (
              <div className="content-grid two-up">
                {step.contentPillars.map((pillar) => (
                  <div key={pillar} className="content-card">
                    <strong>Content pillar</strong>
                    <p>{pillar}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.proofAssets ? (
              <div className="content-grid two-up">
                {step.proofAssets.map((asset) => (
                  <div key={asset} className="content-card">
                    <strong>Proof asset</strong>
                    <p>{asset}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.adPlatforms ? (
              <div className="content-grid two-up">
                {step.adPlatforms.map((ad) => (
                  <div key={ad.platform} className="content-card">
                    <strong>{ad.platform}</strong>
                    <p>Best for: {ad.best}</p>
                    <p>Min budget: {ad.minBudget}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.leadMagnetIdeas ? (
              <div className="content-grid two-up">
                {step.leadMagnetIdeas.map((idea) => (
                  <div key={idea.type} className="content-card">
                    <strong>{idea.type}</strong>
                    <p>{idea.example}</p>
                    <p>{idea.effort} effort</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.tools ? (
              <div className="content-grid two-up">
                {step.tools.map((tool) => (
                  <div key={tool.name} className="content-card">
                    <strong>{tool.name}</strong>
                    <p>{tool.description}</p>
                    <p>{tool.url}</p>
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

function OperationsPhaseViewer({ project, phase, onBack }) {
  if (!project || !phase) {
    return null
  }

  return (
    <section className="workspace">
      <div className="panel project-summary">
        <div>
          <p className="eyebrow">Phase 7 of 9</p>
          <h2>Operations</h2>
          <p>{phase.summary}</p>
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
          <p className="eyebrow">0/{phase.progress?.totalSteps ?? phase.generatedContent.steps.length} steps complete</p>
          <h3>{phase.generatedContent.operationsLayer.completionCallout.title}</h3>
        </div>
        <p>{phase.generatedContent.operationsLayer.operatingPosture}</p>
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
                <strong>{step.example?.title ?? 'Example'}</strong>
                <p>{step.example?.content ?? step.helper.example}</p>
              </div>
            </div>

            {step.whatToDo ? (
              <div className="content-grid two-up">
                {step.whatToDo.map((item) => (
                  <div key={item} className="content-card">
                    <strong>What to do</strong>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.howToDoIt ? (
              <div className="content-grid two-up">
                {step.howToDoIt.map((item) => (
                  <div key={item} className="content-card">
                    <strong>Execution tip</strong>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.workflowStages ? (
              <div className="content-grid two-up">
                {step.workflowStages.map((item) => (
                  <div key={item.stage} className="content-card">
                    <strong>{item.stage}</strong>
                    <p>{item.description}</p>
                    <p>{item.action}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.sopCategories ? (
              <div className="content-grid two-up">
                {step.sopCategories.map((item) => (
                  <div key={item.category} className="content-card">
                    <strong>{item.category}</strong>
                    <p>{item.examples}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.touchpoints ? (
              <div className="content-grid two-up">
                {step.touchpoints.map((item) => (
                  <div key={item.touchpoint} className="content-card">
                    <strong>{item.touchpoint}</strong>
                    <p>{item.message}</p>
                    <p>{item.timing}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.metrics ? (
              <div className="content-grid two-up">
                {step.metrics.map((item) => (
                  <div key={item.metric} className="content-card">
                    <strong>{item.metric}</strong>
                    <p>{item.description}</p>
                    <p>{item.target}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.scalingChecklist ? (
              <div className="content-grid two-up">
                {step.scalingChecklist.map((item) => (
                  <div key={item.task} className="content-card">
                    <strong>{item.task}</strong>
                    <p>{item.status}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.tools ? (
              <div className="content-grid two-up">
                {step.tools.map((tool) => (
                  <div key={tool.name} className="content-card">
                    <strong>{tool.name}</strong>
                    <p>{tool.description}</p>
                    <p>{tool.url}</p>
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

function SalesPhaseViewer({ project, phase, onBack }) {
  if (!project || !phase) {
    return null
  }

  return (
    <section className="workspace">
      <div className="panel project-summary">
        <div>
          <p className="eyebrow">Phase 8 of 9</p>
          <h2>Sales</h2>
          <p>{phase.summary}</p>
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
          <p className="eyebrow">0/{phase.progress?.totalSteps ?? phase.generatedContent.steps.length} steps complete</p>
          <h3>{phase.generatedContent.salesLayer.completionCallout.title}</h3>
        </div>
        <p>{phase.generatedContent.salesLayer.sellingPosture}</p>
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
                <strong>{step.example?.title ?? 'Example'}</strong>
                <p>{step.example?.content ?? step.helper.example}</p>
              </div>
            </div>

            {step.whatToDo ? (
              <div className="content-grid two-up">
                {step.whatToDo.map((item) => (
                  <div key={item} className="content-card">
                    <strong>What to do</strong>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.howToDoIt ? (
              <div className="content-grid two-up">
                {step.howToDoIt.map((item) => (
                  <div key={item} className="content-card">
                    <strong>Execution tip</strong>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.salesProcessStages ? (
              <div className="content-grid two-up">
                {step.salesProcessStages.map((item) => (
                  <div key={item.stage} className="content-card">
                    <strong>{item.stage}</strong>
                    <p>{item.description}</p>
                    <p>{item.timing}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.qualificationCriteria ? (
              <div className="content-grid two-up">
                {step.qualificationCriteria.map((item) => (
                  <div key={item.criteria} className="content-card">
                    <strong>{item.criteria}</strong>
                    <p>{item.question}</p>
                    <p>{item.importance}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.commonObjections ? (
              <div className="content-grid two-up">
                {step.commonObjections.map((item) => (
                  <div key={item.objection} className="content-card">
                    <strong>{item.objection}</strong>
                    <p>{item.response}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.followUpSequence ? (
              <div className="content-grid two-up">
                {step.followUpSequence.map((item) => (
                  <div key={item.day} className="content-card">
                    <strong>{item.day}</strong>
                    <p>{item.action}</p>
                    <p>{item.channel}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.salesMetrics ? (
              <div className="content-grid two-up">
                {step.salesMetrics.map((item) => (
                  <div key={item.metric} className="content-card">
                    <strong>{item.metric}</strong>
                    <p>{item.description}</p>
                    <p>{item.benchmark}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.offerChecklist ? (
              <div className="content-grid two-up">
                {step.offerChecklist.map((item) => (
                  <div key={item.item} className="content-card">
                    <strong>{item.item}</strong>
                    <p>{item.tip}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.testIdeas ? (
              <div className="content-grid two-up">
                {step.testIdeas.map((item) => (
                  <div key={item} className="content-card">
                    <strong>Test idea</strong>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.tools ? (
              <div className="content-grid two-up">
                {step.tools.map((tool) => (
                  <div key={tool.name} className="content-card">
                    <strong>{tool.name}</strong>
                    <p>{tool.description}</p>
                    <p>{tool.url}</p>
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

function LaunchScalePhaseViewer({ project, phase, onBack }) {
  if (!project || !phase) {
    return null
  }

  return (
    <section className="workspace">
      <div className="panel project-summary">
        <div>
          <p className="eyebrow">Phase 9 of 9</p>
          <h2>Growth & Milestones</h2>
          <p>{phase.summary}</p>
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
          <p className="eyebrow">0/{phase.progress?.totalSteps ?? phase.generatedContent.steps.length} steps complete</p>
          <h3>{phase.generatedContent.launchScaleLayer.completionCallout.title}</h3>
        </div>
        <p>{phase.generatedContent.launchScaleLayer.growthPosture}</p>
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
                <strong>{step.example?.title ?? 'Example'}</strong>
                <p>{step.example?.content ?? step.helper.example}</p>
              </div>
            </div>

            {step.whatToDo ? (
              <div className="content-grid two-up">
                {step.whatToDo.map((item) => (
                  <div key={item} className="content-card">
                    <strong>What to do</strong>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.howToDoIt ? (
              <div className="content-grid two-up">
                {step.howToDoIt.map((item) => (
                  <div key={item} className="content-card">
                    <strong>Execution tip</strong>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.preLaunchChecklist ? (
              <div className="content-grid two-up">
                {step.preLaunchChecklist.map((item) => (
                  <div key={item.item} className="content-card">
                    <strong>{item.item}</strong>
                    <p>{item.category}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.launchDayActivities ? (
              <div className="content-grid two-up">
                {step.launchDayActivities.map((item) => (
                  <div key={item.activity} className="content-card">
                    <strong>{item.activity}</strong>
                    <p>{item.time}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.launchMetrics ? (
              <div className="content-grid two-up">
                {step.launchMetrics.map((item) => (
                  <div key={item.metric} className="content-card">
                    <strong>{item.metric}</strong>
                    <p>{item.description}</p>
                    <p>{item.target}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.feedbackQuestions ? (
              <div className="content-grid two-up">
                {step.feedbackQuestions.map((item) => (
                  <div key={item} className="content-card">
                    <strong>Feedback question</strong>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.issuePriorities ? (
              <div className="content-grid two-up">
                {step.issuePriorities.map((item) => (
                  <div key={item.priority} className="content-card">
                    <strong>{item.priority}</strong>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.scalingChecklist ? (
              <div className="content-grid two-up">
                {step.scalingChecklist.map((item) => (
                  <div key={item} className="content-card">
                    <strong>Scaling check</strong>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.retentionTactics ? (
              <div className="content-grid two-up">
                {step.retentionTactics.map((item) => (
                  <div key={item.tactic} className="content-card">
                    <strong>{item.tactic}</strong>
                    <p>{item.timing}</p>
                    <p>{item.goal}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step.tools ? (
              <div className="content-grid two-up">
                {step.tools.map((tool) => (
                  <div key={tool.name} className="content-card">
                    <strong>{tool.name}</strong>
                    <p>{tool.description}</p>
                    <p>{tool.url}</p>
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

function App() {
  const [projects, setProjects] = useState([])
  const [activeProjectId, setActiveProjectId] = useState(null)
  const [blueprint, setBlueprint] = useState(null)
  const [phases, setPhases] = useState(defaultPhaseCards)
  const [brandPhase, setBrandPhase] = useState(null)
  const [legalPhase, setLegalPhase] = useState(null)
  const [financePhase, setFinancePhase] = useState(null)
  const [protectionPhase, setProtectionPhase] = useState(null)
  const [infrastructurePhase, setInfrastructurePhase] = useState(null)
  const [marketingPhase, setMarketingPhase] = useState(null)
  const [operationsPhase, setOperationsPhase] = useState(null)
  const [salesPhase, setSalesPhase] = useState(null)
  const [launchScalePhase, setLaunchScalePhase] = useState(null)
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
        setFinancePhase(null)
        setProtectionPhase(null)
        setInfrastructurePhase(null)
        setMarketingPhase(null)
        setOperationsPhase(null)
        setSalesPhase(null)
        setLaunchScalePhase(null)
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

        try {
          const financePayload = await apiRequest(`/projects/${activeProjectId}/phases/3`)
          setFinancePhase(financePayload.phase)
        } catch {
          setFinancePhase(null)
        }

        try {
          const protectionPayload = await apiRequest(`/projects/${activeProjectId}/phases/4`)
          setProtectionPhase(protectionPayload.phase)
        } catch {
          setProtectionPhase(null)
        }

        try {
          const infrastructurePayload = await apiRequest(`/projects/${activeProjectId}/phases/5`)
          setInfrastructurePhase(infrastructurePayload.phase)
        } catch {
          setInfrastructurePhase(null)
        }

        try {
          const marketingPayload = await apiRequest(`/projects/${activeProjectId}/phases/6`)
          setMarketingPhase(marketingPayload.phase)
        } catch {
          setMarketingPhase(null)
        }

        try {
          const operationsPayload = await apiRequest(`/projects/${activeProjectId}/phases/7`)
          setOperationsPhase(operationsPayload.phase)
        } catch {
          setOperationsPhase(null)
        }

        try {
          const salesPayload = await apiRequest(`/projects/${activeProjectId}/phases/8`)
          setSalesPhase(salesPayload.phase)
        } catch {
          setSalesPhase(null)
        }

        try {
          const launchScalePayload = await apiRequest(`/projects/${activeProjectId}/phases/9`)
          setLaunchScalePhase(launchScalePayload.phase)
        } catch {
          setLaunchScalePhase(null)
        }
      } catch {
        setBlueprint(null)
        setBrandPhase(null)
        setLegalPhase(null)
        setFinancePhase(null)
        setProtectionPhase(null)
        setInfrastructurePhase(null)
        setMarketingPhase(null)
        setOperationsPhase(null)
        setSalesPhase(null)
        setLaunchScalePhase(null)
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
        currencyCode: formState.currencyCode.trim() || undefined,
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
      setFinancePhase(null)
      setProtectionPhase(null)
      setInfrastructurePhase(null)
      setMarketingPhase(null)
      setOperationsPhase(null)
      setSalesPhase(null)
      setLaunchScalePhase(null)
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

  async function handleGenerateProtection() {
    if (!activeProjectId) {
      return
    }

    setBusy(true)
    setError('')

    try {
      const payload = await apiRequest(`/projects/${activeProjectId}/phases/4/generate`, {
        method: 'POST',
        body: JSON.stringify({}),
      })

      setProtectionPhase(payload.phase)
      const phasesPayload = await apiRequest(`/projects/${activeProjectId}/phases`)
      setPhases(phasesPayload.phases ?? defaultPhaseCards)
      setCurrentView('protection')
      await refreshProjects(activeProjectId)
    } catch (phaseError) {
      setError(phaseError.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleGenerateFinance() {
    if (!activeProjectId) {
      return
    }

    setBusy(true)
    setError('')

    try {
      const payload = await apiRequest(`/projects/${activeProjectId}/phases/3/generate`, {
        method: 'POST',
        body: JSON.stringify({}),
      })

      setFinancePhase(payload.phase)
      const phasesPayload = await apiRequest(`/projects/${activeProjectId}/phases`)
      setPhases(phasesPayload.phases ?? defaultPhaseCards)
      setCurrentView('finance')
      await refreshProjects(activeProjectId)
    } catch (phaseError) {
      setError(phaseError.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleGenerateInfrastructure() {
    if (!activeProjectId) {
      return
    }

    setBusy(true)
    setError('')

    try {
      const payload = await apiRequest(`/projects/${activeProjectId}/phases/5/generate`, {
        method: 'POST',
        body: JSON.stringify({}),
      })

      setInfrastructurePhase(payload.phase)
      const phasesPayload = await apiRequest(`/projects/${activeProjectId}/phases`)
      setPhases(phasesPayload.phases ?? defaultPhaseCards)
      setCurrentView('infrastructure')
      await refreshProjects(activeProjectId)
    } catch (phaseError) {
      setError(phaseError.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleGenerateMarketing() {
    if (!activeProjectId) {
      return
    }

    setBusy(true)
    setError('')

    try {
      const payload = await apiRequest(`/projects/${activeProjectId}/phases/6/generate`, {
        method: 'POST',
        body: JSON.stringify({}),
      })

      setMarketingPhase(payload.phase)
      const phasesPayload = await apiRequest(`/projects/${activeProjectId}/phases`)
      setPhases(phasesPayload.phases ?? defaultPhaseCards)
      setCurrentView('marketing')
      await refreshProjects(activeProjectId)
    } catch (phaseError) {
      setError(phaseError.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleGenerateOperations() {
    if (!activeProjectId) {
      return
    }

    setBusy(true)
    setError('')

    try {
      const payload = await apiRequest(`/projects/${activeProjectId}/phases/7/generate`, {
        method: 'POST',
        body: JSON.stringify({}),
      })

      setOperationsPhase(payload.phase)
      const phasesPayload = await apiRequest(`/projects/${activeProjectId}/phases`)
      setPhases(phasesPayload.phases ?? defaultPhaseCards)
      setCurrentView('operations')
      await refreshProjects(activeProjectId)
    } catch (phaseError) {
      setError(phaseError.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleGenerateSales() {
    if (!activeProjectId) {
      return
    }

    setBusy(true)
    setError('')

    try {
      const payload = await apiRequest(`/projects/${activeProjectId}/phases/8/generate`, {
        method: 'POST',
        body: JSON.stringify({}),
      })

      setSalesPhase(payload.phase)
      const phasesPayload = await apiRequest(`/projects/${activeProjectId}/phases`)
      setPhases(phasesPayload.phases ?? defaultPhaseCards)
      setCurrentView('sales')
      await refreshProjects(activeProjectId)
    } catch (phaseError) {
      setError(phaseError.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleGenerateLaunchScale() {
    if (!activeProjectId) {
      return
    }

    setBusy(true)
    setError('')

    try {
      const payload = await apiRequest(`/projects/${activeProjectId}/phases/9/generate`, {
        method: 'POST',
        body: JSON.stringify({}),
      })

      setLaunchScalePhase(payload.phase)
      const phasesPayload = await apiRequest(`/projects/${activeProjectId}/phases`)
      setPhases(phasesPayload.phases ?? defaultPhaseCards)
      setCurrentView('launch-scale')
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
          setFinancePhase(null)
          setProtectionPhase(null)
          setInfrastructurePhase(null)
          setMarketingPhase(null)
          setOperationsPhase(null)
          setSalesPhase(null)
          setLaunchScalePhase(null)
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

          if (phaseNumber === 3 && financePhase) {
            setCurrentView('finance')
          }

          if (phaseNumber === 4 && protectionPhase) {
            setCurrentView('protection')
          }

          if (phaseNumber === 5 && infrastructurePhase) {
            setCurrentView('infrastructure')
          }

          if (phaseNumber === 6 && marketingPhase) {
            setCurrentView('marketing')
          }

          if (phaseNumber === 7 && operationsPhase) {
            setCurrentView('operations')
          }

          if (phaseNumber === 8 && salesPhase) {
            setCurrentView('sales')
          }

          if (phaseNumber === 9 && launchScalePhase) {
            setCurrentView('launch-scale')
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
        ) : currentView === 'finance' && financePhase ? (
          <FinancePhaseViewer project={activeProject} phase={financePhase} onBack={() => setCurrentView('blueprint')} />
        ) : currentView === 'protection' && protectionPhase ? (
          <ProtectionPhaseViewer project={activeProject} phase={protectionPhase} onBack={() => setCurrentView('blueprint')} />
        ) : currentView === 'infrastructure' && infrastructurePhase ? (
          <InfrastructurePhaseViewer project={activeProject} phase={infrastructurePhase} onBack={() => setCurrentView('blueprint')} />
        ) : currentView === 'marketing' && marketingPhase ? (
          <MarketingPhaseViewer project={activeProject} phase={marketingPhase} onBack={() => setCurrentView('blueprint')} />
        ) : currentView === 'operations' && operationsPhase ? (
          <OperationsPhaseViewer project={activeProject} phase={operationsPhase} onBack={() => setCurrentView('blueprint')} />
        ) : currentView === 'sales' && salesPhase ? (
          <SalesPhaseViewer project={activeProject} phase={salesPhase} onBack={() => setCurrentView('blueprint')} />
        ) : currentView === 'launch-scale' && launchScalePhase ? (
          <LaunchScalePhaseViewer project={activeProject} phase={launchScalePhase} onBack={() => setCurrentView('blueprint')} />
        ) : (
          <BlueprintViewer
            project={activeProject}
            blueprint={blueprint}
            selectedSection={selectedSection}
            onSelectSection={setSelectedSection}
            onRegenerate={handleRegenerateBlueprint}
            onGenerateBrand={handleGenerateBrand}
            onGenerateLegal={handleGenerateLegal}
            onGenerateFinance={handleGenerateFinance}
            onGenerateProtection={handleGenerateProtection}
            onGenerateInfrastructure={handleGenerateInfrastructure}
            onGenerateMarketing={handleGenerateMarketing}
            onGenerateOperations={handleGenerateOperations}
            onGenerateSales={handleGenerateSales}
            onGenerateLaunchScale={handleGenerateLaunchScale}
            busy={busy}
          />
        )}
      </main>
    </div>
  )
}

export default App
