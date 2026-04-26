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
- Every blueprint must fit the actual VentraPath UI structure and presentation model, not just be logically correct in plain text.
- The opening business brief should be short and high-impact — roughly two paragraphs, with the unique twist embedded into the business itself.
- Blueprint sections should be concise and exciting enough to pull the user forward, not overloaded with unnecessary detail.
- Phase 0 must force clarity on three things early: primary buyer, primary payer, and primary business form (software / service / membership / marketplace).
- If buyer, payer, or business form are still blurry after first-pass reasoning, Bob should narrow to the strongest hypothesis or explicitly fail the blueprint instead of smearing multiple models together.
- Blueprint generation has a hard product constraint: target output must stay at or under 2 minutes.
- Therefore, not all 7 core agents should run at full depth on every blueprint task; Bob must route only the required agents and protect latency.
- Every VentraPath blueprint must contain a unique twist that clearly differentiates the user's business from competitors; a blueprint without this is not acceptable.
- Every Legal section must clearly state that it is information only and the user must do their own research / local verification.
- Do not start detailed build/design work from this capture alone until Gaz says to begin.
