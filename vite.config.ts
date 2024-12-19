import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    hmr: {
      clientPort: 443
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        serviceWorker: resolve(__dirname, 'src/serviceWorker.ts')
      },
      output: {
        entryFileNames: (assetInfo) => {
          return assetInfo.name === 'serviceWorker' ? 'serviceWorker.js' : 'assets/[name]-[hash].js'
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['fsevents']
  }
})
