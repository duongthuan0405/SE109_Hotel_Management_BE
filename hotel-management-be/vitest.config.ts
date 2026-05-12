import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
  test: {
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/checkout_cascade.test.ts',
      '**/invoice.test.ts',
      '**/rentalReceipt.test.ts',
      '**/serviceUsage.test.ts'
    ],
    // environment: 'node',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
