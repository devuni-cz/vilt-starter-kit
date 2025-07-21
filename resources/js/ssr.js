import { createInertiaApp, Head, Link } from '@inertiajs/vue3'
import createServer from '@inertiajs/vue3/server'
import { renderToString } from '@vue/server-renderer'
import { createSSRApp, h } from 'vue'
import { ZiggyVue } from 'ziggy-js'

const appName = import.meta.env.VITE_APP_NAME || 'Laravel'

createServer((page) =>
    createInertiaApp({
        page,
        render: renderToString,
        title: (title) => `${title} - ${appName}`,
        resolve: (name) => resolvePageComponent(`./pages/${name}.vue`, import.meta.glob('./pages/**/*.vue')),
        setup({ App, props, plugin }) {
            return createSSRApp({ render: () => h(App, props) })
                .use(plugin)
                .component('Link', Link)
                .component('Head', Head)
                .use(ZiggyVue, {
                    ...page.props.ziggy,
                    location: new URL(page.props.ziggy.location),
                })
        },
    })
)

// createServer(
//     (page) =>
//         createInertiaApp({
//             page,
//             render: renderToString,
//             resolve: (name) => {
//                 const pages = import.meta.glob('./Pages/**/*.vue', { eager: true })
//                 const page = pages[`./Pages/${name}.vue`]
//                 return page.default
//             },
//             setup({ App, props, plugin }) {
//                 return createSSRApp({
//                     render: () => h(App, props),
//                 })
//                     .use(plugin)
//                     .component('Head', Head)
//                     .component('Link', Link)
//             },
//         }),
//     { cluster: true }
// )
