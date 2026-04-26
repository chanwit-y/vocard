import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Vocard - Oxford 3000 Vocabulary',
        short_name: 'Vocard',
        description: 'Learn Oxford 3000 vocabulary with flashcards',
        theme_color: '#FFF7EE',
        background_color: '#FFF7EE',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,json}'],
        // 'development' skips workbox-build's internal terser pass which can
        // hang due to a known terser worker-thread issue. The SW is still
        // small (~10KB) and gzip-served, so the size impact is negligible.
        mode: 'development'
      }
    })
  ]
})
