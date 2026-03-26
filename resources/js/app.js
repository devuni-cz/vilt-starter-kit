import AppLayout from '@/layouts/AppLayout.vue'
import { createInertiaApp, Head, Link } from '@inertiajs/vue3'
import * as Sentry from '@sentry/vue'

const appName = import.meta.env.VITE_APP_NAME || 'Vilt starter kit | Devuni'

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'Error':
                return null
            default:
                return AppLayout
        }
    },
    withApp(app, { ssr }) {
        app.component('Head', Head).component('Link', Link)

        if (!ssr) {
            Sentry.init({
                app,
                dsn: import.meta.env.VITE_SENTRY_DSN,
                tracesSampleRate: 1.0,
                environment: import.meta.env.VITE_APP_ENV,
            })
        }
    },
    progress: {
        color: '#4B5563',
    },
})
