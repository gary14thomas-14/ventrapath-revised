# VentraPath Decisions

## 2026-04-26

- The previous agent-team build is treated as lost unless recovered from files.
- Rebuild work will be written to disk as it is created.
- Git checkpoints are mandatory before risky fixes, reloads, upgrades, or config changes.
- Bob is the working coordinator for reconstructing the VentraPath agent team.
- Gaz provided the authoritative high-level system description for VentraPath; it is captured in `system-description.md`.
- Gaz later clarified that the real Phase 0 / blueprint structure is the one shown in the UI, not the later ChatGPT-derived rewrite.
- Additional UI screenshots suggest the practical blueprint workspace currently includes: Business, Market, Monetisation, Execution, Legal, Website, and Risks.
- Until told otherwise, treat the UI information architecture as canonical over any ChatGPT-authored definition.
- Blueprint generation has a hard product constraint: target output must stay at or under 2 minutes.
- Therefore, not all 7 core agents should run at full depth on every blueprint task; Bob must route only the required agents and protect latency.
- Every VentraPath blueprint must contain a unique twist that clearly differentiates the user's business from competitors; a blueprint without this is not acceptable.
- Do not start detailed build/design work from this capture alone until Gaz says to begin.
