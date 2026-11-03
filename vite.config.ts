import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Standard Vite + React setup. `base` is './' only if you deploy to a sub-folder;
// leave as '/' for normal hosting (Netlify, Vercel, Cloudflare Pages, a domain root).
export default defineConfig({
  plugins: [react()],
});
