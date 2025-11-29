import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import vercel from '@astrojs/vercel/serverless'

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  // Koristimo server output sa Vercel adapterom za deployment
  output: 'server',
  adapter: vercel(),
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

