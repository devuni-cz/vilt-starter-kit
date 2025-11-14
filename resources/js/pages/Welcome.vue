<script setup>
import { ref } from 'vue'
import { ArrowDownRightIcon } from '@heroicons/vue/24/outline'

const options = [
    { label: 'Laravel', value: 'laravel' },
    { label: 'Inertia', value: 'inertia' },
    { label: 'Vue', value: 'vue' },
    { label: 'TailwindCSS', value: 'tailwindcss' },
]

const selectedOption = ref(options[0].value)

const contentData = {
    laravel: [
        {
            id: 'laravel',
            text: 'laravel 12.x',
            href: 'https://laravel.com/',
        },
        {
            id: 'sentry-laravel',
            text: 'Sentry/sentry-laravel',
            href: 'https://github.com/getsentry/sentry-laravel',
        },
        {
            id: 'larastan',
            text: 'larastan/larastan',
            href: 'https://github.com/larastan/larastan',
        },
        {
            id: 'pest',
            text: 'pestphp/pest',
            href: 'https://github.com/pestphp/pest',
        },
        {
            id: 'rector',
            text: 'rectorphp/rector',
            href: 'https://github.com/rectorphp/rector',
        },
    ],

    inertia: [
        {
            id: 'inertia',
            text: 'Inertia 2.x',
            href: 'https://inertiajs.com/',
        },
        {
            id: 'ssr',
            text: 'SSR',
            href: 'https://inertiajs.com/server-side-setup',
        },
        {
            id: 'persistant-layout',
            text: 'Persistant Layout',
            href: 'https://inertiajs.com/pages#persistent-layouts',
        },
        {
            id: 'laravel-wayfinder',
            text: 'Laravel/Wayfinder',
            href: 'https://github.com/laravel/wayfinder',
        },
        {
            id: 'components',
            text: 'Globally registered components <br q/><span class="text-xs font-bold"> Link </span>, <span class="text-xs font-bold"> Head </span>',
        },
    ],

    vue: [
        {
            id: 'vue',
            text: 'Vue 3.x',
            href: 'https://vuejs.org/',
        },
        {
            id: 'eslint',
            text: 'ESLint',
            href: 'https://eslint.org/',
        },
        {
            id: 'unused-imports',
            text: 'eslint-plugin-unused-imports',
            href: 'https://github.com/sweepline/eslint-plugin-unused-imports',
        },
        {
            id: 'eslint-vue',
            text: 'eslint-plugin-vue',
            href: 'https://github.com/vuejs/eslint-plugin-vue',
        },
        {
            id: 'husky',
            text: 'husky',
            href: 'https://github.com/typicode/husky',
        },
        {
            id: 'lint-staged',
            text: 'lint-staged',
            href: 'https://github.com/lint-staged/lint-staged',
        },
        {
            id: 'prettier',
            text: 'prettier',
            href: 'https://github.com/prettier/prettier',
        },
        {
            id: 'vite',
            text: 'vite 7.x',
            href: 'https://github.com/vitejs/vite',
        },
        {
            id: 'sentry-js',
            text: 'sentry-javascript',
            href: 'https://github.com/getsentry/sentry-javascript',
        },
        {
            id: 'sentry-bundler',
            text: 'sentry-javascript-bundler-plugins',
            href: 'https://github.com/getsentry/sentry-javascript-bundler-plugins',
        },
        {
            id: 'sentry-vue',
            text: 'sentry-vue',
            href: 'https://github.com/getsentry/sentry-vue',
        },
    ],

    tailwindcss: [
        {
            id: 'tailwind',
            text: 'Tailwind CSS 4.x',
            href: 'https://tailwindcss.com/',
        },
        {
            id: 'heroicons',
            text: 'heroicons',
            href: 'https://github.com/tailwindlabs/heroicons',
        },
        {
            id: 'prettier-tailwind',
            text: 'prettier-plugin-tailwindcss',
            href: 'https://github.com/tailwindlabs/prettier-plugin-tailwindcss',
        },
    ],
}

const getContentForOption = (option) => {
    return contentData[option] || []
}
</script>

<template>
    <div class="relative flex min-h-screen flex-col items-center justify-center bg-white text-[#1b1b18]">
        <main
            class="flex w-full max-w-[335px] flex-col overflow-hidden rounded-lg px-2 lg:h-[60vh] lg:max-w-4xl lg:flex-row"
        >
            <div
                class="flex-1 rounded-t-lg bg-white p-6 pb-12 shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-t-none lg:rounded-l-lg lg:p-16 lg:shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)]"
            >
                <h1 class="mb-1 font-medium">Starter kit for VILT</h1>

                <p class="mb-2 text-[13px] leading-[20px] text-gray-400">
                    We are happy to introduce you to the starter kit for
                    <strong class="text-sky-500">Laravel</strong> with <strong class="text-sky-500">Inertia</strong> and
                    <strong class="text-sky-500">Vue</strong> with <strong class="text-sky-500">TailwindCSS</strong>.
                </p>

                <ul class="mb-4 flex flex-col lg:mb-6">
                    <li
                        class="relative flex cursor-pointer items-center gap-4 py-2"
                        :class="[
                            option.value !== options[options.length - 1].value
                                ? 'before:absolute before:top-1/2 before:bottom-0 before:left-[0.4rem] before:translate-y-1/2 before:border-l before:border-gray-200'
                                : '',
                            selectedOption === option.value ? 'font-semibold text-sky-500' : 'text-gray-400',
                        ]"
                        v-for="option in options"
                        :key="option.value"
                        @click="selectedOption = option.value"
                    >
                        <span class="relative bg-white py-1">
                            <span
                                class="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-gray-200 bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)]"
                            >
                                <span
                                    :class="[
                                        selectedOption === option.value ? 'bg-sky-500' : 'bg-gray-200',
                                        'h-1.5 w-1.5 rounded-full',
                                    ]"
                                />
                                <!-- <span :class="{
                                        'bg-sky-500': selectedOption === option.value,
                                        'bg-transparent': selectedOption !== option.value,
                                    }, 'h-1.5 w-1.5 rounded-full '"></span> -->
                            </span>
                        </span>

                        <span>
                            {{ option.label }}
                        </span>
                    </li>
                </ul>
            </div>

            <div
                class="relative -mb-px aspect-335/376 w-full shrink-0 overflow-hidden bg-gradient-to-br from-sky-100 to-purple-100 backdrop-blur lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-[438px] lg:rounded-t-none lg:rounded-r-lg"
            >
                <div class="absolute inset-0 z-10 flex items-center justify-center p-6 text-center">
                    <ul class="flex flex-col items-center gap-3 text-sm text-gray-400">
                        <li
                            v-for="(item, index) in getContentForOption(selectedOption)"
                            :key="selectedOption + '-' + index"
                            class="group text-md transform items-center font-semibold opacity-100 transition-all delay-100 duration-500 starting:opacity-0"
                        >
                            <div
                                v-if="item.href"
                                class="inline-flex"
                            >
                                <span
                                    class="relative right-2 hidden rounded-full bg-sky-700 p-1 opacity-0 transition-opacity duration-150 ease-linear group-hover:opacity-100 lg:block"
                                >
                                    <ArrowDownRightIcon
                                        class="size-4 text-white transition-transform delay-200 group-hover:-rotate-45"
                                    />
                                </span>

                                <a
                                    :href="item.href"
                                    target="_blank"
                                    v-html="item.text"
                                    class="text-black hover:underline"
                                />
                            </div>

                            <span
                                v-else
                                v-html="item.text"
                                class=""
                            />
                        </li>
                    </ul>
                </div>

                <div class="absolute bottom-1/2 left-1/2 block -translate-x-1/2 translate-y-1/2 opacity-20 blur-[10px]">
                    <img
                        v-if="selectedOption === 'laravel'"
                        src="/images/laravel.webp"
                        loading="lazy"
                        alt="Laravel"
                        class="size-48 object-contain"
                    />

                    <img
                        v-else-if="selectedOption === 'vue'"
                        src="/images/vuejs.webp"
                        loading="lazy"
                        alt="Vue.js"
                        class="size-48 object-contain"
                    />

                    <img
                        v-else-if="selectedOption === 'inertia'"
                        src="/images/inertiajs.webp"
                        loading="lazy"
                        alt="Inertia.js"
                        class="size-48 object-contain"
                    />

                    <img
                        v-else
                        src="/images/tailwindcss.webp"
                        loading="lazy"
                        alt="Tailwind CSS"
                        class="size-48 object-contain"
                    />
                </div>

                <div
                    class="absolute inset-0 rounded-b-lg shadow-[inset_0px_-1px_0px_1px_rgba(26,26,0,0.16)] lg:overflow-hidden lg:rounded-r-lg lg:rounded-bl-none lg:shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)]"
                />
            </div>
        </main>
    </div>
</template>

<style scoped>
@keyframes flowIn {
    0% {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
    }

    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease;
}

.fade-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.fade-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}
</style>
