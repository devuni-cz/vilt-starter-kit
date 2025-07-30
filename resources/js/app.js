import '../css/app.css'
import './bootstrap'

import { createApp, h } from 'vue'
import { createInertiaApp, Head, Link } from '@inertiajs/vue3'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import * as Sentry from '@sentry/vue'
import { ZiggyVue } from 'ziggy-js'

createInertiaApp({
    resolve: (name) => resolvePageComponent(`./pages/${name}.vue`, import.meta.glob('./pages/**/*.vue')),
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
})
