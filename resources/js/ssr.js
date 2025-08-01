import { createInertiaApp, Head, Link } from '@inertiajs/vue3'
import createServer from '@inertiajs/vue3/server'
import { renderToString } from '@vue/server-renderer'
import { createSSRApp, h } from 'vue'
import { ZiggyVue } from 'ziggy-js'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import * as Sentry from '@sentry/vue'

const appName = import.meta.env.VITE_APP_NAME || 'Vilt starter kit | Devuni'

createServer(
    (page) =>
        createInertiaApp({
            page,
            render: renderToString,
            title: (title) => `${title} - ${appName}`,
            resolve: (name) => resolvePageComponent(`./pages/${name}.vue`, import.meta.glob('./pages/**/*.vue')),
            setup({ App, props, plugin }) {
                const app = createSSRApp({ render: () => h(App, props) })
                    .use(plugin)
                    .component('Link', Link)
                    .component('Head', Head)
                    .use(ZiggyVue, {
                        ...page.props.ziggy,
                        location: new URL(page.props.ziggy.location),
                    })

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
    }
)
