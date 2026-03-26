import inertia from '@inertiajs/vite'
import { wayfinder } from '@laravel/vite-plugin-wayfinder'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import laravel from 'laravel-vite-plugin'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ command, mode, isSsrBuild }) => {
    const env = loadEnv(mode, process.cwd(), '')

    return {
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'resources/js'),
            },
        },
        plugins: [
            laravel({
                input: 'resources/js/app.js',
                refresh: true,
            }),
            inertia({
                ssr: {
                    port: parseInt(env.VITE_INERTIA_SSR_PORT) || 13701,
                    cluster: true,
                },
            }),
            vue({
                template: {
                    transformAssetUrls: {
                        base: null,
                        includeAbsolute: false,
                    },
                },
            }),
            wayfinder({
                formVariants: true,
            }),
            tailwindcss(),
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
        | Only apply manual chunks for client builds, not SSR builds.
        |--------------------------------------------------------------------------
        */
            rollupOptions: {
                output: {
                    // Only use manual chunks for client builds, not SSR
                    ...(isSsrBuild
                        ? {}
                        : {
                              manualChunks: (id) => {
                                  if (
                                      id.includes('vue') ||
                                      id.includes('@inertiajs/vue3') ||
                                      id.includes('@vue/server-renderer')
                                  ) {
                                      return 'vue'
                                  }
                                  if (id.includes('@sentry/vue') || id.includes('@sentry/tracing')) {
                                      return 'sentry'
                                  }
                              },
                          }),
                },
            },
            chunkSizeWarningLimit: 1000, // Increase warning limit to 1000kb
        },
    }
})
