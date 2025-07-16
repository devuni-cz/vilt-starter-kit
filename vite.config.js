import { defineConfig } from 'vite';
import { sentryVitePlugin } from '@sentry/vite-plugin'
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue'; 
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.js'],
      ssr: 'resources/js/ssr.js',
      refresh: true,
    }),
    vue(),
    tailwindcss(),
    sentryVitePlugin({
        org: 'devuni',
        project: 'template-cz',
        url: 'https://sentry.devuni.cz/',
    }),

  ],
});