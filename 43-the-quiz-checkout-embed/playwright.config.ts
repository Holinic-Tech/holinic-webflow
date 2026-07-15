import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './e2e',
  // Reduced motion under e2e is emulated per-spec via `page.emulateMedia({
  // reducedMotion: 'reduce' })` (see e2e/*.spec.ts) — it collapses the
  // register-then-advance delay to 0 (instant advance, preserving the existing
  // deterministic walk timing), pauses carousel autoplay, and renders
  // framer-motion transitions at final state so snapshots stay stable.
  // See src/components/layout/motion.ts.
  use: { baseURL: 'http://localhost:5173' },
  webServer: { command: 'npm run dev', url: 'http://localhost:5173', reuseExistingServer: true, timeout: 120000 },
})
