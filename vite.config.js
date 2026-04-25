import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'ধান চিকিৎসা | Rice AI Doctor',
        short_name: 'RiceAI',
        description: 'Offline rice disease diagnosis for Bangladeshi farmers',
        theme_color: '#16a34a',
        background_color: '#f0fdf4',
        display: 'standalone',
        icons: [
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        // Increase cache limit to 5 MB to accommodate ONNX models
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
        // Cache all static assets + ONNX models
        globPatterns: ['**/*.{js,css,html,png,svg,jpg,woff2,ttf,onnx,json,wasm}'],
        cleanupOutdatedCaches: true, // Auto-delete old model versions
        runtimeCaching: [
          {
            urlPattern: /.*\.onnx$/,
            handler: 'CacheFirst', // Cache-First: downloads once, serves offline forever
            options: {
              cacheName: 'onnx-models-cache',
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /.*\.wasm$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'wasm-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      }
    })
  ],
  // Ensure WASM files are handled correctly
  optimizeDeps: {
    exclude: ['onnxruntime-web']
  },
  build: {
    // Allow larger chunks for ONNX models
    chunkSizeWarningLimit: 3000
  }
})