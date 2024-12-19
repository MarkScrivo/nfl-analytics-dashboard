import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    hmr: {
      clientPort: 443
    },
    proxy: {
      '/api/anthropic': {
        target: 'https://api.anthropic.com/v1/messages',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/anthropic/, ''),
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (_proxyReq, req) => {
            console.log('Sending Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('Received Response:', proxyRes.statusCode, req.url);
          });
        },
        headers: {
          'anthropic-version': '2023-06-01'
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['fsevents']
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'plotly': ['plotly.js'],
          'react-vendor': ['react', 'react-dom']
        }
      }
    }
  }
})
