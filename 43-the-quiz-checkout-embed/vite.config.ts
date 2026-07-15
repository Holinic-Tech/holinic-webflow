/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base is overridden per-quiz at build time, e.g. --base=/20-the-quiz-haircare/
export default defineConfig({
  plugins: [react()],
  base: './',
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.ts',
    // Only *.test.* are test suites; *.spec.ts files are quiz-spec fixtures, not tests.
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
