import AppLayout from '@/layouts/AppLayout.vue'
import { createInertiaApp, Head, Link } from '@inertiajs/vue3'
import createServer from '@inertiajs/vue3/server'
import * as Sentry from '@sentry/vue'
import { renderToString } from '@vue/server-renderer'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { createSSRApp, h } from 'vue'

const appName = import.meta.env.VITE_APP_NAME || 'Vilt starter kit | Devuni'
const ssrPort = parseInt(import.meta.env.VITE_INERTIA_SSR_PORT) || 13701

createServer(
    (page) =>
        createInertiaApp({
            page,
            render: renderToString,
            title: (title) => (title ? `${title} - ${appName}` : appName),
            resolve: async (name) => {
                const page = await resolvePageComponent(`./pages/${name}.vue`, import.meta.glob('./pages/**/*.vue'))

                page.default.layout = name.startsWith('Auth/') ? null : AppLayout

                return page
            },
            setup({ App, props, plugin }) {
                const app = createSSRApp({ render: () => h(App, props) })
                    .use(plugin)
                    .component('Link', Link)
                    .component('Head', Head)

                Sentry.init({
                    app,
                    dsn: import.meta.env.VITE_SENTRY_DSN,
                    tracesSampleRate: 1.0,
                    environment: import.meta.env.VITE_APP_ENV,
                })

                return app
            },
            progress: {
                color: '#4B5563',
            },
        }),
    {
        cluster: true,
        port: ssrPort,
    }
)
