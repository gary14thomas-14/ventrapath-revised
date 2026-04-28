function sentenceCase(input) {
  return input
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function normalizeInlineText(input) {
  return String(input ?? '')
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/�/g, 'é')
}

function buildNameOptions(project) {
  const base = project.name || project.rawIdea || 'VentraPath Business'
  const compactBase = sentenceCase(base.replace(/[^a-zA-Z0-9 ]+/g, ' ').trim())
  const shortBase = compactBase.split(/\s+/).slice(0, 3).join(' ')
  const region = project.region ? sentenceCase(project.region) : sentenceCase(project.country)

  return [
    {
      name: shortBase,
      rationale: 'Closest to the original idea while sounding clean and commercially legible.',
    },
    {
      name: `${shortBase} Studio`,
      rationale: 'Adds a premium, modern layer without drifting away from the core offer.',
    },
    {
      name: `${region} ${shortBase}`,
      rationale: 'Makes the local market fit obvious, which helps early trust and search clarity.',
    },
  ]
}

function buildBrandPositioning(project, blueprint) {
  return {
    whatItDoes: normalizeInlineText(`Turns ${project.rawIdea.toLowerCase()} into a clear paid offer with a practical customer path and a tighter operating model.`),
    whoItsFor: normalizeInlineText(`Built first for buyers in ${project.region ? `${project.region}, ` : ''}${project.country} who want a sharper, easier-to-understand version of this solution.`),
    whatMakesItDifferent: 'The business is positioned around a concrete operating edge, not vague "better service" language, so the twist feels obvious fast.',
    supportingNote: blueprint?.sections?.business ?? null,
  }
}

function buildVisualIdentity(project) {
  return {
    logoPrompt: `Create a premium, modern logo for ${project.name}. Dark UI compatible, clean geometry, confident typography, subtle blue-purple tech edge, still human and commercially credible.`,
    visualDirection: 'Dark premium base, electric blue / violet accents, crisp typography, restrained motion, no startup cliche gradients splashed everywhere.',
    colourPalette: {
      primary: ['#7C3AED', '#6366F1', '#4338CA'],
      accent: ['#38BDF8', '#0EA5E9', '#0284C7'],
      success: ['#22C55E', '#16A34A', '#15803D'],
      neutral: ['#F8FAFC', '#94A3B8', '#0F172A'],
    },
    fontOptions: [
      { name: 'Inter', style: 'clean, premium, product-first' },
      { name: 'Poppins', style: 'friendly, modern, clear' },
      { name: 'Space Grotesk', style: 'slightly sharper, more distinctive' },
    ],
  }
}

function buildDomainSection(project) {
  const handleRoot = project.name.toLowerCase().replace(/[^a-z0-9]+/g, '') || 'ventrapathbiz'

  return {
    suggestedDomains: [
      `${handleRoot}.com`,
      `${handleRoot}.co`,
      `${handleRoot}.app`,
    ],
    emailRecommendation: `Use hello@${handleRoot}.com if available; fall back to contact@ or founders@ only if the cleaner option is gone.`,
    providers: [
      {
        name: 'Cloudflare',
        reason: 'Best for simple DNS control, low markup, and future flexibility.',
        url: 'https://www.cloudflare.com/products/registrar/',
      },
      {
        name: 'Namecheap',
        reason: 'Easy registrar flow and good enough for quick setup.',
        url: 'https://www.namecheap.com/',
      },
      {
        name: 'Google Workspace',
        reason: 'Use for business email after domain purchase if the team wants simple collaboration.',
        url: 'https://workspace.google.com/',
      },
    ],
  }
}

function buildSocialSection(project) {
  const baseHandle = project.name.toLowerCase().replace(/[^a-z0-9]+/g, '') || 'ventrapathbiz'

  return {
    recommendedRoot: baseHandle,
    suggestions: [
      { platform: 'Instagram', handle: `@${baseHandle}` },
      { platform: 'TikTok', handle: `@${baseHandle}` },
      { platform: 'Twitter / X', handle: `@${baseHandle}` },
      { platform: 'LinkedIn', handle: `company/${baseHandle}` },
    ],
    guidance: 'Keep the root handle identical unless a platform forces variation. If a fallback is needed, add the location or category, not random numbers.',
  }
}

function buildBrandTasks() {
  return [
    {
      title: 'Choose final business name',
      whatToDo: 'Review the suggested names and lock the one that fits the market, tone, and legal reality best.',
      howToDoIt: 'Start with the recommended option, then check memorability, search cleanliness, and whether it still carries the business twist.',
      executionReference: 'Use the rationale in Step 1 and reject anything that sounds generic or forgettable.',
      isRequired: true,
      stepNumber: 1,
    },
    {
      title: 'Lock brand positioning copy',
      whatToDo: 'Finalise the “what it does / who it is for / what makes it different” language.',
      howToDoIt: 'Keep each field sharp and commercially legible. If it sounds like startup wallpaper, rewrite it.',
      executionReference: 'Use Step 2 as the source of truth for homepage copy, sales intro, and future marketing assets.',
      isRequired: true,
      stepNumber: 2,
    },
    {
      title: 'Choose visual direction',
      whatToDo: 'Pick the logo path, colour palette, and font style that best fit the business.',
      howToDoIt: 'Decide whether to upload an existing mark or use the AI prompt seed, then keep the style tight and premium.',
      executionReference: 'Use Step 3 to avoid default startup styling that weakens the product feel.',
      isRequired: true,
      stepNumber: 3,
    },
    {
      title: 'Secure domain and email path',
      whatToDo: 'Check domain availability and choose the registrar/email setup route.',
      howToDoIt: 'Prioritise the cleanest available domain and create the business email immediately after purchase.',
      executionReference: 'Use Step 4 provider suggestions to move quickly without overthinking infrastructure.',
      isRequired: true,
      stepNumber: 4,
    },
    {
      title: 'Reserve social handles',
      whatToDo: 'Claim the closest consistent handles across the main channels.',
      howToDoIt: 'Check each platform using the recommended root handle before the name starts drifting or getting taken.',
      executionReference: 'Use Step 5 as the consistency rule for Instagram, TikTok, X, and LinkedIn.',
      isRequired: false,
      stepNumber: 5,
    },
  ]
}

export function buildBrandPhase(project, blueprint) {
  const nameOptions = buildNameOptions(project)
  const recommendedName = nameOptions[0]
  const positioning = buildBrandPositioning(project, blueprint)
  const visual = buildVisualIdentity(project)
  const domain = buildDomainSection(project)
  const social = buildSocialSection(project)

  return {
    number: 1,
    title: 'Brand',
    summary: 'Turn the blueprint into a usable external identity with a name, positioning, visual direction, domain path, and social handle set.',
    progress: {
      totalSteps: 5,
      completedSteps: 0,
    },
    content: {
      steps: [
        {
          number: 1,
          slug: 'business-name',
          title: 'Business Name',
          description: 'Choose a memorable, commercially legible name that still carries the business edge.',
          helper: {
            howToDoThis: 'Avoid generic filler names. You want something clear enough to trust, but sharp enough to stand out.',
            example: `${recommendedName.name} works because it stays close to the core offer without sounding flat or forgettable.`,
          },
          input: {
            type: 'text',
            label: 'Enter your business name',
            cta: 'Check Availability',
          },
          suggestions: {
            nameOptions,
            recommendedName,
          },
        },
        {
          number: 2,
          slug: 'brand-positioning',
          title: 'Brand Positioning',
          description: 'Define what the business does, who it is for, and what makes it different.',
          helper: {
            howToDoThis: 'Keep the language tight. If a stranger cannot repeat it after ten seconds, it is still too muddy.',
            example: positioning.whatMakesItDifferent,
          },
          fields: [
            {
              label: 'What does your business do?',
              key: 'whatItDoes',
              placeholder: positioning.whatItDoes,
            },
            {
              label: 'Who is it for?',
              key: 'whoItsFor',
              placeholder: positioning.whoItsFor,
            },
            {
              label: 'What makes it different?',
              key: 'whatMakesItDifferent',
              placeholder: positioning.whatMakesItDifferent,
            },
          ],
        },
        {
          number: 3,
          slug: 'logo-visual-identity',
          title: 'Logo & Visual Identity',
          description: 'Pick the visual direction that makes the business feel premium, modern, and coherent.',
          helper: {
            howToDoThis: 'Push the look toward the actual business mood, not generic startup shininess.',
            example: visual.visualDirection,
          },
          logoOptions: [
            { type: 'upload', label: 'Upload Logo' },
            { type: 'ai-generate', label: 'Generate with AI' },
          ],
          aiPromptSeed: visual.logoPrompt,
          colourPalette: visual.colourPalette,
          fontOptions: visual.fontOptions,
        },
        {
          number: 4,
          slug: 'domain-email-setup',
          title: 'Domain & Email Setup',
          description: 'Secure the cleanest online home for the business and set up professional email.',
          helper: {
            howToDoThis: 'Choose the cleanest viable domain first, then sort email immediately so the business looks real from day one.',
            example: domain.emailRecommendation,
          },
          suggestedDomains: domain.suggestedDomains,
          providers: domain.providers,
        },
        {
          number: 5,
          slug: 'social-handles',
          title: 'Social Handles',
          description: 'Keep handle naming consistent across the major platforms.',
          helper: {
            howToDoThis: social.guidance,
            example: `Use ${social.recommendedRoot} consistently unless a platform forces a cleaner fallback.`,
          },
          platforms: social.suggestions,
          cta: 'Check All Handle Availability',
        },
      ],
      brandLayer: {
        brandDirection: 'Premium, structured, commercially legible, and still distinctive.',
        tagline: `Built for ${project.country} customers who want a cleaner path from idea to execution.`,
        corePromise: 'A clearer, sharper version of the business that feels trustworthy fast and keeps the twist visible.',
        brandVoice: ['sharp', 'premium', 'clear', 'confident'],
        messagingPillars: [
          'commercial clarity',
          'credible differentiation',
          'guided execution',
        ],
        homepageHero: {
          headline: `${recommendedName.name} makes the business obvious fast.`,
          subheadline: positioning.whatItDoes,
          cta: 'Start Building',
        },
        brandRisks: [
          'If the visual system gets too generic, the business loses the premium edge promised in the blueprint.',
          'If the name drifts too far from the actual offer, the business becomes harder to trust quickly.',
        ],
      },
    },
    tasks: buildBrandTasks(),
  }
}

function buildLegalTasks(project) {
  const jurisdiction = project.region ? `${project.region}, ${project.country}` : project.country

  return [
    {
      title: 'Choose legal structure',
      whatToDo: 'Pick the simplest structure that still fits your risk, credibility, and growth needs.',
      howToDoIt: 'Start with the recommended option, then sanity-check liability, tax, and admin overhead before locking it.',
      executionReference: 'Use the pros/cons in Step 1 and keep the choice commercially honest.',
      isRequired: true,
      stepNumber: 1,
    },
    {
      title: 'Register the business correctly',
      whatToDo: 'Use the right authority to register the business name and entity path.',
      howToDoIt: `Follow the official pathway for ${jurisdiction}, not a random third-party site.`,
      executionReference: 'Use Step 2 official links before spending more money on branding or launch assets.',
      isRequired: true,
      stepNumber: 2,
    },
    {
      title: 'Get the required business identifier',
      whatToDo: 'Apply for the tax/business number needed to invoice, register, and operate cleanly.',
      howToDoIt: 'Use the country-specific official registration path shown in Step 3.',
      executionReference: 'Save the issued number immediately and use it consistently across tax, invoices, and banking.',
      isRequired: true,
      stepNumber: 3,
    },
    {
      title: 'Confirm tax setup',
      whatToDo: 'Work out whether tax registration is required now or later based on the threshold.',
      howToDoIt: 'Check the threshold, rate, and filing path before launch so you do not accidentally miss a trigger.',
      executionReference: 'Use Step 4 as the source of truth for threshold awareness and registration action.',
      isRequired: true,
      stepNumber: 4,
    },
    {
      title: 'Open business banking',
      whatToDo: 'Choose a business banking path that fits the first operating model.',
      howToDoIt: 'Keep personal and business money separate from day one, even if the setup stays simple.',
      executionReference: 'Use Step 5 provider suggestions to choose the fastest credible path.',
      isRequired: true,
      stepNumber: 5,
    },
    {
      title: 'Create core legal documents',
      whatToDo: 'Prepare the first customer-facing legal documents before traffic or payments scale up.',
      howToDoIt: 'Start with the listed templates, but treat them as drafts until verified for local suitability.',
      executionReference: 'Use Step 6 disclaimer language and document list as the minimum baseline.',
      isRequired: true,
      stepNumber: 6,
    },
  ]
}

export function buildLegalPhase(project, blueprint, brandPhase) {
  const jurisdiction = project.region ? `${project.region}, ${project.country}` : project.country
  const businessName = brandPhase?.generatedContent?.steps?.[0]?.suggestions?.recommendedName?.name ?? project.name
  const identifierLabel = project.country.toLowerCase() === 'australia'
    ? 'Get Your ABN (Australian Business Number)'
    : 'Get Your Business / Tax Identifier'
  const identifierInputLabel = project.country.toLowerCase() === 'australia'
    ? 'Enter your ABN (Australian Business Number)'
    : 'Enter your business/tax identifier'
  const identifierLink = project.country.toLowerCase() === 'australia'
    ? {
        label: 'Apply for an ABN',
        subtext: 'Official registration portal',
        url: 'https://www.abr.gov.au/',
      }
    : {
        label: 'Find your official business/tax registration path',
        subtext: 'Use the relevant government registration authority',
        url: 'https://www.usa.gov/register-business',
      }

  return {
    number: 2,
    title: 'Legal',
    summary: 'Translate the business into a practical legal setup path for the user\'s location.',
    progress: {
      totalSteps: 6,
      completedSteps: 0,
    },
    content: {
      jurisdiction: {
        country: project.country,
        region: project.region,
        tailoredBanner: `All guidance on this page is tailored to ${jurisdiction}.`,
        disclaimer: 'Information only, not legal advice. Verify local requirements yourself before acting.',
      },
      steps: [
        {
          number: 1,
          slug: 'choose-business-structure',
          title: 'Choose Business Structure',
          description: 'Select the legal structure that best fits your business goals and risk tolerance.',
          helper: {
            howToDoThis: 'Pick the simplest structure that still matches liability, credibility, and growth needs.',
            example: 'A solo low-risk business can often start simple; higher-risk or investor-facing models may justify a company structure earlier.',
          },
          options: [
            {
              name: 'Sole Trader',
              recommended: true,
              summary: 'Fastest and simplest path if the business is founder-led and early-stage.',
              pros: ['Easy setup', 'Minimal overhead', 'Fast to launch'],
              cons: ['Personal liability', 'Less separation between you and the business'],
            },
            {
              name: 'Company (Pty Ltd)',
              recommended: false,
              summary: 'Separate entity structure with stronger liability separation and a more formal setup.',
              pros: ['Separate legal entity', 'Stronger credibility', 'Better if risk or scale rises'],
              cons: ['More admin', 'Higher setup cost', 'Ongoing compliance burden'],
            },
            {
              name: 'Partnership',
              recommended: false,
              summary: 'Possible if multiple founders are sharing ownership and operations directly.',
              pros: ['Shared control', 'Simple compared with a company'],
              cons: ['Shared liability risk', 'Needs clearer founder alignment'],
            },
          ],
        },
        {
          number: 2,
          slug: 'register-your-business',
          title: 'Register Your Business',
          description: 'Use the correct authority to register the business name and operating entity.',
          helper: {
            howToDoThis: 'Use the official filing path for your country and check name conflicts before spending more money on the brand.',
            example: `${businessName} should be checked with the relevant registration authority before domains, signage, or launch assets are locked.`,
          },
          input: {
            type: 'text',
            label: 'Enter your business name',
            value: businessName,
          },
          linkCard: {
            label: project.country.toLowerCase() === 'australia'
              ? 'Register with ASIC'
              : 'Use the official business registration authority',
            subtext: 'Official registration portal',
            url: project.country.toLowerCase() === 'australia' ? 'https://asic.gov.au/' : 'https://www.usa.gov/register-business',
          },
        },
        {
          number: 3,
          slug: 'tax-business-number',
          title: identifierLabel,
          description: 'Apply for the main business/tax identifier used for invoicing, registration, and admin.',
          helper: {
            howToDoThis: 'Use the country-specific official path and keep the number on file once issued.',
            example: project.country.toLowerCase() === 'australia'
              ? 'Australian businesses usually need an ABN before invoicing and registrations.'
              : 'Most jurisdictions require a business or tax identifier before banking, invoicing, or registration workflows settle down.',
          },
          input: {
            type: 'text',
            label: identifierInputLabel,
          },
          linkCard: identifierLink,
        },
        {
          number: 4,
          slug: 'set-up-taxes',
          title: 'Set Up Taxes',
          description: 'Understand the key threshold, rate, and tax registration path before launch.',
          helper: {
            howToDoThis: 'Show the threshold, rate, and registration trigger clearly so the user does not accidentally drift into non-compliance.',
            example: project.country.toLowerCase() === 'australia'
              ? 'In Australia, GST registration is generally required once annual turnover crosses the threshold.'
              : 'Sales/VAT/GST registration often depends on turnover and geography, so the threshold matters immediately.',
          },
          taxSummary: {
            taxType: project.country.toLowerCase() === 'australia' ? 'GST (Goods and Services Tax)' : 'Sales / VAT / GST obligations',
            rate: project.country.toLowerCase() === 'australia' ? '10%' : 'Varies by jurisdiction',
            threshold: project.country.toLowerCase() === 'australia' ? '$75,000 annual turnover' : 'Check the official threshold for your market',
          },
          linkCard: {
            label: project.country.toLowerCase() === 'australia' ? 'Register for GST' : 'Check official tax registration',
            subtext: 'Official tax authority',
            url: project.country.toLowerCase() === 'australia' ? 'https://www.ato.gov.au/' : 'https://www.irs.gov/businesses',
          },
          checklist: [
            'I understand the registration threshold that applies to this business',
            'I know whether tax registration is required now or later',
          ],
        },
        {
          number: 5,
          slug: 'business-bank-account',
          title: 'Business Bank Account',
          description: 'Set up a clean banking path that separates business and personal money.',
          helper: {
            howToDoThis: 'Pick the fastest credible banking option that matches the way the business will actually get paid.',
            example: 'Use a simple local business account first unless cross-border payments are core to the model.',
          },
          providers: [
            {
              name: project.country.toLowerCase() === 'australia' ? 'Up Bank' : 'Local business bank',
              reason: 'Simple setup and clean day-one operations.',
              url: project.country.toLowerCase() === 'australia' ? 'https://up.com.au/' : 'https://www.nerdwallet.com/best/small-business/business-bank-account',
            },
            {
              name: project.country.toLowerCase() === 'australia' ? 'Westpac' : 'Traditional business bank',
              reason: 'Stronger conventional business banking features if needed.',
              url: project.country.toLowerCase() === 'australia' ? 'https://www.westpac.com.au/business-banking/' : 'https://www.bankofamerica.com/smallbusiness/',
            },
            {
              name: project.country.toLowerCase() === 'australia' ? 'Airwallex' : 'Cross-border payment option',
              reason: 'Useful if international payments or contractors matter early.',
              url: project.country.toLowerCase() === 'australia' ? 'https://www.airwallex.com/au' : 'https://www.wise.com/business/',
            },
          ],
        },
        {
          number: 6,
          slug: 'basic-legal-protection',
          title: 'Basic Legal Protection',
          description: 'Create the core legal documents and claim boundaries before traffic and payments ramp up.',
          helper: {
            howToDoThis: 'Generate only the documents that match the business model and website data flows.',
            example: 'A service or digital business usually needs terms, privacy coverage, and a service agreement before scaling.',
          },
          disclaimer: 'Templates are informational starting points only and must be reviewed for local legal suitability.',
          documents: [
            {
              name: 'Terms & Conditions',
              purpose: 'Sets the rules for using the service and buying from the business.',
              cta: 'Get Template',
            },
            {
              name: 'Privacy Policy',
              purpose: 'Explains how customer and visitor data is collected and used.',
              cta: 'Get Template',
            },
            {
              name: 'Service Agreement',
              purpose: 'Covers scope, payment, and delivery expectations for customer work.',
              cta: 'Get Template',
            },
          ],
          checklist: [
            'Terms & Conditions drafted',
            'Privacy Policy drafted',
            'Service Agreement drafted',
          ],
        },
      ],
      legalLayer: {
        licensingChecks: [
          {
            area: 'Licences, permits, and local approvals',
            status: 'review_required',
            reason: 'The exact obligations depend on what the business sells, where it operates, and whether regulated claims are involved.',
            followUp: `Check the relevant ${jurisdiction} authority before launch commitments are locked.`,
          },
        ],
        complianceObligations: [
          {
            title: 'Privacy and customer data handling',
            whyItMatters: 'Any website that captures customer details or enquiries creates immediate privacy obligations.',
          },
          {
            title: 'Truthful marketing claims',
            whyItMatters: 'Brand and website promises must stay provable so the business does not create avoidable legal exposure.',
          },
        ],
        brandAndTrademarkChecks: {
          businessNameCheck: 'Confirm the business name is available before locking signage, domain spend, or printed assets.',
          trademarkCheck: 'Run a first-pass trademark check in the target market before the name hardens.',
          domainCheck: 'Check the main domain and close brand variants while the naming is still flexible.',
        },
        marketingClaimWarnings: [
          'Do not promise guaranteed results unless they can be proven and supported.',
          'Avoid compliance or certification claims unless the business genuinely holds them.',
          blueprint?.sections?.website ? 'Keep homepage promises aligned with the actual service scope described in the blueprint.' : 'Keep website copy grounded in what the business can really deliver.',
        ],
        legalRisks: [
          {
            risk: 'Operating with the wrong registration or missing a required permit',
            severity: 'high',
            why: 'That can slow launch, break trust, or trigger enforcement before momentum has even formed.',
            nextStep: 'Check authority pathways and any local approval requirements before launch commitments escalate.',
          },
          {
            risk: 'Website and marketing language over-promising the offer',
            severity: 'medium',
            why: 'Loose brand claims can create avoidable compliance and customer-dispute issues.',
            nextStep: 'Use the brand and website copy as inputs for a quick claim-sanity pass before publish.',
          },
        ],
      },
    },
    tasks: buildLegalTasks(project),
  }
}
