import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',

      includeAssets: [
        'favicon.svg',
        'favicon.ico',
        'robots.txt',
        'apple-touch-icon.png'
      ],

      manifest: {
        name: 'Meu App PWA',
        short_name: 'MeuApp',
        description: 'Aplicativo em PWA usando Vite + React',
        theme_color: '#0d6efd',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],

        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 50, maxAgeSeconds: 86400 }
            }
          },
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache',
              expiration: { maxEntries: 20 }
            }
          },
          {
            urlPattern: /\.(?:js|css|png|svg|ico|jpg|jpeg)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'asset-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          }
        ],

        // 🔥 ESSENCIAL PARA RECARREGAR OFFLINE
        navigateFallback: '/index.html',

        // 🔥 Autoriza quais rotas SPA podem receber fallback
        navigateFallbackAllowlist: [/^\/$/ , /^\/.*/]
      }
    })
  ],

  // 🔥 Garante fallback no ambiente DEV também
  server: {
    fs: {
      cachedChecks: false
    },
    watch: {
      ignored: ['**/dist/**']
    }
  }
})
