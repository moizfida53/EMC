# Copilot instructions — EMC repository

(Notes below assume working from the emc.client subfolder unless otherwise stated.)

## Quick commands (emc.client)
- Install deps: `cd emc.client && npm ci`
- Start dev server (cross-platform): `npm run start`  
  - Windows explicit: `npm run start:windows`  
  - Unix/mac explicit: `npm run start:default`  
  - Direct Angular: `ng serve` (same behavior)
- Build: `npm run build` (production by default)
- Continuous build/watch: `npm run watch`
- Run unit tests (Karma + Jasmine): `npm run test`  
  - CI / single run: `ng test --watch=false` or `npm run test -- --watch=false`
  - Focus a single spec during development: use Jasmine `fit` / `fdescribe` in the spec file to focus tests.
- Linting (no npm "lint" script present but ESLint is configured):
  - Check: `npx eslint "src/**/*.{ts,js,html,scss}"`  
  - Fix/format: `npx prettier --check "src/**/*.{ts,scss,html}"` and `npx prettier --write "src/**/*.{ts,scss,html}"`

## High-level architecture
- Frontend SPA in `emc.client` built with Angular (v21), TypeScript and SCSS.  
- Standalone components are the default (configured in `angular.json` schematics).  
- State management: `@ngrx/signals` (reactive signals pattern).  
- Authentication: Azure MSAL (`@azure/msal-angular`, `@azure/msal-browser`).  
- Styling: Tailwind CSS integrated alongside SCSS. Main stylesheet: `src/styles/styles.scss`. Theme files in `src/styles/themes/`. Utilities in `src/styles/utilities/`.
- Assets served from `public/` (see `angular.json`).  
- Dev server: configured in `angular.json` to run on port `64254` by default and uses `src/proxy.conf.js` to forward `/api` and `/weatherforecast` to the backend (default `https://localhost:7280` or an ASP.NET Core port from env).
- HTTPS certs: start scripts reference ASP.NET certificate files at `%APPDATA%\\ASP.NET\\https\\<package>.pem` (Windows) or `$HOME/.aspnet/https/<package>.pem` (Unix). The `aspnetcore-https` helper script is run as a `prestart` step in `package.json`.
- Testing: Karma + Jasmine (`karma.conf.js`); tests are run via the Angular test builder.

## Key conventions and repo-specific patterns
- Components are generated as standalone and most schematics are configured to skip generating spec files by default — expect some components to have no accompanying `*.spec.ts` unless tests were added manually.
- Cross-platform start uses `run-script-os` with `start:windows` and `start:default` entries in `package.json`.
- Proxy configuration picks up ASP.NET Core environment variables: `ASPNETCORE_HTTPS_PORT` or `ASPNETCORE_URLS` (see `src/proxy.conf.js`). When running locally, ensure the backend's HTTPS port/env is set so API calls proxy correctly.
- Tailwind is wired via `@tailwindcss/postcss` and project-specific PostCSS/Vite integrations; most styling lives in SCSS but relies on Tailwind utilities.
- Prettier is configured in `package.json` (printWidth: 100, singleQuote: true). HTML files use the Angular parser.
- No repository-level ESLint script; prefer running ESLint directly with `npx eslint` or add a project `lint` script if desired.

## Files checked while preparing this guidance
- `emc.client/package.json` — scripts and deps
- `emc.client/angular.json` — project structure, ports, proxy and architect targets
- `emc.client/src/proxy.conf.js` — backend proxy rules
- `emc.client/README.md` — development instructions

## AI assistant / rules files
- No assistant-specific rule files detected at repo root (checked for CLAUDE.md, .cursorrules, .cursor/, AGENTS.md, .windsurfrules, CONVENTIONS.md, AIDER_CONVENTIONS.md, .clinerules, .cline_rules). If such files exist in other subfolders, consider copying essential guidance into this Copilot file.

---

If anything here should be expanded (for example, add exact npm scripts for lint, or include backend project notes), say which area to expand and I will update the file.
