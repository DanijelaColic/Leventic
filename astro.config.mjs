import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  // Koristimo server output za dev mode (adapter može imati probleme s body parsingom u dev mode)
  // U production build-u ćemo koristiti hybrid s adapterom
  output: 'server',
  vite: {
    server: {
      host: true, // Omogući pristup s drugih uređaja
      port: 4321,
      watch: {
        usePolling: false,
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
  },
})

