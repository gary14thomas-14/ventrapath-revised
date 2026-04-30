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

function buildInfrastructureTasks() {
  return [
    {
      title: 'Set up business email and communication',
      whatToDo: 'Get the business onto a proper domain email and simple comms stack.',
      howToDoIt: 'Use one provider you will actually manage, create the core inboxes, and avoid a scattered mess of random accounts.',
      executionReference: 'Use Step 1 to lock the business email path before more tools pile on.',
      isRequired: true,
      stepNumber: 1,
    },
    {
      title: 'Secure the domain and web setup',
      whatToDo: 'Make sure the domain, DNS, SSL, and basic web presence are under control.',
      howToDoIt: 'Use modern hosting, verify DNS access, and test the site properly before announcing it.',
      executionReference: 'Use Step 2 to keep the public-facing infrastructure clean and recoverable.',
      isRequired: true,
      stepNumber: 2,
    },
    {
      title: 'Choose the core software stack',
      whatToDo: 'Pick the few tools the business really runs on each week.',
      howToDoIt: 'Choose one per category, prefer integration over novelty, and do not buy a pile of SaaS because it looks productive.',
      executionReference: 'Use Step 3 to avoid overlapping tools and workflow sludge.',
      isRequired: true,
      stepNumber: 3,
    },
    {
      title: 'Create the internal file system',
      whatToDo: 'Build a folder and document structure that does not collapse as the business grows.',
      howToDoIt: 'Use a stable top-level structure and sensible naming conventions from day one.',
      executionReference: 'Use Step 4 so files, templates, and operational docs stay findable.',
      isRequired: true,
      stepNumber: 4,
    },
    {
      title: 'Set up customer management',
      whatToDo: 'Track leads and customers in one sane place.',
      howToDoIt: 'Keep the CRM fields simple enough that they get updated instead of ignored.',
      executionReference: 'Use Step 5 to stop leads disappearing into chat history and inbox fog.',
      isRequired: true,
      stepNumber: 5,
    },
    {
      title: 'Automate the obvious repetitive work',
      whatToDo: 'Connect tools where repetition is wasting time.',
      howToDoIt: 'Start with basic automation flows and test them before trusting them.',
      executionReference: 'Use Step 6 to remove boring admin without creating silent breakage.',
      isRequired: false,
      stepNumber: 6,
    },
    {
      title: 'Lock down security and access',
      whatToDo: 'Protect the business accounts, files, and recovery paths.',
      howToDoIt: 'Use a password manager, 2FA, backups, and an access list instead of winging it.',
      executionReference: 'Use Step 7 to stop dumb avoidable failures becoming expensive ones.',
      isRequired: true,
      stepNumber: 7,
    },
  ]
}

export function buildInfrastructurePhase(project, blueprint, protectionPhase) {
  const businessName = project.name || 'Your Business'

  const generated = {
    steps: [
      {
        number: 1,
        slug: 'business-email-and-communication',
        title: 'Set Up Business Email & Communication',
        description: 'Professional email with your domain and simple communication tools.',
        helper: {
          howToDoThis: 'Pick one email suite, connect the domain properly, and create the obvious inboxes first.',
          example: `Use hello@${businessName.toLowerCase().replace(/[^a-z0-9]+/g, '') || 'yourbusiness'}.com as the main front door instead of a personal Gmail if you want the business to look real.`,
        },
        whatToDo: [
          'Set up a professional email address using your domain',
          'Choose an email provider that fits the business and budget',
          'Create essential addresses like hello@, support@, and admin@',
          'Set up branded email signatures',
          'Choose a simple communication tool if the team needs internal chat',
        ],
        tools: [
          { name: 'Google Workspace', url: 'https://workspace.google.com', description: 'Professional email and productivity suite.' },
          { name: 'Microsoft 365', url: 'https://www.microsoft.com/microsoft-365/business', description: 'Email plus Office apps.' },
          { name: 'Slack', url: 'https://slack.com', description: 'Team messaging and channels.' },
          { name: 'Zoho Mail', url: 'https://www.zoho.com/mail', description: 'Budget-friendly business email.' },
        ],
      },
      {
        number: 2,
        slug: 'domain-and-website-setup',
        title: 'Secure Your Domain & Website Setup',
        description: 'Connect your domain, set up hosting, and lock basic website infrastructure.',
        helper: {
          howToDoThis: 'Make sure you control DNS, verify SSL, and keep hosting boring and reliable.',
          example: 'A simple landing page on Vercel with the domain and SSL working is infinitely better than an unfinished website graveyard.',
        },
        whatToDo: [
          'Confirm the domain is registered and DNS access is available',
          'Choose hosting that matches the actual website needs',
          'Set up SSL so the site loads over HTTPS',
          'Publish at least a basic landing page',
          'Configure domain and email DNS records correctly',
        ],
        tools: [
          { name: 'Vercel', url: 'https://vercel.com', description: 'Modern web hosting with a good free tier.' },
          { name: 'Namecheap', url: 'https://namecheap.com', description: 'Affordable domains.' },
          { name: 'Cloudflare', url: 'https://cloudflare.com', description: 'DNS, security, and performance.' },
          { name: 'Framer', url: 'https://framer.com', description: 'Fast no-code site building.' },
        ],
      },
      {
        number: 3,
        slug: 'core-software-stack',
        title: 'Set Up Core Software Stack',
        description: 'Pick the essential operational tools without creating tool overlap.',
        helper: {
          howToDoThis: 'Choose one tool per category and bias toward integration, not shiny clutter.',
          example: 'A lean stack beats SaaS hoarding every single time.',
        },
        whatToDo: [
          'Identify the daily operational needs of the business',
          'Choose tools that integrate cleanly together',
          'Start with free tiers where possible',
          'Document the chosen tools and why they were picked',
          'Set up accounts and basic settings properly',
        ],
        softwareCategories: [
          { category: 'Project Management', examples: ['Notion', 'Asana', 'Trello', 'Linear'] },
          { category: 'Time Tracking', examples: ['Toggl', 'Harvest', 'Clockify'] },
          { category: 'Accounting', examples: ['Xero', 'QuickBooks', 'Wave'] },
          { category: 'Scheduling', examples: ['Calendly', 'Cal.com', 'Acuity'] },
          { category: 'Communication', examples: ['Slack', 'Discord', 'Teams'] },
          { category: 'Design', examples: ['Figma', 'Canva', 'Adobe CC'] },
        ],
        tools: [
          { name: 'Notion', url: 'https://notion.so', description: 'All-in-one workspace.' },
          { name: 'Linear', url: 'https://linear.app', description: 'Issue tracking and projects.' },
          { name: 'Toggl', url: 'https://toggl.com', description: 'Time tracking.' },
          { name: 'Calendly', url: 'https://calendly.com', description: 'Scheduling.' },
        ],
      },
      {
        number: 4,
        slug: 'file-and-document-system',
        title: 'Create Internal File & Document System',
        description: 'Organize files, templates, and internal documentation so the business can scale sanely.',
        helper: {
          howToDoThis: 'Build the structure once, keep naming consistent, and stop future-you from digging through chaos.',
          example: 'Simple numbered root folders make the whole business feel less feral.',
        },
        whatToDo: [
          'Choose cloud storage for business files',
          'Create a logical folder structure',
          'Set naming conventions for important files',
          'Create templates for common documents',
          'Set up backup and versioning practices',
        ],
        folderStructure: [
          { name: '01_Clients', description: 'Client subfolders with briefs, deliverables, and contracts.' },
          { name: '02_Finance', description: 'Invoices, receipts, tax docs, and reports.' },
          { name: '03_Marketing', description: 'Brand assets, content, and website files.' },
          { name: '04_Operations', description: 'Processes, SOPs, and internal docs.' },
          { name: '05_Templates', description: 'Reusable contracts, proposals, and email templates.' },
        ],
        tools: [
          { name: 'Google Drive', url: 'https://drive.google.com', description: 'Cloud storage.' },
          { name: 'Notion', url: 'https://notion.so', description: 'Knowledge base and docs.' },
          { name: 'Dropbox', url: 'https://dropbox.com', description: 'File sync and sharing.' },
          { name: 'Backblaze', url: 'https://backblaze.com', description: 'Automatic backup.' },
        ],
      },
      {
        number: 5,
        slug: 'customer-management-system',
        title: 'Set Up Customer Management System',
        description: 'Track leads, customers, and follow-ups in one place.',
        helper: {
          howToDoThis: 'Track the few fields you will actually maintain, then review them on a real cadence.',
          example: 'If leads are not in the system, they do not exist. Inbox archaeology is not a CRM.',
        },
        whatToDo: [
          'Decide what customer information needs tracking',
          'Choose a CRM or simple tracking system',
          'Define pipeline stages',
          'Create a lead capture and update process',
          'Review customer data weekly',
        ],
        crmFields: [
          { field: 'Contact Name', required: true },
          { field: 'Email', required: true },
          { field: 'Company', required: false },
          { field: 'Lead Source', required: true },
          { field: 'Status', required: true },
          { field: 'Estimated Value', required: false },
          { field: 'Last Contact Date', required: true },
          { field: 'Next Action', required: true },
          { field: 'Notes', required: false },
        ],
        tools: [
          { name: 'HubSpot CRM', url: 'https://hubspot.com/crm', description: 'Free CRM with email tracking.' },
          { name: 'Pipedrive', url: 'https://pipedrive.com', description: 'Visual sales pipeline.' },
          { name: 'Notion', url: 'https://notion.so', description: 'Custom CRM databases.' },
          { name: 'Airtable', url: 'https://airtable.com', description: 'Flexible database-style CRM.' },
        ],
      },
      {
        number: 6,
        slug: 'workflow-automation',
        title: 'Build Basic Workflow Automation',
        description: 'Connect tools and automate repetitive tasks.',
        helper: {
          howToDoThis: 'Automate the obvious repetitive bits first and document what each automation is supposed to do.',
          example: 'Lead form → CRM → confirmation email → follow-up task is a good first automation; an Rube Goldberg machine is not.',
        },
        whatToDo: [
          'Identify repetitive tasks worth automating',
          'Map the tools that need to talk to each other',
          'Start with simple automations first',
          'Document the automations clearly',
          'Test them before relying on them',
        ],
        tools: [
          { name: 'Zapier', url: 'https://zapier.com', description: 'Connects thousands of apps.' },
          { name: 'Make', url: 'https://make.com', description: 'Visual automation builder.' },
          { name: 'n8n', url: 'https://n8n.io', description: 'Open-source automation.' },
          { name: 'IFTTT', url: 'https://ifttt.com', description: 'Simple app connections.' },
        ],
      },
      {
        number: 7,
        slug: 'security-and-access-control',
        title: 'Set Up Security & Access Control',
        description: 'Protect the business with passwords, backups, and access management.',
        helper: {
          howToDoThis: 'Treat security as boring infrastructure, not as something to panic about only after a screw-up.',
          example: 'Password manager plus 2FA plus backups is the baseline, not the advanced version.',
        },
        whatToDo: [
          'Set up a password manager',
          'Enable 2FA on all important accounts',
          'Create a backup strategy for critical data',
          'Document who has access to which systems',
          'Plan for account recovery',
        ],
        securityChecklist: [
          { item: 'Password manager set up', priority: 'Critical' },
          { item: '2FA enabled on email', priority: 'Critical' },
          { item: '2FA enabled on financial accounts', priority: 'Critical' },
          { item: '2FA enabled on all other business tools', priority: 'High' },
          { item: 'Automatic file backup configured', priority: 'High' },
          { item: 'Recovery codes stored securely', priority: 'High' },
          { item: 'Access list documented', priority: 'Medium' },
          { item: 'Regular password rotation scheduled', priority: 'Medium' },
        ],
        tools: [
          { name: '1Password', url: 'https://1password.com', description: 'Password manager.' },
          { name: 'Bitwarden', url: 'https://bitwarden.com', description: 'Open-source password manager.' },
          { name: 'Authy', url: 'https://authy.com', description: 'Authenticator app.' },
          { name: 'Backblaze', url: 'https://backblaze.com', description: 'Automatic cloud backup.' },
        ],
      },
    ],
    infrastructureLayer: {
      operatingPosture: `${businessName} should run on a lean, recoverable infrastructure stack instead of scattered accounts and tool chaos.`,
      completionCallout: {
        badge: 'Phase 5 Complete',
        title: 'Ready for Product & Service',
        description: 'Continue once the business has a usable operating stack, basic automation, and sane security coverage.',
      },
    },
  }

  return {
    number: 5,
    title: 'Infrastructure',
    summary: 'Build the systems and tools the business runs on every day.',
    progress: {
      totalSteps: 7,
      completedSteps: 0,
    },
    content: generated,
    generated,
    userState: {
      completedStepIds: [],
      selectedSoftware: {},
      checkedFolders: [],
      checkedCrmFields: [],
      checkedSecurity: [],
    },
    tasks: buildInfrastructureTasks(),
  }
}

function buildMarketingTasks() {
  return [
    {
      title: 'Define the target audience',
      whatToDo: 'Get specific about who the business is for and who it is not for.',
      howToDoIt: 'Describe real buyer traits, pain points, and where they pay attention instead of saying “everyone”.',
      executionReference: 'Use Step 1 as the filter for every future channel, offer, and message choice.',
      isRequired: true,
      stepNumber: 1,
    },
    {
      title: 'Clarify the core message',
      whatToDo: 'Write the simplest version of what the business does, for whom, and why it matters.',
      howToDoIt: 'Make it repeatable and specific enough that a stranger can actually understand it.',
      executionReference: 'Use Step 2 for homepage copy, intros, and sales messaging.',
      isRequired: true,
      stepNumber: 2,
    },
    {
      title: 'Choose the main channels',
      whatToDo: 'Pick the few channels worth consistent effort.',
      howToDoIt: 'Prefer two or three channels you can actually maintain over spraying content everywhere.',
      executionReference: 'Use Step 3 to stay focused instead of becoming a part-time content janitor.',
      isRequired: true,
      stepNumber: 3,
    },
    {
      title: 'Set content pillars',
      whatToDo: 'Choose repeatable themes that support trust, reach, and relevance.',
      howToDoIt: 'Use a handful of pillars that make content easier to produce without sounding repetitive.',
      executionReference: 'Use Step 4 to build a content rhythm that still sounds like the business.',
      isRequired: true,
      stepNumber: 4,
    },
    {
      title: 'Create basic social proof and authority assets',
      whatToDo: 'Make the business look credible before asking strangers to trust it.',
      howToDoIt: 'Start with testimonials, case studies, proof points, and a few strong profile or website assets.',
      executionReference: 'Use Step 5 to reduce “why should I believe you?” friction.',
      isRequired: true,
      stepNumber: 5,
    },
    {
      title: 'Test paid ads only if ready',
      whatToDo: 'Use paid reach carefully when the offer and tracking are already in place.',
      howToDoIt: 'Start tiny, test the obvious variants, and do not set money on fire to compensate for weak messaging.',
      executionReference: 'Use Step 6 as an optional accelerator, not as a crutch.',
      isRequired: false,
      stepNumber: 6,
    },
    {
      title: 'Build a simple lead capture system',
      whatToDo: 'Give interested people a clean way to opt in or enquire.',
      howToDoIt: 'Use one lead magnet or offer, one landing page, and one basic email flow before making it fancier.',
      executionReference: 'Use Step 7 to turn attention into contactable leads.',
      isRequired: true,
      stepNumber: 7,
    },
  ]
}

export function buildMarketingPhase(project, blueprint, infrastructurePhase) {
  const businessName = project.name || 'Your Business'

  const generated = {
    steps: [
      {
        number: 1,
        slug: 'target-audience',
        title: 'Define Your Target Audience',
        description: 'Clearly identify who the business is for and who you want to reach.',
        helper: {
          howToDoThis: 'Pick a real buyer type with real pain instead of pretending the offer is for everyone with a pulse.',
          example: 'Small service-business owners in Australia is useful; “anyone who wants growth” is mush.',
        },
        whatToDo: [
          'Describe the ideal customer in specific detail',
          'Identify demographics like age, location, income, or role',
          'Define pain points, values, and interests',
          'Work out where they spend time online and offline',
          'Create one to three usable personas',
        ],
        personaFields: [
          { field: 'Demographics', examples: 'Age, location, income, job title, industry' },
          { field: 'Goals', examples: 'What are they trying to achieve?' },
          { field: 'Pain Points', examples: 'What problems frustrate them?' },
          { field: 'Where They Hang Out', examples: 'Online platforms, communities, events' },
          { field: 'How They Make Decisions', examples: 'Research style, who influences them' },
        ],
      },
      {
        number: 2,
        slug: 'core-message',
        title: 'Craft Your Core Message',
        description: 'Create a clear value proposition and simple message the market can repeat.',
        helper: {
          howToDoThis: 'Write it plainly enough that someone could repeat it after one read.',
          example: `“I help [audience] achieve [result] through [method]” is boring, but it works because it forces clarity.`,
        },
        whatToDo: [
          'Write a clear one-line value proposition',
          'Define the outcome you help people achieve',
          'Explain what makes the approach different',
          'List the proof points that support the claim',
          'Use the same core message across site, profile, and pitch',
        ],
        messagePrompts: ['What makes you different?', 'What results do you deliver?', 'Why should they trust you?'],
      },
      {
        number: 3,
        slug: 'marketing-channels',
        title: 'Choose Your Marketing Channels',
        description: 'Pick the channels that match the audience and the way the business can realistically show up.',
        helper: {
          howToDoThis: 'Choose the smallest set of channels that gives you a real chance of consistency.',
          example: 'Two channels done properly beats six neglected profiles collecting dust.',
        },
        whatToDo: [
          'Choose two to three main channels',
          'Match channel choice to the audience and offer',
          'Be realistic about effort and content format',
          'Document the reason each chosen channel matters',
          'Ignore channels that only look trendy',
        ],
        marketingChannels: [
          { name: 'LinkedIn', bestFor: 'B2B, professional services, consulting', effort: 'Medium' },
          { name: 'Instagram', bestFor: 'Visual brands, lifestyle, younger B2C', effort: 'High' },
          { name: 'TikTok', bestFor: 'Gen Z / Millennial, personality-led reach', effort: 'High' },
          { name: 'Facebook', bestFor: 'Local business, older demographics, groups', effort: 'Medium' },
          { name: 'Twitter / X', bestFor: 'Tech, news, networking, thought leadership', effort: 'Medium' },
          { name: 'YouTube', bestFor: 'Education, tutorials, long-form value', effort: 'Very High' },
          { name: 'Email Newsletter', bestFor: 'Owned audience and direct relationship', effort: 'Medium' },
          { name: 'Blog / SEO', bestFor: 'Long-term traffic and authority', effort: 'High' },
        ],
      },
      {
        number: 4,
        slug: 'content-pillars',
        title: 'Set Your Content Pillars',
        description: 'Choose the repeatable themes that make content easier to plan and publish.',
        helper: {
          howToDoThis: 'Pick three to five pillars that support trust, relevance, and reach without turning into generic sludge.',
          example: 'Educational, behind-the-scenes, and social proof is a solid starting trio for a lot of businesses.',
        },
        whatToDo: [
          'Choose three to five repeatable content themes',
          'Map each pillar to a customer problem or trust trigger',
          'Use the pillars to avoid random posting',
          'Keep the topics broad enough for repetition but narrow enough to stay relevant',
          'Review which pillars actually get traction',
        ],
        contentPillars: [
          'Educational content (how-to, tips, tutorials)',
          'Behind-the-scenes (process, daily work, build-in-public)',
          'Social proof (testimonials, case studies, results)',
          'Industry insights (trends, news, opinions)',
          'Personal stories (journey, lessons learned)',
          'Entertainment (humour, relatable content)',
        ],
      },
      {
        number: 5,
        slug: 'social-proof-assets',
        title: 'Build Basic Social Proof Assets',
        description: 'Create the trust signals that make the business feel credible to strangers.',
        helper: {
          howToDoThis: 'Show proof early: testimonials, simple case studies, before/after examples, founder credibility, and visible results.',
          example: 'A screenshot, testimonial, short case study, and clear founder bio often do more than a month of vague posting.',
        },
        whatToDo: [
          'Collect at least a few testimonials or proof points',
          'Create one simple case study or results post',
          'Add trust signals to website, social profiles, and pitch materials',
          'Use consistent visuals and tone so the business feels real',
          'Keep a reusable bank of proof assets for future content',
        ],
        proofAssets: [
          'Testimonials and reviews',
          'Case study or client story',
          'Results screenshot or before/after example',
          'Founder credibility / bio block',
          'Portfolio or sample work snapshot',
        ],
      },
      {
        number: 6,
        slug: 'paid-advertising',
        title: 'Set Up Basic Paid Advertising',
        description: 'Optional: configure initial ads to accelerate reach once the basics are ready.',
        helper: {
          howToDoThis: 'Only run ads if the offer, landing page, and tracking are already good enough to deserve traffic.',
          example: 'Throwing ads at a vague offer is just paying money to learn your messaging is weak.',
        },
        whatToDo: [
          'Decide if paid ads make sense at this stage',
          'Choose one platform to start with',
          'Set up basic tracking',
          'Use a small test budget',
          'Test a few simple variations before scaling',
        ],
        adPlatforms: [
          { platform: 'Meta Ads (FB/IG)', best: 'B2C, visual products, local', minBudget: '$5/day' },
          { platform: 'Google Ads', best: 'High-intent searches, services', minBudget: '$10/day' },
          { platform: 'LinkedIn Ads', best: 'B2B, professional services', minBudget: '$20/day' },
          { platform: 'TikTok Ads', best: 'Gen Z / Millennial, short-form reach', minBudget: '$20/day' },
        ],
        tools: [
          { name: 'Meta Ads Manager', url: 'https://business.facebook.com/adsmanager', description: 'Facebook and Instagram ads.' },
          { name: 'Google Ads', url: 'https://ads.google.com', description: 'Search and display ads.' },
          { name: 'TikTok Ads', url: 'https://ads.tiktok.com', description: 'Short-form video ads.' },
          { name: 'LinkedIn Ads', url: 'https://linkedin.com/campaignmanager', description: 'B2B ads.' },
        ],
      },
      {
        number: 7,
        slug: 'lead-capture-system',
        title: 'Build a Simple Lead Capture System',
        description: 'Collect leads through landing pages, forms, or a small lead magnet system.',
        helper: {
          howToDoThis: 'Use one compelling lead offer, one clear opt-in path, and one short welcome sequence.',
          example: 'A checklist or template is often enough to start building a list without overcomplicating it.',
        },
        whatToDo: [
          'Create one lead magnet or enquiry hook',
          'Set up an email or newsletter platform',
          'Build a simple landing page or form',
          'Write a short welcome sequence',
          'Add lead capture to website and social touchpoints',
        ],
        leadMagnetIdeas: [
          { type: 'Checklist', example: '10-Point Website Launch Checklist', effort: 'Low' },
          { type: 'Template', example: 'Social Media Content Calendar Template', effort: 'Low' },
          { type: 'Guide / Ebook', example: 'The Complete Guide to [Topic]', effort: 'Medium' },
          { type: 'Mini-Course', example: '5-Day Email Course on [Skill]', effort: 'Medium' },
          { type: 'Quiz', example: 'What’s Your [Type]?', effort: 'Medium' },
          { type: 'Free Consultation', example: '15-Minute Strategy Call', effort: 'Low' },
        ],
        tools: [
          { name: 'ConvertKit', url: 'https://convertkit.com', description: 'Email marketing for creators and small businesses.' },
          { name: 'Mailchimp', url: 'https://mailchimp.com', description: 'Email marketing platform.' },
          { name: 'Beehiiv', url: 'https://beehiiv.com', description: 'Newsletter platform.' },
          { name: 'Carrd', url: 'https://carrd.co', description: 'Simple landing pages.' },
        ],
      },
    ],
    marketingLayer: {
      positioning: `${businessName} should market with clarity, focus, and repeatability instead of shouting into the void.`,
      completionCallout: {
        badge: 'Phase 6 Complete',
        title: 'Ready for Sales',
        description: 'Continue once the business has a clear audience, message, channels, and basic lead capture path.',
      },
    },
  }

  return {
    number: 6,
    title: 'Marketing',
    summary: 'Define the audience, message, channels, content, and lead capture foundations for growth.',
    progress: {
      totalSteps: 7,
      completedSteps: 0,
    },
    content: generated,
    generated,
    userState: {
      completedStepIds: [],
      selectedChannels: [],
      selectedPillars: [],
      selectedLeadMagnet: null,
      checkedPersonaFields: [],
    },
    tasks: buildMarketingTasks(),
  }
}

function buildOperationsTasks() {
  return [
    {
      title: 'Define the delivery process',
      whatToDo: 'Map the step-by-step path from purchase to delivery.',
      howToDoIt: 'Use the last few real jobs as the baseline so the process reflects reality, not fantasy workflow theatre.',
      executionReference: 'Use Step 1 to make delivery easier to explain, repeat, and hand off.',
      isRequired: true,
      stepNumber: 1,
    },
    {
      title: 'Set up the job workflow',
      whatToDo: 'Decide how work moves from new request to completion.',
      howToDoIt: 'Keep the stages simple, visible, and tied to clear move-forward criteria.',
      executionReference: 'Use Step 2 to stop work vanishing into inboxes and vague status updates.',
      isRequired: true,
      stepNumber: 2,
    },
    {
      title: 'Create SOPs for repeatable tasks',
      whatToDo: 'Document the repeated work so it can be done consistently.',
      howToDoIt: 'Start with the tasks that cause the most mistakes, delays, or re-explaining.',
      executionReference: 'Use Step 3 to reduce avoidable operational slop as volume grows.',
      isRequired: true,
      stepNumber: 3,
    },
    {
      title: 'Organise suppliers or fulfilment partners',
      whatToDo: 'Document who helps deliver the offer and how they are managed.',
      howToDoIt: 'Track lead times, contacts, backup options, and escalation paths before something breaks.',
      executionReference: 'Use Step 4 to make external dependencies less fragile.',
      isRequired: false,
      stepNumber: 4,
    },
    {
      title: 'Define the customer communication flow',
      whatToDo: 'Map the updates customers should receive throughout delivery.',
      howToDoIt: 'Template the obvious messages so customers are informed without needing manual chasing every time.',
      executionReference: 'Use Step 5 to reduce support noise and build trust during delivery.',
      isRequired: true,
      stepNumber: 5,
    },
    {
      title: 'Track performance and efficiency',
      whatToDo: 'Measure the few operational metrics that actually matter.',
      howToDoIt: 'Start with simple tracking and review trends regularly instead of drowning in dashboard cosplay.',
      executionReference: 'Use Step 6 to spot where delivery, cost, or quality is drifting.',
      isRequired: true,
      stepNumber: 6,
    },
    {
      title: 'Prepare to scale operations',
      whatToDo: 'Work out what breaks first as volume grows and design around it.',
      howToDoIt: 'Separate founder-only work from what can be delegated or automated, then set triggers for when to act.',
      executionReference: 'Use Step 7 to scale deliberately instead of waiting for chaos to force the issue.',
      isRequired: true,
      stepNumber: 7,
    },
  ]
}

export function buildOperationsPhase(project, blueprint, marketingPhase) {
  const businessName = project.name || 'Your Business'

  const generated = {
    steps: [
      {
        number: 1,
        slug: 'define-service-or-delivery-process',
        title: 'Define Your Service or Delivery Process',
        description: 'Create a clear step-by-step process for delivering your product or service.',
        helper: {
          howToDoThis: 'Start with how delivery actually works today, then tighten it into something another person could follow without guessing.',
          example: 'A clean delivery path makes timelines easier to quote, manage, and repeat without reinventing the wheel for every client.',
        },
        whatToDo: [
          'Map out every step from customer purchase to final delivery',
          'Identify who is responsible for each step',
          'Estimate time required for each stage',
          'Document inputs needed and outputs produced at each step',
          'Identify potential bottlenecks or failure points',
        ],
        howToDoIt: [
          'Start by describing your last 3 successful deliveries step by step',
          'Use a simple flowchart or numbered list to visualize the process',
          'Time yourself on each step to get realistic estimates',
          'Ask whether someone else could follow this process tomorrow',
          'Include quality checkpoints so errors get caught before handover',
        ],
        example: {
          title: 'Web Designer Delivery Process',
          content: 'A freelance web designer documents the flow from onboarding call to asset collection, homepage mockup, feedback, revisions, build, testing, training, launch, and handover. Total delivery time becomes far easier to communicate and repeat.',
        },
        tools: [
          { name: 'Miro', url: 'https://miro.com', description: 'Visual process mapping.' },
          { name: 'Whimsical', url: 'https://whimsical.com', description: 'Simple flowcharts and diagrams.' },
          { name: 'Notion', url: 'https://notion.so', description: 'Process documentation and internal wiki.' },
          { name: 'Loom', url: 'https://loom.com', description: 'Record process walkthroughs.' },
        ],
      },
      {
        number: 2,
        slug: 'order-or-job-workflow',
        title: 'Set Up Order or Job Workflow',
        description: 'Define how customer requests and orders move through your system.',
        helper: {
          howToDoThis: 'Use a simple kanban-style flow with clear stage rules so work is visible and nothing gets stuck quietly.',
          example: 'A coaching business can move leads from inquiry to discovery call, proposal, enrolled, onboarding, active client, and complete with each stage tied to a checklist.',
        },
        whatToDo: [
          'Define workflow stages such as New, In Progress, Review, and Complete',
          'Set up a system to track where each job or order is',
          'Create triggers for moving between stages',
          'Assign ownership at each stage',
          'Build in notifications so nothing falls through cracks',
        ],
        workflowStages: [
          { stage: 'New Request', description: 'Initial inquiry or order received.', action: 'Acknowledge within 24 hours' },
          { stage: 'Qualified', description: 'Confirmed fit and details collected.', action: 'Send proposal or confirm order' },
          { stage: 'In Progress', description: 'Work actively being done.', action: 'Provide progress updates' },
          { stage: 'Review', description: 'Awaiting client feedback or approval.', action: 'Follow up if no response in 3 days' },
          { stage: 'Complete', description: 'Delivered and accepted.', action: 'Send invoice and request feedback' },
        ],
        tools: [
          { name: 'Trello', url: 'https://trello.com', description: 'Simple kanban boards.' },
          { name: 'Notion', url: 'https://notion.so', description: 'Custom workflow databases.' },
          { name: 'Monday.com', url: 'https://monday.com', description: 'Work management platform.' },
          { name: 'Linear', url: 'https://linear.app', description: 'Project and issue tracking.' },
        ],
      },
      {
        number: 3,
        slug: 'standard-operating-procedures',
        title: 'Create Standard Operating Procedures (SOPs)',
        description: 'Document repeatable tasks so they are done consistently every time.',
        helper: {
          howToDoThis: 'Start with the tasks you repeat most often or screw up most often, then document them plainly enough that someone else could follow them.',
          example: 'A client onboarding SOP covering welcome email, folder setup, kickoff scheduling, and questionnaire sending stops the same small misses happening over and over.',
        },
        whatToDo: [
          'Identify your most repeated tasks',
          'Document step-by-step instructions anyone could follow',
          'Include screenshots, templates, and examples',
          'Store SOPs in an accessible location',
          'Review them regularly so they stay current',
        ],
        sopCategories: [
          { category: 'Client Onboarding', examples: 'Welcome email, folder setup, kickoff call agenda' },
          { category: 'Service Delivery', examples: 'Step-by-step for each service you offer' },
          { category: 'Quality Assurance', examples: 'Checklists before sending deliverables' },
          { category: 'Client Communication', examples: 'Update templates and feedback request process' },
          { category: 'Project Closeout', examples: 'Final delivery, invoice, feedback collection' },
          { category: 'Admin & Operations', examples: 'Invoicing, bookkeeping, tool maintenance' },
        ],
        tools: [
          { name: 'Notion', url: 'https://notion.so', description: 'SOP documentation and wiki.' },
          { name: 'Scribe', url: 'https://scribehow.com', description: 'Auto-generate SOPs from screen recordings.' },
          { name: 'Loom', url: 'https://loom.com', description: 'Video walkthroughs.' },
          { name: 'Process Street', url: 'https://process.st', description: 'Checklist-based SOPs.' },
        ],
      },
      {
        number: 4,
        slug: 'supplier-or-fulfilment-systems',
        title: 'Set Up Supplier or Fulfilment Systems',
        description: 'Organize sourcing, production, or delivery partners if applicable.',
        helper: {
          howToDoThis: 'Track supplier details, lead times, and fallback options before they become a problem instead of after.',
          example: 'An e-commerce business that documents its primary printer, backup printer, packaging supplier, and shipping arrangement can handle fulfilment issues without panic.',
        },
        whatToDo: [
          'List all external parties involved in delivery',
          'Document contact info, lead times, and terms',
          'Set up ordering and communication processes',
          'Create backup options for critical suppliers',
          'Establish quality standards and issue handling',
        ],
        tools: [
          { name: 'Notion', url: 'https://notion.so', description: 'Supplier database and operating notes.' },
          { name: 'Airtable', url: 'https://airtable.com', description: 'Inventory and supplier tracking.' },
          { name: 'ShipStation', url: 'https://shipstation.com', description: 'Shipping automation.' },
          { name: 'Printful', url: 'https://printful.com', description: 'Print-on-demand fulfilment.' },
        ],
      },
      {
        number: 5,
        slug: 'customer-communication-flow',
        title: 'Implement Customer Communication Flow',
        description: 'Define how you update customers throughout the delivery process.',
        helper: {
          howToDoThis: 'Map the obvious communication triggers, template them, and automate the ones that should not need manual effort.',
          example: 'A photographer can automate booking confirmation, prep reminders, progress updates, delivery, and follow-up so clients always know what is happening.',
        },
        whatToDo: [
          'Map every touchpoint where customers need communication',
          'Create templates for each standard message',
          'Set up automated notifications where possible',
          'Define response time expectations',
          'Establish escalation paths for urgent issues',
        ],
        touchpoints: [
          { touchpoint: 'Order or Booking Confirmed', timing: 'Immediately', message: 'Thank you, here is what happens next' },
          { touchpoint: 'Work Started', timing: 'Day 1', message: 'We have begun and the expected completion date is X' },
          { touchpoint: 'Milestone Reached', timing: 'Mid-project', message: 'Progress update plus request for any early feedback' },
          { touchpoint: 'Ready for Review', timing: 'Pre-delivery', message: 'Please review by X date' },
          { touchpoint: 'Delivered', timing: 'Completion', message: 'Here is your deliverable, how to use it, and next steps' },
          { touchpoint: 'Follow-up', timing: '1 week later', message: 'How is everything going and can you share feedback?' },
        ],
        tools: [
          { name: 'Dubsado', url: 'https://dubsado.com', description: 'Client workflow automation.' },
          { name: 'HoneyBook', url: 'https://honeybook.com', description: 'Client management and automation.' },
          { name: 'Intercom', url: 'https://intercom.com', description: 'Customer messaging platform.' },
          { name: 'Help Scout', url: 'https://helpscout.com', description: 'Customer support and docs.' },
        ],
      },
      {
        number: 6,
        slug: 'performance-and-efficiency',
        title: 'Track Performance & Efficiency',
        description: 'Measure time, cost, output, and delivery quality.',
        helper: {
          howToDoThis: 'Pick a few metrics that actually help you improve delivery and profitability, then review them on a real cadence.',
          example: 'A freelancer tracking completion time, revenue per hour, revisions, and client satisfaction can spot where margin is leaking before it becomes normal.',
        },
        whatToDo: [
          'Identify 3 to 5 key metrics that matter for operations',
          'Set up simple tracking for each metric',
          'Establish baselines and targets',
          'Schedule regular reviews',
          'Use data to identify improvement opportunities',
        ],
        metrics: [
          { metric: 'Delivery Time', description: 'Average days from start to completion', target: 'Reduce by 20%' },
          { metric: 'Cost Per Job', description: 'Total cost including time and expenses per delivery', target: 'Track and optimize' },
          { metric: 'Client Satisfaction', description: 'Post-project rating or NPS score', target: '9+ out of 10' },
          { metric: 'Revision Rate', description: 'Average revision rounds per project', target: 'Less than 2' },
          { metric: 'Capacity Utilization', description: 'Percentage of available time that is billable', target: '70-80%' },
        ],
        tools: [
          { name: 'Toggl', url: 'https://toggl.com', description: 'Time tracking and reports.' },
          { name: 'Notion', url: 'https://notion.so', description: 'Custom dashboards.' },
          { name: 'Google Sheets', url: 'https://sheets.google.com', description: 'Simple metric tracking.' },
          { name: 'Databox', url: 'https://databox.com', description: 'Business dashboards.' },
        ],
      },
      {
        number: 7,
        slug: 'prepare-for-scaling-operations',
        title: 'Prepare for Scaling Operations',
        description: 'Ensure processes can handle more customers without breaking.',
        helper: {
          howToDoThis: 'Run the 10x thought experiment, then document what only you can do versus what can be delegated or automated.',
          example: 'An agency that defines hiring triggers and documents founder-dependent work before growth hits can scale with far less chaos.',
        },
        whatToDo: [
          'Identify what breaks first when volume increases',
          'Document which tasks only you can do versus what can be delegated',
          'Create systems that do not require constant founder involvement',
          'Plan capacity and workload limits',
          'Set hiring, outsourcing, or automation triggers',
        ],
        scalingChecklist: [
          { task: 'Delivery process documented and repeatable', status: 'Foundation' },
          { task: 'Key tasks identified for delegation', status: 'Planning' },
          { task: 'SOPs created for delegatable tasks', status: 'Preparation' },
          { task: 'Capacity limits defined', status: 'Awareness' },
          { task: 'Hiring triggers set to revenue or volume milestones', status: 'Growth' },
          { task: 'Automation implemented for repetitive tasks', status: 'Efficiency' },
        ],
        tools: [
          { name: 'Notion', url: 'https://notion.so', description: 'Planning and documentation.' },
          { name: 'Loom', url: 'https://loom.com', description: 'Training videos for delegation.' },
          { name: 'Zapier', url: 'https://zapier.com', description: 'Automation for scale.' },
          { name: 'Upwork', url: 'https://upwork.com', description: 'Freelance talent for delegation.' },
        ],
      },
    ],
    operationsLayer: {
      operatingPosture: `${businessName} should deliver through a clear, documented, and scalable operating system instead of founder memory and improvised admin.`,
      completionCallout: {
        badge: 'Phase 7 Complete',
        title: 'Ready for Sales',
        description: 'Continue once the business has a repeatable delivery process, clear customer communication, and basic operational metrics.',
      },
    },
  }

  return {
    number: 7,
    title: 'Operations',
    summary: 'Set up how the business delivers its product or service reliably and at scale.',
    progress: {
      totalSteps: 7,
      completedSteps: 0,
    },
    content: generated,
    generated,
    userState: {
      completedStepIds: [],
      checkedWorkflowStages: [],
      checkedSopCategories: [],
      checkedMetrics: [],
      checkedTouchpoints: [],
    },
    tasks: buildOperationsTasks(),
  }
}

function buildSalesTasks() {
  return [
    {
      title: 'Define the sales process',
      whatToDo: 'Map the journey from first contact to payment received.',
      howToDoIt: 'Keep the stages explicit so you can see where deals move, stall, or die instead of guessing.',
      executionReference: 'Use Step 1 to create a sales pipeline that is simple enough to run and measure.',
      isRequired: true,
      stepNumber: 1,
    },
    {
      title: 'Set up lead qualification',
      whatToDo: 'Filter good-fit leads from time-wasting enquiries early.',
      howToDoIt: 'Use a few sharp qualification questions so attention goes to the leads that can actually close.',
      executionReference: 'Use Step 2 to protect time, improve close rate, and reduce pointless back-and-forth.',
      isRequired: true,
      stepNumber: 2,
    },
    {
      title: 'Build the sales conversation framework',
      whatToDo: 'Create a consistent structure for discovery, pitching, objection handling, and closing.',
      howToDoIt: 'Script the bones, not every breath, so conversations stay natural without turning into chaos.',
      executionReference: 'Use Step 3 to make sales calls tighter, calmer, and more repeatable.',
      isRequired: true,
      stepNumber: 3,
    },
    {
      title: 'Install a follow-up system',
      whatToDo: 'Create follow-up touchpoints so proposals and leads do not rot quietly.',
      howToDoIt: 'Use reminders or automation, and make each follow-up add value rather than begging for attention.',
      executionReference: 'Use Step 4 to recover deals that would otherwise fade out for stupid reasons.',
      isRequired: true,
      stepNumber: 4,
    },
    {
      title: 'Track conversion performance',
      whatToDo: 'Measure the funnel so you know where sales are breaking.',
      howToDoIt: 'Track stage conversion, deal value, and cycle length before you start making random optimisation moves.',
      executionReference: 'Use Step 5 to turn sales from vibes into numbers.',
      isRequired: true,
      stepNumber: 5,
    },
    {
      title: 'Optimise the offer',
      whatToDo: 'Improve pricing, packaging, risk reversal, and perceived value.',
      howToDoIt: 'Tune the offer around what buyers hesitate over, not what sounds clever in your own head.',
      executionReference: 'Use Step 6 to make the offer easier to say yes to without racing to the bottom.',
      isRequired: true,
      stepNumber: 6,
    },
    {
      title: 'Test and improve conversion rates',
      whatToDo: 'Run controlled tests on the weakest points in the sales funnel.',
      howToDoIt: 'Change one thing at a time and document results so improvement compounds instead of getting muddier.',
      executionReference: 'Use Step 7 to build a conversion playbook instead of repeating the same sales mistakes forever.',
      isRequired: true,
      stepNumber: 7,
    },
  ]
}

export function buildSalesPhase(project, blueprint, operationsPhase) {
  const businessName = project.name || 'Your Business'

  const generated = {
    steps: [
      {
        number: 1,
        slug: 'define-sales-process',
        title: 'Define Your Sales Process',
        description: 'Clear steps from first contact to completed sale.',
        helper: {
          howToDoThis: 'Start with the actual path your last few sales took, then clean it up into a repeatable pipeline with clear stage rules.',
          example: 'A consultant can move from inquiry to qualification, discovery, proposal, negotiation, and close with clear handoffs and target timing.',
        },
        whatToDo: [
          'Map every stage from initial contact to payment received',
          'Define what happens at each stage and who is responsible',
          'Set timeframes for each stage',
          'Identify decision points and likely drop-off points',
          'Create a visual pipeline you can track and measure',
        ],
        howToDoIt: [
          'Start simple with inquiry, qualification, proposal, negotiation, and close',
          'For each stage define entry criteria, required actions, and exit criteria',
          'Map your last 5 sales and note where deals stall most often',
          'Use a CRM or a simple tracker to keep deals moving through stages',
          'Review pipeline bottlenecks weekly instead of waiting for revenue anxiety to do it for you',
        ],
        example: {
          title: 'Consultant Sales Process',
          content: 'A business consultant tracks inquiry response, discovery scheduling, proposal turnaround, follow-up, negotiation, signed contract, and invoicing. Average time from inquiry to close becomes visible and improvable.',
        },
        salesProcessStages: [
          { stage: 'Inquiry', description: 'New lead comes in via form, email, or referral.', timing: 'Respond within 24 hours' },
          { stage: 'Qualification', description: 'Determine if the lead is a good fit.', timing: '1-2 days' },
          { stage: 'Discovery', description: 'Understand needs, goals, and constraints.', timing: '30-60 min call' },
          { stage: 'Proposal', description: 'Present the tailored solution and pricing.', timing: 'Within 48 hours of discovery' },
          { stage: 'Negotiation', description: 'Handle concerns and adjust terms if needed.', timing: 'As needed' },
          { stage: 'Close', description: 'Contract signed and payment received.', timing: 'Target within 14 days of inquiry' },
        ],
        tools: [
          { name: 'Pipedrive', url: 'https://pipedrive.com', description: 'Visual sales pipeline CRM.' },
          { name: 'HubSpot CRM', url: 'https://hubspot.com/crm', description: 'Free CRM with pipeline tracking.' },
          { name: 'Notion', url: 'https://notion.so', description: 'Custom sales tracking.' },
          { name: 'Close', url: 'https://close.com', description: 'CRM built for closing.' },
        ],
      },
      {
        number: 2,
        slug: 'lead-qualification',
        title: 'Set Up Lead Qualification',
        description: 'Identify which leads are worth pursuing.',
        helper: {
          howToDoThis: 'Use a short qualification system early so the wrong leads disqualify themselves before they eat your week.',
          example: 'A freelancer asking about budget, timeline, and decision-maker status can quickly separate viable projects from time sinks.',
        },
        whatToDo: [
          'Define your ideal customer criteria',
          'Create qualifying questions to ask early',
          'Set up a scoring or prioritisation system',
          'Know your disqualifying red flags',
          'Build a fast process to filter enquiries',
        ],
        qualificationCriteria: [
          { criteria: 'Budget', question: 'Do they have budget allocated for this?', importance: 'Critical' },
          { criteria: 'Authority', question: 'Can they make or influence the buying decision?', importance: 'Critical' },
          { criteria: 'Need', question: 'Do they have a clear problem you can solve?', importance: 'Critical' },
          { criteria: 'Timeline', question: 'Do they have urgency or a deadline?', importance: 'Important' },
          { criteria: 'Fit', question: 'Are they the right type of customer for you?', importance: 'Important' },
        ],
        tools: [
          { name: 'Typeform', url: 'https://typeform.com', description: 'Interactive intake forms.' },
          { name: 'Calendly', url: 'https://calendly.com', description: 'Booking with screening questions.' },
          { name: 'Tally', url: 'https://tally.so', description: 'Free form builder.' },
          { name: 'HubSpot', url: 'https://hubspot.com', description: 'Lead scoring automation.' },
        ],
      },
      {
        number: 3,
        slug: 'sales-script-or-framework',
        title: 'Create Your Sales Script or Framework',
        description: 'How you communicate, pitch, and handle objections.',
        helper: {
          howToDoThis: 'Structure the conversation so discovery comes before pitching, and objections become a prepared part of the process instead of a surprise every time.',
          example: 'A discovery call works better when it starts with agenda, explores the problem properly, then ties the offer back to what the buyer actually said.',
        },
        whatToDo: [
          'Develop a consistent way to open sales conversations',
          'Create a framework for discovery',
          'Build your pitch structure around problem, solution, proof, and offer',
          'Prepare responses to common objections',
          'Define your closing techniques and calls to action',
        ],
        commonObjections: [
          { objection: 'Too expensive', response: 'What is the cost of not solving this problem?' },
          { objection: 'Need to think about it', response: 'What specifically do you need to think through?' },
          { objection: 'Need to talk to partner or team', response: 'Great, shall we schedule a call with them included?' },
          { objection: 'Not the right time', response: 'When would be the right time, and shall we book that now?' },
          { objection: 'Using a competitor', response: 'What would need to change for you to consider switching?' },
        ],
        tools: [
          { name: 'Notion', url: 'https://notion.so', description: 'Script and objection library.' },
          { name: 'Otter.ai', url: 'https://otter.ai', description: 'Record and review sales calls.' },
          { name: 'Gong', url: 'https://gong.io', description: 'Sales call analysis.' },
          { name: 'Loom', url: 'https://loom.com', description: 'Video sales messages.' },
        ],
      },
      {
        number: 4,
        slug: 'follow-up-system',
        title: 'Set Up Follow-Up System',
        description: 'Automated or manual follow-ups to close deals.',
        helper: {
          howToDoThis: 'Create a follow-up rhythm before you need it, and make each touch useful instead of needy.',
          example: 'Proposal follow-up works better when the sequence includes clarification, proof, timing, and a clean close-the-loop message.',
        },
        whatToDo: [
          'Define your follow-up sequence',
          'Create templates for each follow-up touchpoint',
          'Set up reminders or automation',
          'Know when to stop following up and how to do it gracefully',
          'Track which sequences actually recover deals',
        ],
        followUpSequence: [
          { day: 'Day 1', action: 'Send proposal with a personalised video walkthrough', channel: 'Email + Loom' },
          { day: 'Day 3', action: 'Check if they have questions and offer clarification', channel: 'Email' },
          { day: 'Day 7', action: 'Share a relevant case study or testimonial', channel: 'Email' },
          { day: 'Day 14', action: 'Mention upcoming availability or timing changes', channel: 'Email or call' },
          { day: 'Day 21', action: 'Final follow-up to close the loop', channel: 'Email' },
        ],
        tools: [
          { name: 'Pipedrive', url: 'https://pipedrive.com', description: 'Activity reminders and sequences.' },
          { name: 'Mailchimp', url: 'https://mailchimp.com', description: 'Automated email sequences.' },
          { name: 'Streak', url: 'https://streak.com', description: 'CRM inside Gmail.' },
          { name: 'Boomerang', url: 'https://boomeranggmail.com', description: 'Email follow-up reminders.' },
        ],
      },
      {
        number: 5,
        slug: 'conversion-tracking',
        title: 'Configure Conversion Tracking',
        description: 'Track leads, conversions, and performance.',
        helper: {
          howToDoThis: 'Track stage movement, win rate, and deal value so you know which part of the funnel needs attention first.',
          example: 'A weekly dashboard showing leads, calls, proposals, wins, and revenue makes weak conversion points obvious fast.',
        },
        whatToDo: [
          'Define what counts as a conversion for your business',
          'Track each stage of the funnel',
          'Calculate core sales metrics',
          'Build a simple dashboard',
          'Review metrics weekly and identify trends',
        ],
        salesMetrics: [
          { metric: 'Lead-to-Close Rate', description: 'Percentage of leads that become customers', benchmark: '15-30%' },
          { metric: 'Average Deal Value', description: 'Mean revenue per closed deal', benchmark: 'Track trend' },
          { metric: 'Sales Cycle Length', description: 'Days from first contact to close', benchmark: '7-30 days' },
          { metric: 'Proposal Win Rate', description: 'Proposals that convert to sales', benchmark: '25-50%' },
          { metric: 'Revenue per Lead', description: 'Total revenue divided by total leads', benchmark: 'Track trend' },
        ],
        tools: [
          { name: 'HubSpot', url: 'https://hubspot.com', description: 'Full funnel analytics.' },
          { name: 'Google Sheets', url: 'https://sheets.google.com', description: 'Simple tracking dashboard.' },
          { name: 'Databox', url: 'https://databox.com', description: 'Sales dashboards.' },
          { name: 'Geckoboard', url: 'https://geckoboard.com', description: 'Real-time KPI dashboards.' },
        ],
      },
      {
        number: 6,
        slug: 'optimise-your-offer',
        title: 'Optimise Your Offer',
        description: 'Refine pricing, packaging, and value proposition to increase conversions.',
        helper: {
          howToDoThis: 'Look at what nearly stops buyers, then improve pricing structure, packaging, bonuses, and guarantees around that friction.',
          example: 'Three tiers, payment options, and a believable guarantee can lift conversions without discounting the soul out of the offer.',
        },
        whatToDo: [
          'Review what is included in your current offer',
          'Test different pricing structures',
          'Add or remove elements to improve perceived value',
          'Create tiers or packages where it makes sense',
          'Strengthen the guarantee or risk reversal',
        ],
        offerChecklist: [
          { item: 'Clear outcome or transformation promised', tip: 'What result do they actually get?' },
          { item: 'Price anchoring in place', tip: 'Higher option first can make the standard option feel sane' },
          { item: 'Bonuses increase perceived value', tip: 'Low cost to you, high value to them' },
          { item: 'Risk reversal or guarantee', tip: 'Remove fear of making the wrong choice' },
          { item: 'Payment options available', tip: 'Reduce the barrier to entry' },
          { item: 'Urgency or scarcity only if genuine', tip: 'No fake countdown clown show' },
        ],
        tools: [
          { name: 'Stripe', url: 'https://stripe.com', description: 'Payment and pricing flexibility.' },
          { name: 'Gumroad', url: 'https://gumroad.com', description: 'Simple product sales.' },
          { name: 'ThriveCart', url: 'https://thrivecart.com', description: 'High-converting checkout.' },
          { name: 'Hotjar', url: 'https://hotjar.com', description: 'See how people interact with offers.' },
        ],
      },
      {
        number: 7,
        slug: 'test-and-improve-conversion-rates',
        title: 'Test and Improve Conversion Rates',
        description: 'Run simple tests and adjust based on results.',
        helper: {
          howToDoThis: 'Start with the weakest point in the funnel, test one variable at a time, and record the result like a grown-up.',
          example: 'Specific outcome-driven headlines usually beat vague generic ones, and testing proves it instead of guessing.',
        },
        whatToDo: [
          'Identify the weakest point in your sales funnel',
          'Form a hypothesis about what might improve it',
          'Run a simple A/B test or controlled change',
          'Measure results over enough volume',
          'Keep the winners, discard the losers, and repeat',
        ],
        testIdeas: [
          'Headline or value proposition',
          'Pricing amount or structure',
          'Call-to-action wording',
          'Follow-up timing',
          'Email subject lines',
          'Proposal format',
          'Discovery call structure',
          'Offer bonuses',
        ],
        tools: [
          { name: 'Google Optimize', url: 'https://optimize.google.com', description: 'Free A/B testing.' },
          { name: 'Hotjar', url: 'https://hotjar.com', description: 'User behaviour insights.' },
          { name: 'Unbounce', url: 'https://unbounce.com', description: 'Landing page testing.' },
          { name: 'VWO', url: 'https://vwo.com', description: 'Conversion optimisation.' },
        ],
      },
    ],
    salesLayer: {
      sellingPosture: `${businessName} should sell through a clear, measured, and repeatable process instead of random follow-ups, hopeful pitching, and pipeline fog.`,
      completionCallout: {
        badge: 'Phase 8 Complete',
        title: 'Ready for Growth & Milestones',
        description: 'Continue once the business has a usable sales process, lead qualification, follow-up system, and conversion tracking baseline.',
      },
    },
  }

  return {
    number: 8,
    title: 'Sales',
    summary: 'Turn interest into paying customers with a clear and repeatable sales process.',
    progress: {
      totalSteps: 7,
      completedSteps: 0,
    },
    content: generated,
    generated,
    userState: {
      completedStepIds: [],
      checkedStages: [],
      checkedCriteria: [],
      checkedObjections: [],
      checkedFollowUps: [],
      checkedMetrics: [],
    },
    tasks: buildSalesTasks(),
  }
}

function buildLaunchScaleTasks() {
  return [
    {
      title: 'Prepare for launch',
      whatToDo: 'Run final checks across the customer journey, systems, and support flow.',
      howToDoIt: 'Do a full end-to-end test before launch day so the obvious failures embarrass you in private instead of in public.',
      executionReference: 'Use Step 1 to make launch feel deliberate instead of chaotic.',
      isRequired: true,
      stepNumber: 1,
    },
    {
      title: 'Execute the initial launch',
      whatToDo: 'Go live across the chosen channels and activate the first wave of demand.',
      howToDoIt: 'Schedule the obvious announcements, then personally reach out to the warmest contacts instead of relying on generic posts alone.',
      executionReference: 'Use Step 2 to create real momentum in the first 24-48 hours.',
      isRequired: true,
      stepNumber: 2,
    },
    {
      title: 'Monitor early performance',
      whatToDo: 'Watch traffic, conversion, revenue, and technical issues closely.',
      howToDoIt: 'Check the key metrics on a short cadence during launch week so you can catch real problems while they still matter.',
      executionReference: 'Use Step 3 to spot breakage, surprises, and quick wins fast.',
      isRequired: true,
      stepNumber: 3,
    },
    {
      title: 'Collect customer feedback',
      whatToDo: 'Ask early buyers and users what worked, what confused them, and what nearly stopped them.',
      howToDoIt: 'Use direct outreach while the experience is still fresh, then tag patterns instead of treating every comment like sacred law.',
      executionReference: 'Use Step 4 to turn early customers into a learning engine, not just revenue.',
      isRequired: true,
      stepNumber: 4,
    },
    {
      title: 'Fix issues and optimise',
      whatToDo: 'Prioritise and resolve the highest-impact problems first.',
      howToDoIt: 'Sort issues by real business impact, then fix the revenue blockers before nibbling at cosmetic nonsense.',
      executionReference: 'Use Step 5 to keep post-launch cleanup sharp and commercially grounded.',
      isRequired: true,
      stepNumber: 5,
    },
    {
      title: 'Increase customer acquisition',
      whatToDo: 'Scale the channels and tactics already showing signs of working.',
      howToDoIt: 'Double down on proven channels before spraying effort across new ones just because they look exciting.',
      executionReference: 'Use Step 6 to scale with discipline instead of channel ADHD.',
      isRequired: true,
      stepNumber: 6,
    },
    {
      title: 'Build retention and repeat business',
      whatToDo: 'Create a post-purchase journey that keeps customers engaged and coming back.',
      howToDoIt: 'Follow up, add value, and ask for referrals after results land instead of vanishing after the sale.',
      executionReference: 'Use Step 7 to turn one-off wins into compounding customer value.',
      isRequired: true,
      stepNumber: 7,
    },
  ]
}

export function buildLaunchScalePhase(project, blueprint, salesPhase) {
  const businessName = project.name || 'Your Business'

  const generated = {
    steps: [
      {
        number: 1,
        slug: 'prepare-for-launch',
        title: 'Prepare for Launch',
        description: 'Final checks across product or service, systems, and customer flow.',
        helper: {
          howToDoThis: 'Run the whole customer journey yourself before launch day. It is astonishing how much dumb breakage this catches.',
          example: 'A creator testing checkout, email delivery, and mobile UX before launch finds the broken button before customers do. Miraculous concept.',
        },
        whatToDo: [
          'Review the entire customer journey from discovery to delivery',
          'Test website, checkout, email sequences, and delivery process',
          'Confirm legal, financial, and operational elements are in place',
          'Prepare support channels and FAQs',
          'Brief anyone involved in launch',
        ],
        howToDoIt: [
          'Do a full end-to-end test as if you were a customer',
          'Create a launch checklist with every critical item and deadline',
          'Test payment processing with a real transaction and refund it if needed',
          'Trigger your own emails and onboarding flows to verify they work',
          'Document a backup plan for each critical system',
        ],
        example: {
          title: 'Pre-Launch Checklist',
          content: 'A launch checklist catches mobile checkout friction, email trigger issues, and missing support readiness before go-live instead of during the panic window.',
        },
        preLaunchChecklist: [
          { item: 'Website fully tested on all devices', category: 'Technical' },
          { item: 'Payment processing tested with a real transaction', category: 'Technical' },
          { item: 'Email sequences tested and working', category: 'Technical' },
          { item: 'Support channels set up and monitored', category: 'Operations' },
          { item: 'FAQs and help docs published', category: 'Operations' },
          { item: 'Team or partners briefed on launch plan', category: 'Operations' },
          { item: 'Legal requirements met', category: 'Legal' },
          { item: 'Backup plan documented for critical failures', category: 'Risk' },
        ],
        tools: [
          { name: 'Notion', url: 'https://notion.so', description: 'Launch checklist and project management.' },
          { name: 'Stripe Test Mode', url: 'https://stripe.com', description: 'Test payments safely.' },
          { name: 'Pingdom', url: 'https://pingdom.com', description: 'Website uptime monitoring.' },
          { name: 'Browserstack', url: 'https://browserstack.com', description: 'Cross-browser testing.' },
        ],
      },
      {
        number: 2,
        slug: 'execute-initial-launch',
        title: 'Execute Initial Launch',
        description: 'Go live, announce, and activate marketing and sales channels.',
        helper: {
          howToDoThis: 'Launch across the core channels, then follow up with warm contacts directly because generic broadcast alone rarely does the heavy lifting.',
          example: 'The first sales often come from people who already know, trust, or almost bought. Shockingly inconvenient for the “just post once” strategy.',
        },
        whatToDo: [
          'Announce the launch across all chosen channels',
          'Activate any paid advertising or promotions',
          'Notify your email list and existing network',
          'Reach out personally to warm leads and early supporters',
          'Monitor closely in the first 24-48 hours',
        ],
        launchDayActivities: [
          { time: 'Pre-launch', activity: 'Final systems check', status: 'ready' },
          { time: 'Launch hour', activity: 'Publish announcement email', status: 'ready' },
          { time: '+1 hour', activity: 'Social media posts go live', status: 'ready' },
          { time: '+2 hours', activity: 'Personal outreach to warm leads', status: 'ready' },
          { time: 'Throughout day', activity: 'Monitor metrics and respond to inquiries', status: 'ready' },
          { time: 'End of day', activity: 'Review results and document learnings', status: 'ready' },
        ],
        tools: [
          { name: 'Buffer', url: 'https://buffer.com', description: 'Schedule social posts.' },
          { name: 'ConvertKit', url: 'https://convertkit.com', description: 'Email launch sequences.' },
          { name: 'Slack', url: 'https://slack.com', description: 'Team coordination and alerts.' },
          { name: 'Zapier', url: 'https://zapier.com', description: 'Automate launch notifications.' },
        ],
      },
      {
        number: 3,
        slug: 'monitor-early-performance',
        title: 'Monitor Early Performance',
        description: 'Track traffic, leads, conversions, and issues in real time.',
        helper: {
          howToDoThis: 'Watch the metrics that actually matter during launch week so you can spot broken flow, weird drops, or unexpected wins while they are still fixable.',
          example: 'Launch monitoring is mostly pattern recognition under mild stress. Glorious stuff.',
        },
        whatToDo: [
          'Set up a launch dashboard with key metrics visible',
          'Monitor traffic sources and visitor behaviour',
          'Track conversion rates through the funnel',
          'Watch for technical issues and UX problems',
          'Document what is working and what is not',
        ],
        launchMetrics: [
          { metric: 'Website Traffic', description: 'Unique visitors during the launch period', target: 'Compare to baseline' },
          { metric: 'Conversion Rate', description: 'Visitors to leads or customers', target: '2-5% typical' },
          { metric: 'Revenue', description: 'Total sales generated', target: 'Your launch goal' },
          { metric: 'Email Open Rate', description: 'Launch email performance', target: '30%+ is good' },
          { metric: 'Support Tickets', description: 'Issues and questions received', target: 'Lower is better' },
        ],
        tools: [
          { name: 'Google Analytics', url: 'https://analytics.google.com', description: 'Traffic and behaviour tracking.' },
          { name: 'Hotjar', url: 'https://hotjar.com', description: 'User session recordings.' },
          { name: 'Databox', url: 'https://databox.com', description: 'Real-time KPI dashboard.' },
          { name: 'Sentry', url: 'https://sentry.io', description: 'Error tracking and monitoring.' },
        ],
      },
      {
        number: 4,
        slug: 'collect-customer-feedback',
        title: 'Collect Customer Feedback',
        description: 'Gather insights from real users and customers.',
        helper: {
          howToDoThis: 'Reach out quickly while the experience is still fresh, then look for patterns instead of overreacting to one loud opinion.',
          example: 'The first twenty customers are usually a goldmine if you actually ask them smart questions instead of hoping they read your mind.',
        },
        whatToDo: [
          'Reach out to every early customer for feedback',
          'Ask specific questions about their experience',
          'Listen for patterns in complaints and praise',
          'Collect testimonials while the experience is fresh',
          'Use the feedback to prioritise improvements',
        ],
        feedbackQuestions: [
          'What made you decide to purchase?',
          'What almost stopped you from buying?',
          'What was confusing about the process?',
          'What do you like most so far?',
          'What would you improve?',
          'Would you recommend this to others? Why or why not?',
        ],
        tools: [
          { name: 'Typeform', url: 'https://typeform.com', description: 'Feedback surveys.' },
          { name: 'Intercom', url: 'https://intercom.com', description: 'In-app feedback and chat.' },
          { name: 'Notion', url: 'https://notion.so', description: 'Feedback log and analysis.' },
          { name: 'Testimonial.to', url: 'https://testimonial.to', description: 'Collect video testimonials.' },
        ],
      },
      {
        number: 5,
        slug: 'fix-issues-and-optimise',
        title: 'Fix Issues & Optimise',
        description: 'Resolve problems and improve weak points quickly.',
        helper: {
          howToDoThis: 'Triage ruthlessly, fix the commercial blockers first, and document what changed so future launches are less feral.',
          example: 'A one-week optimisation sprint can clean up broken forms, weak conversion steps, and delivery friction faster than months of vague intentions.',
        },
        whatToDo: [
          'Prioritise issues by impact',
          'Fix critical bugs and UX problems immediately',
          'Improve conversion bottlenecks based on data',
          'Streamline operational friction that showed up',
          'Update documentation and SOPs based on learnings',
        ],
        issuePriorities: [
          { priority: 'P1 - Fix Now', description: 'Revenue-blocking, reputation risk, security issues' },
          { priority: 'P2 - This Week', description: 'Significant UX issues and conversion blockers' },
          { priority: 'P3 - Backlog', description: 'Nice-to-have improvements and minor issues' },
        ],
        tools: [
          { name: 'Linear', url: 'https://linear.app', description: 'Issue tracking and prioritisation.' },
          { name: 'Hotjar', url: 'https://hotjar.com', description: 'Identify UX friction.' },
          { name: 'Google Optimize', url: 'https://optimize.google.com', description: 'A/B testing.' },
          { name: 'Loom', url: 'https://loom.com', description: 'Document fixes and processes.' },
        ],
      },
      {
        number: 6,
        slug: 'increase-customer-acquisition',
        title: 'Increase Customer Acquisition',
        description: 'Scale marketing and sales efforts that are working.',
        helper: {
          howToDoThis: 'Find the channels that are actually earning their keep, then lean harder into those before getting distracted by every shiny acquisition idea online.',
          example: 'If one content format or channel is clearly outperforming the rest, make more of that before widening the surface area.',
        },
        whatToDo: [
          'Identify the best-performing acquisition channels',
          'Double down on what is working before trying new things',
          'Increase paid budgets gradually on proven channels',
          'Expand content and organic reach in winning formats',
          'Develop referral and partnership programs',
        ],
        scalingChecklist: [
          'Identified best-performing acquisition channel',
          'Calculated ROI or CAC for each channel',
          'Increased budget on proven channels',
          'Created more content in winning formats',
          'Set up referral or affiliate program',
          'Identified partnership opportunities',
        ],
        tools: [
          { name: 'Meta Ads Manager', url: 'https://business.facebook.com/adsmanager', description: 'Scale social advertising.' },
          { name: 'ReferralCandy', url: 'https://referralcandy.com', description: 'Referral program software.' },
          { name: 'SparkToro', url: 'https://sparktoro.com', description: 'Find audience and channels.' },
          { name: 'Ahrefs', url: 'https://ahrefs.com', description: 'SEO and content strategy.' },
        ],
      },
      {
        number: 7,
        slug: 'build-retention-and-repeat-business',
        title: 'Build Retention & Repeat Business',
        description: 'Encourage repeat customers and long-term engagement.',
        helper: {
          howToDoThis: 'Design the post-purchase timeline so customers keep hearing from you in helpful ways instead of being ghosted after the invoice lands.',
          example: 'Follow-up, check-ins, value-add content, and timely referral asks do more for retention than loud generic “community” talk ever will.',
        },
        whatToDo: [
          'Create a post-purchase experience that delights customers',
          'Develop retention strategies like loyalty, subscriptions, or upsells',
          'Stay in touch with past customers through valuable content',
          'Make it easy and rewarding for customers to come back',
          'Build an ongoing relationship beyond the transaction',
        ],
        retentionTactics: [
          { tactic: 'Post-purchase follow-up', timing: '24-48 hours after purchase', goal: 'Ensure success and get feedback' },
          { tactic: 'Value-add content', timing: 'Weekly or monthly', goal: 'Stay top of mind with helpful content' },
          { tactic: 'Check-in outreach', timing: '30, 60, 90 days', goal: 'Identify upsell opportunities' },
          { tactic: 'Exclusive offers', timing: 'Periodically', goal: 'Reward loyalty and drive repeat purchases' },
          { tactic: 'Referral request', timing: 'After positive outcome', goal: 'Generate word-of-mouth' },
        ],
        tools: [
          { name: 'Customer.io', url: 'https://customer.io', description: 'Automated customer journeys.' },
          { name: 'Rewardful', url: 'https://rewardful.com', description: 'Affiliate and loyalty programs.' },
          { name: 'Circle', url: 'https://circle.so', description: 'Community platform.' },
          { name: 'Klaviyo', url: 'https://klaviyo.com', description: 'Retention marketing.' },
        ],
      },
    ],
    launchScaleLayer: {
      growthPosture: `${businessName} should launch with eyes open, fix issues quickly, then scale through measured acquisition and retention instead of blind hope and post-launch amnesia.`,
      completionCallout: {
        badge: 'Phase 9 Complete',
        title: 'Built to Grow With the Company',
        description: 'Keep evolving this phase around real milestones, growth targets, customer feedback, and operating lessons as the business matures.',
      },
    },
  }

  return {
    number: 9,
    title: 'Growth & Milestones',
    summary: 'Launch the business cleanly, then keep this final phase evolving around growth, milestones, optimisation, acquisition, and retention.',
    progress: {
      totalSteps: 7,
      completedSteps: 0,
    },
    content: generated,
    generated,
    userState: {
      completedStepIds: [],
      checkedPrelaunch: [],
      checkedLaunchActivities: [],
      checkedMetrics: [],
      checkedRetention: [],
    },
    tasks: buildLaunchScaleTasks(),
  }
}
