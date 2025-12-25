import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Plugin to make CSS non-blocking for better FCP
const nonBlockingCss = () => ({
  name: 'non-blocking-css',
  transformIndexHtml(html) {
    return html.replace(
      /<link rel="stylesheet"([^>]*?)>/g,
      '<link rel="stylesheet"$1 media="print" onload="this.media=\'all\'">'
    )
  }
})

export default defineConfig({
  plugins: [react(), nonBlockingCss()],
  build: {
    outDir: 'dist',
    // Remove console.log/error in production for better performance and smaller bundles
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - split large libraries
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          // Heavy admin-only dependency
          'vendor-quill': ['react-quill']
        }
      }
    }
  }
})
