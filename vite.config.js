import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion'],
        },
      },
    },
    assetsInlineLimit: 8192,
    minify: 'esbuild',
    target: ['es2015', 'chrome79', 'safari13'],
  },
})