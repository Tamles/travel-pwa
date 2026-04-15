# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

Vanilla JS + Vite + `vite-plugin-pwa` (Workbox under the hood). No framework, no TypeScript, no test runner wired up yet. Node 24 / npm 11 in dev.

## Commands

- `npm run dev` — Vite dev server. PWA is enabled in dev (`devOptions.enabled: true` in `vite.config.js`), so the service worker and manifest are served during development.
- `npm run build` — Production build to `dist/`. Emits `manifest.webmanifest`, `sw.js`, and a workbox runtime chunk alongside hashed JS/CSS.
- `npm run preview` — Serve the built `dist/` over HTTP to verify installability (the `beforeinstallprompt` path only fires on a served origin, not `file://`).

## Architecture

- `index.html` is the Vite entry. Single `<main class="home">` block plus an `#install-btn` hidden by default.
- `src/main.js` owns two concerns:
  1. **SW registration** via `registerSW` from the virtual `virtual:pwa-register` module (provided by `vite-plugin-pwa`). Uses `autoUpdate` — new SW versions take over without a prompt.
  2. **Install UX** — listens for `beforeinstallprompt`, stashes the event, reveals the button, then calls `deferredPrompt.prompt()` on click. Also detects standalone display mode and reacts to `appinstalled`.
- `vite.config.js` is the source of truth for the web app manifest (name, theme, icons). Change the manifest there, not in a separate JSON file — `vite-plugin-pwa` generates `manifest.webmanifest` from this config at build time.

## PWA icons

Icons live in `public/` and are referenced by the manifest in `vite.config.js`:

- `favicon.svg` — source of truth. Edit this when changing the brand mark.
- `pwa-192x192.png`, `pwa-512x512.png`, `pwa-512x512-maskable.png` — generated from the SVG with ImageMagick. Regenerate after editing the SVG:

  ```bash
  convert -background none -density 512 public/favicon.svg -resize 192x192 public/pwa-192x192.png
  convert -background none -density 512 public/favicon.svg -resize 512x512 public/pwa-512x512.png
  convert -background "#0f172a" -density 512 public/favicon.svg -resize 384x384 -gravity center -extent 512x512 public/pwa-512x512-maskable.png
  ```

  The maskable variant intentionally pads the glyph to ~75% so Android's safe-zone crop doesn't eat the logo.

## Verifying installability

Chrome's install prompt needs: HTTPS (or localhost), a registered SW, a manifest with name + icons + `start_url` + `display: standalone`. After `npm run build && npm run preview`, open DevTools → Application → Manifest and Service Workers to confirm, or use Lighthouse's PWA audit.
