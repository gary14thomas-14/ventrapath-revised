# VentraPath UI Observations

## Source

Screenshots provided by Gaz on 2026-04-26 from the partially built v0.dev frontend.

## What is clearly present

- Premium dark UI with blue/purple gradient accents
- Strong landing page hero with clear CTA (`Start Building`) and secondary pricing CTA
- Multi-step onboarding flow
  - business idea capture
  - location / country selection before blueprint generation
- Blueprint generation progress screen with staged steps
- Blueprint dashboard / viewer with left-side section navigation
- Progress indicator in the blueprint/dashboard area
- Sectioned blueprint presentation using cards, summary blocks, checklists, milestone rows, and expandable task groups
- Section-specific progress appears to be tracked independently

## Screens observed

### 1. Landing page
- Headline: "From idea to launch-ready business"
- Clear positioning as an AI-powered business launch system
- CTA structure is already strong and commercially usable

### 2. Idea input screen
- User enters free-text business idea
- Helpful prompt examples are shown
- Flow feels guided, not chat-based

### 3. Location capture screen
- Country selection is explicitly requested before blueprint generation
- This matches the core VentraPath rule that location is mandatory
- Supporting bullets preview what the blueprint will include

### 4. Blueprint generation/loading screen
- Shows staged pipeline:
  - Understanding Your
  - Analyzing Market
  - Building Revenue
  - Mapping Legal
  - Creating Launch
  - Blueprint Ready
- This visually communicates orchestration / system work well

### 5. Blueprint view/dashboard
- Left sidebar for blueprint sections
- Main content area for the selected section
- Visible sections across the screenshots include:
  - The Business
  - Market
  - Monetisation
  - Execution
  - Legal
  - Website
  - Risks
- Content is displayed in cards with sub-frames like What / How / Why, plus richer section-specific layouts

### 6. Monetisation screen
- Heading: `Monetisation`
- Subtitle: `How your business generates sustainable revenue`
- Shows primary business model in a large summary card
- Example includes `Commission-based marketplace`
- Shows a prominent platform commission percentage (`18%` in the example)
- Breaks revenue into stream cards with percentages and pricing examples
- Example streams shown:
  - Booking Commission
  - Premium Subscriptions

### 7. Execution screen
- Heading: `Execution Plan`
- Subtitle: `Your step-by-step path from idea to launch`
- Shows key milestone row with timeline markers
- Example milestones include MVP launch, bookings, break-even, and user growth
- Contains phase/task grouping with progress per phase
- Example uses an expandable `Phase 1: Foundation` block with task completion counts
- Completed tasks are visibly struck through, which implies persistent task state

### 8. Legal screen
- Heading: `Legal Requirements`
- Subtitle: `Essential legal framework for your business`
- Shows a recommended business structure card
- Example recommends `Limited Liability Company (LLC)` with alternatives beneath it
- Includes a `Requirements Checklist` area below the main recommendation
- Strongly suggests location-aware legal content is meant to be surfaced directly in the UI

### 9. Website screen
- Heading: `Website Blueprint`
- Subtitle: `Your digital presence and online strategy`
- Shows suggested domain and tagline
- Example domain: `petconnect.app`
- Includes `Site Structure` cards such as:
  - Homepage
  - How It Works
  - Find a Sitter
  - Become a Sitter
- This feels more like a concrete digital-presence planning section than a loose note

### 10. Risks screen
- Heading: `Risks & Mitigation`
- Subtitle: `Identifying challenges and preparing solutions`
- Risks are shown in structured cards with severity/impact labels
- Each risk includes a mitigation strategy
- This indicates the blueprint is expected to cover downside planning explicitly, not just opportunity planning

## What this tells us

- The product already feels like a structured application, not a chatbot
- The onboarding flow is aligned with the system description
- The blueprint experience currently looks more like a guided report/dashboard than a conversational result
- The UI direction is strong: minimal, premium, navigational

## Tensions / things to verify later

- Gaz clarified that the UI Phase 0 structure is the real one and should override the later ChatGPT-derived rewrite.
- The screenshots now suggest the actual blueprint/navigation model may be broader than the earlier 5-section reading.
- Based on the UI, the real structure currently appears to include:
  - Business
  - Market
  - Monetisation
  - Execution
  - Legal
  - Website
  - Risks
- Need to confirm whether Website and Risks are true Phase 0 blueprint sections or attached downstream modules still shown inside the blueprint container
- Need to confirm whether the What / How / Why card pattern is the intended final blueprint format or just a placeholder presentation
- Need to confirm whether the loading step labels correspond to actual backend agent calls or just frontend visuals

## Current conclusion

The UI already captures the right feel:
- premium
- guided
- structured
- phase-aware
- non-chat

More importantly, it now gives us a much clearer picture of what the real product shape is: not just a static blueprint report, but a structured blueprint workspace with concrete planning modules for monetisation, execution, legal, website strategy, and risk mitigation.

The current UI information architecture should be treated as the source of truth unless Gaz says otherwise.

## 11. Phase 1 — Brand screen
- Header shows `PHASE 1 OF 10` with title `Brand`
- Subtitle: business identity / positioning / foundation language
- Separate progress block shows `0/5 steps complete`
- Main phase UI is a vertical stack of 5 accordion cards, not a single rich-content page
- Top-right navigation goes `Back to Blueprint`
- Bottom navigation includes `Back to Risks` and `Continue to Phase 2`

### Observed Phase 1 step order
1. Business Name
2. Brand Positioning
3. Logo & Visual Identity
4. Domain & Email Setup
5. Social Handles

### Shared step pattern
Every opened Brand step shown by Gaz includes:
- numbered step badge
- title
- short description
- collapse chevron
- `How to do this` helper button
- `Example` helper button

This implies helper/example content is part of the intended product shape, not decoration.

### 11a. Business Name
- one text input: `Enter your business name`
- CTA: `Check Availability`
- looks like a decision + validation step, not passive content

### 11b. Brand Positioning
- three labeled text areas:
  - `What does your business do?`
  - `Who is it for?`
  - `What makes it different?`
- placeholders suggest user-editable guidance fields rather than static copy blocks

### 11c. Logo & Visual Identity
- two large choice cards:
  - `Upload Logo`
  - `Generate with AI`
- visual system controls shown directly in the step:
  - colour palette groups (`Primary`, `Accent`, `Success`, `Neutral`)
  - font style choices (`Inter`, `Poppins`, `Space Grotesk`)
- this is much more interactive than the earlier generic brand-contract assumption

### 11d. Domain & Email Setup
- provider recommendation list with outbound/open-link icons
- shown providers:
  - Namecheap
  - Google Domains
  - Cloudflare
- each provider has short recommendation copy beneath it
- looks like curated provider suggestions, not a freeform note field

### 11e. Social Handles
- platform-specific handle inputs:
  - Instagram
  - TikTok
  - Twitter / X
  - LinkedIn
- CTA: `Check All Handle Availability`
- this step clearly expects multi-platform structured inputs

## What this changes
- Phase 1 Brand should be treated as a **step-driven guided workflow**
- Backend output should include:
  - ordered steps
  - per-step helper content
  - per-step example content
  - input config / placeholders / CTA labels
  - completion state
- The older generic `content + tasks` model is not wrong, but it is too abstract on its own
- Brand content should still exist underneath, but it should feed this step UI rather than arrive as one undifferentiated block

## 12. Phase 2 — Legal screen
- Header shows `PHASE 2 OF 10` with title `Legal`
- Subtitle focuses on operating, invoicing, and growing legally
- Country pill appears in the header area (`Country: Australia` in the screenshots)
- Separate jurisdiction banner says the guidance is tailored for the selected country
- Separate progress block shows `0/6 steps complete`
- Main phase UI is a vertical stack of 6 accordion cards
- Top and bottom navigation route back to Brand, with a forward CTA to Phase 3

### Observed Phase 2 step order
1. Choose Business Structure
2. Register Your Business
3. Get Your ABN (Australian Business Number)
4. Set Up Taxes
5. Business Bank Account
6. Basic Legal Protection

### Shared step pattern
Every opened Legal step shown by Gaz includes:
- numbered step badge
- title
- short description
- collapse chevron
- `How to do this` helper button
- `Example` helper button

This confirms Legal follows the same guided step model as Brand, but with much tighter jurisdiction dependence.

### 12a. Choose Business Structure
- shows multiple structure cards, not a plain recommendation paragraph
- visible `Recommended` badge on the preferred option
- each structure card includes:
  - structure name
  - short explanation
  - pros list
  - cons list
- shown Australian examples include:
  - Sole Trader
  - Company (Pty Ltd)
  - Partnership

### 12b. Register Your Business
- includes business name input
- includes a linked official authority card
- Australian screenshot routes this through ASIC
- this step clearly expects the backend to know the correct filing authority per country

### 12c. Tax/Business Number step
- Australian screenshot uses ABN explicitly in the step title and input label
- implies the identifier type should be country-specific, not hardcoded globally
- this may vary heavily by country and should likely be data-driven

### 12d. Set Up Taxes
- shows a compact tax summary row with:
  - tax type
  - rate
  - threshold
- includes an official tax-registration link card
- includes user acknowledgement checkboxes
- Australian screenshot shows GST, 10%, and `$75,000 annual turnover`

### 12e. Business Bank Account
- shows curated provider cards with short rationale lines and outbound links
- Australian examples shown:
  - Up Bank
  - Westpac
  - Airwallex
- this appears to be recommendation content, not a regulated government step

### 12f. Basic Legal Protection
- shows document cards for:
  - Terms & Conditions
  - Privacy Policy
  - Service Agreement
- each document has a `Get Template` CTA
- also includes checklist items for created documents
- this step absolutely needs strong disclaimer framing so templates are not mistaken for legal advice or official compliance completion

## What Phase 2 changes
- Phase 2 Legal should be treated as a **jurisdiction-aware step workflow**, not a generic legal note
- Backend output should include:
  - country and region context
  - visible jurisdiction banner/disclaimer copy
  - ordered steps
  - per-step helper content
  - per-step example content
  - official or primary-authority links where action is required
  - structured tax/registration/provider/document cards
  - completion state
- Official links matter here much more than in Brand; wrong links would actively damage trust and usefulness
- Template/document CTAs need explicit disclaimer handling so the UI stays helpful without implying legal certainty

## Current legal caution
- This phase is where VentraPath can become genuinely useful or dangerously sloppy.
- Country specificity is non-negotiable.
- Correct websites matter.
- Visible disclaimer language matters.
- If the exact authority is not known, the system should label the uncertainty rather than fake precision.

## Status

Observation now detailed enough to drive Brand and Legal backend contract shape.
