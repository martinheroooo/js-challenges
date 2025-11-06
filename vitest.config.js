import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.{test,spec}.{js,mjs,ts}'],
    exclude: ['node_modules', 'dist', '.cache'],
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 10000,
    reporter: ['verbose'],
  },
});