import { defineConfig } from "cf/config"

export default defineConfig({
  worker: {
    name: "cloudflare-workers-demo",
    compatibilityDate: "2026-11-04",
    entrypoint: "./worker/index.ts",
    assets: { notFoundHandling: "single-page-application" },
    domains: ["openbordersfoundation.com", "www.openbordersfoundation.com"],
    observability: { enabled: true },
  },
})
