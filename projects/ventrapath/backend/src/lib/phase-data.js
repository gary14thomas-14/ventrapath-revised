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

  const generated = {
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
    }

  return {
    number: 1,
    title: 'Brand',
    summary: 'Turn the blueprint into a usable external identity with a name, positioning, visual direction, domain path, and social handle set.',
    progress: {
      totalSteps: 5,
      completedSteps: 0,
    },
    content: generated,
    generated,
    userState: {
      businessName: project.name ?? '',
      positioning: {
        whatDoesBusinessDo: '',
        whoIsItFor: '',
        whatMakesItDifferent: '',
      },
      socialHandles: {
        instagram: '',
        tiktok: '',
        twitter: '',
        linkedin: '',
      },
      selectedFont: null,
      selectedColors: [],
      completedStepIds: [],
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
  const brandGenerated = brandPhase?.generated ?? brandPhase?.generatedContent
  const businessName = brandGenerated?.steps?.[0]?.suggestions?.recommendedName?.name ?? project.name
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

  const generated = {
      jurisdiction: {
        country: project.country,
        region: project.region,
        tailoredBanner: `All guidance on this page is tailored to ${jurisdiction}.`,
        disclaimer: 'Information only — not legal advice, not a substitute for a lawyer, accountant, or local authority, and not something to rely on without checking it yourself.',
        warningTitle: 'Important legal disclaimer',
        warningBody: `Use this page as a guided starting point for ${jurisdiction} only. Before registering, filing, publishing claims, collecting customer data, or launching, verify the current rules with the relevant official authority and get professional advice where needed.`,
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
          disclaimer: 'Templates are informational starting points only. They are not legal advice, may be incomplete for your jurisdiction, and must be reviewed for local legal suitability before use.',
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
        pageDisclaimer: `This Legal phase is guidance only for ${jurisdiction}. It does not replace jurisdiction-specific legal, tax, licensing, privacy, or regulatory advice.`,
        authorityReminder: `Always prefer the relevant official ${project.country} authority or regulator over third-party summaries when registration, tax, permits, privacy, or compliance rules matter.`,
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
    }

  return {
    number: 2,
    title: 'Legal',
    summary: 'Translate the business into a practical legal setup path for the user\'s location.',
    progress: {
      totalSteps: 6,
      completedSteps: 0,
    },
    content: generated,
    generated,
    userState: {
      selectedStructure: null,
      businessName: businessName ?? '',
      taxId: '',
      selectedBank: null,
      legalChecklist: {
        termsCreated: false,
        privacyCreated: false,
        serviceAgreementReady: false,
      },
      completedStepIds: [],
    },
    tasks: buildLegalTasks(project),
  }
}

function buildFinanceTasks() {
  return [
    {
      title: 'Choose a payment provider',
      whatToDo: 'Pick the payment processor that best matches how customers will actually pay.',
      howToDoIt: 'Start with the recommended provider unless the business model clearly needs something else.',
      executionReference: 'Use Step 1 to avoid overcomplicating payments before real demand exists.',
      isRequired: true,
      stepNumber: 1,
    },
    {
      title: 'Choose accounting software',
      whatToDo: 'Settle on a simple accounting tool that keeps the books readable from the start.',
      howToDoIt: 'Prefer the easiest tool that matches the market and reporting needs instead of enterprise overkill.',
      executionReference: 'Use Step 2 to make weekly and monthly reviews realistic, not aspirational nonsense.',
      isRequired: true,
      stepNumber: 2,
    },
    {
      title: 'Set bookkeeping categories',
      whatToDo: 'Create a sane structure for income and expense tracking.',
      howToDoIt: 'Keep categories broad enough to be usable and specific enough to spot obvious money leaks.',
      executionReference: 'Use Step 3 as the baseline for how transactions get categorized going forward.',
      isRequired: true,
      stepNumber: 3,
    },
    {
      title: 'Confirm tax registrations',
      whatToDo: 'Work out which tax registrations apply now versus later.',
      howToDoIt: 'Use the official authority links and do not wing this from vibes or forum posts.',
      executionReference: 'Use Step 4 as the starting checklist, then verify with the relevant authority or accountant.',
      isRequired: true,
      stepNumber: 4,
    },
    {
      title: 'Turn pricing into something customers can buy',
      whatToDo: 'Translate pricing logic into clear tiers or packages.',
      howToDoIt: 'Keep deliverables explicit so the price feels anchored instead of arbitrary.',
      executionReference: 'Use Step 5 to move from pricing theory to something that can actually sell.',
      isRequired: true,
      stepNumber: 5,
    },
    {
      title: 'Start a weekly finance ritual',
      whatToDo: 'Create a repeatable check-in for revenue, expenses, and cash position.',
      howToDoIt: 'Keep it lightweight enough to happen every week without drama.',
      executionReference: 'Use Step 6 to build the first real operating rhythm around money.',
      isRequired: true,
      stepNumber: 6,
    },
  ]
}

export function buildFinancePhase(project, blueprint, legalPhase) {
  const jurisdiction = project.region ? `${project.region}, ${project.country}` : project.country
  const legalGenerated = legalPhase?.generated ?? legalPhase?.generatedContent
  const taxType = project.country.toLowerCase() === 'australia' ? 'GST' : 'Sales / VAT / GST'
  const taxThreshold = project.country.toLowerCase() === 'australia' ? '$75,000 annual turnover' : 'Check local threshold'
  const taxRate = project.country.toLowerCase() === 'australia' ? '10%' : 'Varies by jurisdiction'

  const generated = {
    steps: [
      {
        number: 1,
        slug: 'payment-processing',
        title: 'Payment Processing',
        description: 'Set up how the business will receive customer payments.',
        contentType: 'providers',
        helper: {
          howToDoThis: 'Choose the provider that best matches how money will actually flow through the business.',
          example: 'A service business can often move fast with Stripe invoicing before building anything fancy.',
        },
        providers: [
          {
            name: 'Stripe',
            logo: '💳',
            bestFor: 'Online businesses, service invoicing, SaaS, and e-commerce',
            fees: '1.75% + 30c per transaction',
            features: ['Instant setup', 'Subscriptions', 'Invoicing', 'Strong ecosystem'],
            recommended: true,
          },
          {
            name: 'PayPal',
            logo: '🅿️',
            bestFor: 'International payments and customers who already trust PayPal',
            fees: '2.6% + 30c per transaction',
            features: ['Trusted brand', 'Easy invoices', 'Buyer protection', 'Fast familiar checkout'],
            recommended: false,
          },
          {
            name: 'Square',
            logo: '⬛',
            bestFor: 'In-person sales, local services, and simple POS needs',
            fees: '1.6% per transaction',
            features: ['POS support', 'Hardware options', 'Invoicing', 'Straightforward setup'],
            recommended: false,
          },
        ],
      },
      {
        number: 2,
        slug: 'accounting-software',
        title: 'Accounting Software',
        description: 'Choose a simple finance tool that keeps the books legible from day one.',
        contentType: 'accounting',
        helper: {
          howToDoThis: 'Pick the tool the founder will actually use weekly, not the one that sounds most sophisticated.',
          example: project.country.toLowerCase() === 'australia'
            ? 'Xero is often the clean default for Australian businesses because the local tax fit is already strong.'
            : 'Choose the simplest accounting stack that still covers invoicing, reconciliation, and reporting.',
        },
        accountingOptions: [
          {
            name: 'Xero',
            bestFor: 'Australian and NZ businesses, service-led operators',
            price: 'From $29/month',
            features: ['Bank feeds', 'Invoicing', 'GST/BAS ready', 'Mobile app'],
            recommended: project.country.toLowerCase() === 'australia',
          },
          {
            name: 'QuickBooks',
            bestFor: 'US-heavy businesses and broader SMB bookkeeping',
            price: 'From $30/month',
            features: ['Receipt capture', 'Reporting', 'Payroll add-ons', 'Tax prep'],
            recommended: false,
          },
          {
            name: 'Wave',
            bestFor: 'Very small businesses and freelancers who want the simplest starting point',
            price: 'Free (paid payroll extras)',
            features: ['Free accounting', 'Invoicing', 'Basic reports', 'Receipt scanning'],
            recommended: false,
          },
        ],
      },
      {
        number: 3,
        slug: 'basic-bookkeeping-structure',
        title: 'Basic Bookkeeping Structure',
        description: 'Create clear income and expense categories so the numbers mean something later.',
        contentType: 'bookkeeping',
        helper: {
          howToDoThis: 'Do not drown the business in category clutter. Build a structure you can maintain every single week.',
          example: 'Keep income buckets simple and make expense categories useful enough to spot marketing, software, and contractor spend fast.',
        },
        incomeCategories: ['Client Services', 'Product Sales', 'Consulting Fees', 'Recurring Revenue', 'Other Income'],
        expenseCategories: ['Software & Tools', 'Marketing & Ads', 'Professional Services', 'Office Supplies', 'Travel & Transport', 'Education & Training', 'Insurance', 'Bank Fees'],
      },
      {
        number: 4,
        slug: 'tax-setup',
        title: 'Tax Setup',
        description: 'Understand the registrations and thresholds that affect the business before money starts moving seriously.',
        contentType: 'tax',
        helper: {
          howToDoThis: 'Use the official threshold and authority rules, then keep an accountant in the loop if the business model gets more complex.',
          example: `${taxType} obligations can change quickly once turnover moves, so this is not a set-and-forget step.`,
        },
        disclaimer: `Tax requirements vary by location. Use this as guidance for ${jurisdiction} only and verify with the relevant authority or a qualified accountant.`,
        taxRegistrations: [
          {
            name: project.country.toLowerCase() === 'australia' ? 'ABN (Australian Business Number)' : 'Business / Tax Identifier',
            required: true,
            link: project.country.toLowerCase() === 'australia' ? 'https://www.abr.gov.au/' : 'https://www.irs.gov/businesses',
            description: 'Required to operate cleanly, invoice properly, and interact with the formal business/tax system.',
          },
          {
            name: `${taxType} Registration`,
            required: false,
            link: project.country.toLowerCase() === 'australia' ? 'https://www.ato.gov.au/' : 'https://www.irs.gov/businesses',
            description: `Usually required once turnover crosses ${taxThreshold}.`,
          },
          {
            name: 'Employer / withholding registration',
            required: false,
            link: project.country.toLowerCase() === 'australia' ? 'https://www.ato.gov.au/' : 'https://www.irs.gov/businesses/small-businesses-self-employed/employment-taxes',
            description: 'Only required if the business starts paying staff or contractors in ways that trigger withholding rules.',
          },
        ],
        taxSummary: {
          taxType,
          threshold: taxThreshold,
          rate: taxRate,
          legalReminder: legalGenerated?.legalLayer?.pageDisclaimer ?? null,
        },
      },
      {
        number: 5,
        slug: 'pricing-structure-implementation',
        title: 'Pricing Structure Implementation',
        description: 'Turn the pricing logic into something customers can understand and buy.',
        contentType: 'pricing',
        helper: {
          howToDoThis: 'Make the pricing look intentional. If customers cannot tell why one tier costs more, the structure is still weak.',
          example: 'A three-tier model gives the buyer a clear anchor, a most-popular option, and a premium path without making the offer chaotic.',
        },
        tiers: [
          {
            name: 'Basic',
            price: 500,
            billingUnit: '/project',
            highlighted: false,
            features: ['Feature 1', 'Feature 2', 'Feature 3'],
          },
          {
            name: 'Pro',
            price: 1000,
            billingUnit: '/project',
            highlighted: true,
            features: ['Feature 1', 'Feature 2', 'Feature 3'],
          },
          {
            name: 'Premium',
            price: 1500,
            billingUnit: '/project',
            highlighted: false,
            features: ['Feature 1', 'Feature 2', 'Feature 3'],
          },
        ],
      },
      {
        number: 6,
        slug: 'financial-tracking',
        title: 'Financial Tracking',
        description: 'Create a simple weekly money rhythm so the business does not run blind.',
        contentType: 'tracking',
        helper: {
          howToDoThis: 'Keep the dashboard simple enough that it gets used. Fancy finance theatre is useless if nobody checks it.',
          example: 'A 15-minute weekly review beats a giant spreadsheet nobody opens until tax panic season.',
        },
        dashboard: {
          revenue: 0,
          expenses: 0,
          profit: 0,
          periodLabel: 'This month',
        },
        weeklyTrackingTasks: ['Check bank balance', 'Record new income', 'Log expenses', 'Categorize transactions'],
      },
    ],
    financeLayer: {
      financialPosture: 'Simple, legible, and good enough to make decisions without drowning in admin.',
      keyRisks: [
        'If payment setup stays vague, early sales friction will rise immediately.',
        'If bookkeeping categories are sloppy, pricing and profitability decisions will get distorted fast.',
        'If tax thresholds are ignored, the business can accidentally walk into avoidable compliance pain.',
      ],
      completionCallout: {
        badge: 'Phase 3 Complete',
        title: 'Ready for Operations',
        description: 'Continue to the next build phase once the financial foundation is clear enough to support real execution.',
      },
    },
  }

  return {
    number: 3,
    title: 'Finance',
    summary: 'Set up the financial foundations of the business with payments, accounting, tax awareness, pricing structure, and tracking habits.',
    progress: {
      totalSteps: 6,
      completedSteps: 0,
    },
    content: generated,
    generated,
    userState: {
      selectedProvider: null,
      selectedAccounting: null,
      checkedCategories: [],
      checkedTax: [],
      completedStepIds: [],
    },
    tasks: buildFinanceTasks(),
  }
}

function buildProtectionTasks() {
  return [
    {
      title: 'Identify business risks',
      whatToDo: 'Work out the legal, financial, and operational risks that could actually hurt the business.',
      howToDoIt: 'List the obvious failure points first, then rank them by likelihood and impact instead of pretending everything matters equally.',
      executionReference: 'Use Step 1 to decide what deserves contracts, insurance, or tighter process first.',
      isRequired: true,
      stepNumber: 1,
    },
    {
      title: 'Choose the right insurance',
      whatToDo: 'Set a baseline insurance stack that matches the way the business operates.',
      howToDoIt: 'Start with the recommended covers and ignore fancy extras unless the business model genuinely needs them.',
      executionReference: 'Use Step 2 to get quotes and compare exclusions before buying anything.',
      isRequired: true,
      stepNumber: 2,
    },
    {
      title: 'Draft core terms and conditions',
      whatToDo: 'Set the commercial rules customers agree to before money or delivery gets messy.',
      howToDoIt: 'Keep payment, delivery, cancellation, and dispute terms plain enough to enforce and explain.',
      executionReference: 'Use Step 3 as the minimum baseline for transactions and customer expectations.',
      isRequired: true,
      stepNumber: 3,
    },
    {
      title: 'Handle privacy properly',
      whatToDo: 'Document how customer data is collected, stored, and deleted.',
      howToDoIt: 'Map the actual data flow and write the privacy layer around that, not around fantasy compliance theatre.',
      executionReference: 'Use Step 4 before launching forms, payments, or customer accounts.',
      isRequired: true,
      stepNumber: 4,
    },
    {
      title: 'Create customer agreements',
      whatToDo: 'Define scope, payment, revisions, and exit terms clearly enough that disputes have less room to grow.',
      howToDoIt: 'Spell out inclusions, exclusions, and change handling before work starts.',
      executionReference: 'Use Step 5 as the contract skeleton for service delivery.',
      isRequired: true,
      stepNumber: 5,
    },
    {
      title: 'Add disclaimers and liability limits',
      whatToDo: 'Put sane boundaries around advice, claims, and exposure.',
      howToDoIt: 'Only disclaim what makes sense, and do not use disclaimers to cover bullshit promises or bad delivery.',
      executionReference: 'Use Step 6 to tighten website, proposal, and contract language.',
      isRequired: true,
      stepNumber: 6,
    },
    {
      title: 'Build a compliance rhythm',
      whatToDo: 'Track renewals, registrations, and review dates so protection does not quietly expire.',
      howToDoIt: 'Create a simple recurring checklist with reminders before anything lapses.',
      executionReference: 'Use Step 7 to keep the business out of lazy admin trouble.',
      isRequired: true,
      stepNumber: 7,
    },
  ]
}

export function buildProtectionPhase(project, blueprint, legalPhase, financePhase) {
  const jurisdiction = project.region ? `${project.region}, ${project.country}` : project.country

  const generated = {
    steps: [
      {
        number: 1,
        slug: 'identify-business-risks',
        title: 'Identify Business Risks',
        description: 'Understand legal, financial, and operational risks specific to your business.',
        helper: {
          howToDoThis: 'Write down what could go wrong in reality, then sort by likelihood and damage instead of vague paranoia.',
          example: 'Client non-payment and scope creep usually matter earlier than rare edge-case disasters.',
        },
        riskCategories: [
          {
            category: 'Client / Customer Risks',
            risks: ['Non-payment or late payment', 'Scope creep', 'Contract disputes', 'Reputation damage from bad reviews'],
          },
          {
            category: 'Operational Risks',
            risks: ['Data loss or breach', 'Equipment failure', 'Key person dependency', 'Supplier failure'],
          },
          {
            category: 'Financial Risks',
            risks: ['Cash flow gaps', 'Bad debt', 'Unexpected costs', 'Currency fluctuations'],
          },
          {
            category: 'Legal / Compliance Risks',
            risks: ['License expiry', 'Regulatory changes', 'IP infringement claims', 'Privacy violations'],
          },
        ],
      },
      {
        number: 2,
        slug: 'business-insurance',
        title: 'Set Up Business Insurance',
        description: 'Get coverage for public liability, professional indemnity, and relevant policies.',
        helper: {
          howToDoThis: 'Use the business model to decide what needs covering, then compare exclusions before price.',
          example: 'A consultant usually starts with professional indemnity and public liability before adding niche cover.',
        },
        insuranceTypes: [
          {
            name: 'Public Liability',
            description: 'Covers claims if someone is injured or their property is damaged because of your business.',
            whoNeeds: 'Any business that interacts with the public, visits client sites, or has a physical location.',
            typicalCost: '$300-800/year',
            recommended: true,
          },
          {
            name: 'Professional Indemnity',
            description: 'Covers claims arising from your professional advice, services, or recommendations.',
            whoNeeds: 'Consultants, coaches, designers, developers, accountants, and advice-based businesses.',
            typicalCost: '$400-1,500/year',
            recommended: true,
          },
          {
            name: 'Product Liability',
            description: 'Covers claims if a product you sell causes injury or damage.',
            whoNeeds: 'Anyone selling physical products, including imported goods.',
            typicalCost: '$400-1,200/year',
            recommended: false,
          },
          {
            name: 'Cyber Liability',
            description: 'Covers data breaches, cyber attacks, and related recovery costs.',
            whoNeeds: 'Any business storing customer data, especially online businesses.',
            typicalCost: '$500-2,000/year',
            recommended: false,
          },
        ],
      },
      {
        number: 3,
        slug: 'terms-and-conditions',
        title: 'Create Basic Terms & Conditions',
        description: 'Protect transactions and clarify responsibilities with customers.',
        helper: {
          howToDoThis: 'Keep the terms commercially clear, not stuffed with lawyer cosplay nobody can follow.',
          example: 'Payment timing, delivery timing, cancellation, and dispute handling should be obvious immediately.',
        },
        checklist: [
          'Payment terms',
          'Delivery or service terms',
          'Cancellation policy',
          'Intellectual property rules',
          'Dispute resolution process',
        ],
      },
      {
        number: 4,
        slug: 'privacy-and-data-protection',
        title: 'Implement Privacy & Data Protection',
        description: 'Create a privacy policy and handle customer data properly.',
        helper: {
          howToDoThis: 'Map the data you actually collect, where it lives, who touches it, and how users can get it deleted.',
          example: 'If Stripe handles card data, say that clearly and do not pretend you store everything yourself.',
        },
        privacyItems: [
          'What data you collect',
          'How you use the data',
          'How you protect data',
          'Third-party sharing',
          'User rights',
        ],
        privacyNotice: project.country.toLowerCase() === 'australia'
          ? 'If your business has annual turnover of $3 million+ or handles health information, Privacy Act obligations can apply.'
          : `Check the privacy rules that apply in ${jurisdiction} before launch.`,
      },
      {
        number: 5,
        slug: 'customer-agreements',
        title: 'Add Customer Agreements or Contracts',
        description: 'Create service agreements, scope of work, and clear expectations.',
        helper: {
          howToDoThis: 'Define what is included, what is not, how revisions work, and how either side can end the deal.',
          example: 'A proper scope-of-work section kills a lot of future bullshit before it starts.',
        },
        contractItems: [
          'Scope of work',
          'Timeline and milestones',
          'Payment schedule',
          'Revision process',
          'Change requests',
          'Termination clause',
        ],
      },
      {
        number: 6,
        slug: 'disclaimers-and-liability',
        title: 'Set Up Disclaimers & Liability Limits',
        description: 'Reduce exposure to claims with appropriate disclaimers.',
        helper: {
          howToDoThis: 'Use disclaimers to create sane boundaries, not to excuse nonsense or promises you cannot back up.',
          example: 'Cap liability sensibly and avoid guaranteeing outcomes unless the business can genuinely prove them.',
        },
        disclaimerTypes: [
          'General disclaimer',
          'No guarantee language',
          'Liability cap',
          'External link disclaimer',
        ],
      },
      {
        number: 7,
        slug: 'ongoing-compliance',
        title: 'Ensure Ongoing Compliance',
        description: 'Stay on top of industry regulations, licenses, renewals, and standards.',
        helper: {
          howToDoThis: 'Put the boring recurring admin on a calendar now so it does not bite you later.',
          example: 'Insurance renewals and registration expiry are exactly the kind of stupid failure that should never be a surprise.',
        },
        complianceItems: [
          { name: 'Business registration current', frequency: 'Annual' },
          { name: 'Insurance policies renewed', frequency: 'Annual' },
          { name: 'Professional licenses valid', frequency: 'Varies' },
          { name: 'Privacy policy up to date', frequency: 'Annual review' },
          { name: 'Terms & conditions current', frequency: 'Annual review' },
          { name: 'Tax obligations met', frequency: 'Quarterly / Annual' },
        ],
      },
    ],
    protectionLayer: {
      protectionPosture: `Protection guidance tailored to ${jurisdiction}.`,
      completionCallout: {
        badge: 'Phase 4 Complete',
        title: 'Ready for Product & Service',
        description: 'Continue once the business has a workable risk, insurance, privacy, and compliance baseline.',
      },
    },
  }

  return {
    number: 4,
    title: 'Protection',
    summary: 'Protect the business with risk controls, insurance choices, contracts, privacy coverage, and compliance habits.',
    progress: {
      totalSteps: 7,
      completedSteps: 0,
    },
    content: generated,
    generated,
    userState: {
      completedStepIds: [],
      selectedInsurance: [],
      checkedRisks: [],
      checkedCompliance: [],
    },
    tasks: buildProtectionTasks(),
  }
}
