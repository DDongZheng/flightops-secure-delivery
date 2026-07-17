import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],

  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],

    coverage: {
      provider: 'v8',

      reporter: [
        'text',
        'html',
        'lcov',
      ],

      include: [
        'src/**/*.{ts,tsx}',
      ],

      exclude: [
        'src/main.tsx',
        'src/**/*.d.ts',
        'src/data/**',
        'src/test/**',
        'src/types/**',
      ],

      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
})