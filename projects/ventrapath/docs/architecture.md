# VentraPath Architecture

## High-level shape

VentraPath is being built with a split structure:
- `frontend/` holds the product UI
- `backend/` holds the service, persistence, and migrations
- `specs/` holds the backend contract and supporting design artifacts
- `runtime/` holds the agent routing/config layer

## Principle

The system should be understandable from files on disk, not trapped in chat history.

## Current architecture lanes

### Frontend lane
- user-facing product UI
- exported/generated frontend assets
- flows that imply backend requirements

### Spec lane
- converts frontend intent into explicit backend rules
- records domain, API, validation, and workflow expectations
- acts as the source of truth for implementation

### Backend lane
- service endpoints
- persistence layer
- migration system
- blueprint/phase handling
- integration points for orchestration and caching

### Runtime lane
- agent registry
- routing rules
- prompt pack
- latency-aware orchestration policies

### Benchmark lane
- verifies quality and latency against product expectations

## Architectural rule

Do not let any lane silently redefine another one.

- frontend suggests
- spec decides
- backend implements
- tests verify
