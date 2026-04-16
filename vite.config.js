import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  },
  preview: {
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' https://d3js.org https://unpkg.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn-uicons.flaticon.com https://unpkg.com; font-src 'self' https://fonts.gstatic.com https://cdn-uicons.flaticon.com; img-src 'self' data: https: http: w3.org; connect-src 'self' https://api.openweathermap.org https://newsapi.org; frame-ancestors 'none'; object-src 'none';",
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Cross-Origin-Opener-Policy': 'same-origin',
    }
  },
  build: {
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        eventos: resolve(__dirname, 'eventos.html')
      },
      output: {
        manualChunks: {
          leaflet: ['leaflet'],
          d3: ['d3'],
        },
      },
    },
  },
});
