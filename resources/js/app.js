import '../css/app.css'
import './bootstrap'

import AppLayout from '@/layouts/AppLayout.vue'
import { createInertiaApp, Head, Link } from '@inertiajs/vue3'
import * as Sentry from '@sentry/vue'
import { createApp, h } from 'vue'
import { ZiggyVue } from 'ziggy-js'

const appName = import.meta.env.VITE_APP_NAME || 'Vilt starter kit | Devuni'

createInertiaApp(
    {
        title: (title) => (title ? `${title} - ${appName}` : appName),

        resolve: (name) => {
            const pages = import.meta.glob('./pages/**/*.vue', { eager: true })
            let page = pages[`./pages/${name}.vue`]
            page.default.layout = AppLayout
            return page
        },

        setup({ el, App, props, plugin }) {
            const app = createApp({ render: () => h(App, props) })
                .use(plugin)
                .use(ZiggyVue)
                .component('Head', Head)
                .component('Link', Link)

            Sentry.init({
                app,
                dsn: import.meta.env.VITE_SENTRY_DSN,
                tracesSampleRate: 1.0,
                environment: import.meta.env.VITE_APP_ENV,
            })

            return app.mount(el)
        },
        progress: {
            color: '#4B5563',
        },
    },
    {
        cluster: true,
    }
)
