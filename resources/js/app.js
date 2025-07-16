import { createApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/inertia-vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ZiggyVue  } from 'ziggy-js';
import { Ziggy } from './ziggy';
import * as Sentry from '@sentry/vue';

createInertiaApp({
  resolve: name => resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob('./Pages/**/*.vue')),
  setup({ el, App, props, plugin }) {
    const app = createApp({ render: () => h(App, props) });
    app.use(plugin)
      .use(ZiggyVue, Ziggy);

    Sentry.init({
        app,
        dsn: import.meta.env.VITE_SENTRY_DSN,
        tracesSampleRate: 1.0,
        environment: import.meta.env.VITE_APP_ENV,
    });

    return app.mount(el);
  },
});