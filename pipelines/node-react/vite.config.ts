import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Forward API calls to the pharmacy backend (tWAS or Liberty)
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:9080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/simple-pharmacy'),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      thresholds: {
        lines: 30,
        functions: 30,
        branches: 30,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
