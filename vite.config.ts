import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Use port 3000 instead of 5173
    host: true,
    hmr: {
      // For StackBlitz
      clientPort: 443
    },
    proxy: {
      '/api/anthropic': {
        target: 'https://api.anthropic.com/v1/messages',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/anthropic/, ''),
        headers: {
          'anthropic-version': '2023-06-01'
        }
      }
    }
  },
  // StackBlitz specific optimizations
  optimizeDeps: {
    exclude: ['fsevents']
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
})
