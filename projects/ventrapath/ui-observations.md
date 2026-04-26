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

## Status

Observation only. No build/design changes started from this note.
