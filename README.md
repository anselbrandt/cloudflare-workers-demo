# Cloudflare Workers Demo

A React + TypeScript + Vite app with a Cloudflare Worker backend, deployed with the [`cf` CLI](https://www.npmjs.com/package/cf).

**Live:** https://openbordersfoundation.com (also https://www.openbordersfoundation.com)

## Routes

| Path | Served by | Response |
|---|---|---|
| `/api/*` | Worker (`worker/index.ts`) | JSON: `{"name":"Cloudflare"}` |
| `/`, and any other page path | Static assets (Vite build) | `index.html`; unknown paths fall back to the app (single-page app) |
| Other non-asset requests | Worker | `404` |

The "Name from API" button in `src/App.tsx` calls `/api/`.

## Configuration

Everything is configured in `cloudflare.config.ts`, which replaces `wrangler.jsonc`:

```ts
worker: {
  name: "cloudflare-workers-demo",
  compatibilityDate: "2026-11-04",
  entrypoint: "./worker/index.ts",
  assets: { notFoundHandling: "single-page-application" },
  domains: ["openbordersfoundation.com", "www.openbordersfoundation.com"],
  observability: { enabled: true },
}
```

`@cloudflare/vite-plugin` (2.x beta) reads this file for both `vite dev` and `vite build`. Worker types are generated into `.cloudflare/types/index.d.ts` (gitignored) and referenced from `tsconfig.worker.json`.

## Scripts

- `npm run dev`: Vite dev server, with the Worker running locally in workerd
- `npm run build`: generate Worker types, typecheck, and build
- `npm run cf-typegen`: regenerate Worker types only (`cf workers types`)
- `npm run deploy`: build and deploy with `cf deploy`

## Deployment

Pushes to `master` build and deploy automatically through Cloudflare Workers Builds, which runs `npx cf deploy` from the repo root. `cf deploy` builds with `vite build` and attaches the custom domains listed in the config.

## Notes

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
