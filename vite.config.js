import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // the résumé API only runs on the server (server/resume-api); in dev,
    // borrow the live one. It accepts only the site's own Origin.
    proxy: {
      '/api': {
        target: 'https://automatlog.in',
        changeOrigin: true,
        headers: { origin: 'https://automatlog.in' },
      },
    },
  },
})
