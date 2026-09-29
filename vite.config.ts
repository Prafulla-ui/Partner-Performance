import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const root = path.dirname(fileURLToPath(import.meta.url))

const pagesRepo =
  process.env.PAGES_BASE?.replace(/^\/|\/$/g, '') ||
  process.env.GITHUB_REPOSITORY?.split('/')[1] ||
  'Partner-Performance'

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? `/${pagesRepo}/` : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(root, 'src'),
    },
  },
})

