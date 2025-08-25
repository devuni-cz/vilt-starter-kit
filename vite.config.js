import { sentryVitePlugin } from '@sentry/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import laravel from 'laravel-vite-plugin'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    resolve: {
        alias: {
            'ziggy-js': path.resolve('vendor/tightenco/ziggy'),
        },
    },
    plugins: [
        tailwindcss(),
        laravel({
            input: 'resources/js/app.js',
            ssr: 'resources/js/ssr.js',
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        sentryVitePlugin({
            org: 'devuni',
            project: 'template-cz',
            url: 'https://sentry.devuni.cz/',
        }),
    ],

    build: {
        sourcemap: true,

        /*
        |--------------------------------------------------------------------------
        | If some packages are too large, you can manually split them into
        | separate chunks to optimize loading performance.
        |--------------------------------------------------------------------------
        */
        rollupOptions: {
            output: {
                manualChunks: {
                    // Vue core and related packages
                    vue: ['vue', '@inertiajs/vue3', '@vue/server-renderer'],

                    // Laravel/Inertia specific
                    laravel: ['ziggy-js', 'axios'],

                    // Monitoring and error tracking
                    sentry: ['@sentry/vue', '@sentry/tracing'],
                },
            },
        },
        chunkSizeWarningLimit: 1000, // Increase warning limit to 1000kb
    },
})
