import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // veya 'prompt'
      devOptions: {
        enabled: true // Geliştirme sırasında service worker'ı etkinleştir
      },

      includeAssets: ['favicon.svg', 'safari-pinned-tab.svg', 'apple-touch-icon.png', 'robots.txt'],


      manifest: {
        name: 'Watchlist Together',
        short_name: 'Watchlist',
        description: 'Arkadaşlarınızla ortak film/dizi watchlist\'i oluşturun',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'src/assets/pwa-192x192.png', // 192x192 ikon dosyanız
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'src/assets/pwa-512x512.png', // 512x512 ikon dosyanız
            sizes: '512x512',
            type: 'image/png'
          }
          // Diğer ikon boyutları...
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
