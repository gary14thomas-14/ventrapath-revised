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
- Sectioned blueprint presentation using cards and summary blocks

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
- Example shown uses sections like:
  - The Business
  - Market
  - Monetisation
  - Execution
  - Legal
- Content is displayed in cards with sub-frames like What / How / Why

## What this tells us

- The product already feels like a structured application, not a chatbot
- The onboarding flow is aligned with the system description
- The blueprint experience currently looks more like a guided report/dashboard than a conversational result
- The UI direction is strong: minimal, premium, navigational

## Tensions / things to verify later

- Gaz clarified that the UI Phase 0 structure is the real one and should override the later ChatGPT-derived rewrite.
- So, for now, treat these blueprint sections as canonical:
  - Business
  - Market
  - Monetisation
  - Execution
  - Legal
- Need to confirm whether the What / How / Why card pattern is the intended final blueprint format or just a placeholder presentation
- Need to confirm whether the loading step labels correspond to actual backend agent calls or just frontend visuals

## Current conclusion

The UI already captures the right feel:
- premium
- guided
- structured
- phase-aware
- non-chat

It looks like a strong frontend direction, and the current UI information architecture should be treated as the source of truth unless Gaz says otherwise.

## Status

Observation only. No build/design changes started from this note.
