# Obsidian Capital Partners — Subagent Team

Six specialist agents dispatched by the orchestrator to build the OCP site per `OBSIDIAN_CLONE_BRIEF.md`. Each agent owns one discipline and has explicit handoff contracts.

## Dispatch order

**Phase 1 — Foundation (sequential, blocking)**
1. `nuxt-shell-architect` → builds SSR shell, design tokens, persistent nav
2. `brand-compliance-auditor` → audits Phase 1, blocks Phase 2 if fails

**Phase 2 — Parallel build (after Phase 1 pass)**
3. `webgl-scene-engineer` → builds 3D engine + three GLB scenes
4. `narrative-content-architect` → builds Sanity Studio + all copy
5. `ui-component-craftsman` → builds every non-3D component
6. `brand-compliance-auditor` → audits each at PR + at phase end

**Phase 3 — Mobile**
7. `mobile-narrative-designer` → parallel mobile narrative
8. `brand-compliance-auditor` → final audit

## Authority

- `brand-compliance-auditor` can block any phase or merge
- Conflicts between subagents escalate to the orchestrator
- Conflicts between subagent output and brand guidelines always resolve toward the guidelines

## Communication

Each agent writes a handoff doc at `/docs/handoff-phase-N-{agent}.md` when complete. The orchestrator reads these before dispatching the next phase.
