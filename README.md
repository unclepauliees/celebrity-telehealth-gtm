# Obsidian Capital Partners

Marketing and platform site for Obsidian Capital Partners — an institutional M&A and growth capital platform taking principal positions in infrastructure and industrial platform companies.

## What it is

A static HTML/CSS site comprising:
- Main site (`index.html`) — six-act scroll narrative, brand-compliant per OCP Brand Identity Guidelines v1.0
- Platform sub-pages for Hydronex, Tempist, and Commonground (public overview, access gate, portfolio)

## Deployment

Static files deployed via GitHub Pages. No build step — the repository root is the deploy root.

Workflow: `.github/workflows/deploy.yml` triggers on push to `main`.

Dev handoff and architecture documentation maintained separately (not in this repo). Contact the Brand Lead for access.

## Branches

| Branch | Purpose |
|---|---|
| `main` | Live production static site |
| `nuxt-archive` | Preserved Nuxt SPA codebase, structurally non-broken with real content (after Phase B). Recovery option if the site evolves back to SPA architecture. |
