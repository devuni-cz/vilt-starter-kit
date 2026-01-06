<script setup>
import {
    ExclamationTriangleIcon,
    HomeIcon,
    LockClosedIcon,
    MagnifyingGlassIcon,
    WrenchScrewdriverIcon,
} from '@heroicons/vue/24/outline'
import { computed } from 'vue'

const props = defineProps({
    status: Number,
    message: {
        type: String,
        default: null,
    },
})

const title = computed(() => {
    return {
        503: 'Služba nedostupná',
        500: 'Chyba serveru',
        404: 'Stránka nenalezena',
        403: 'Přístup odepřen',
    }[props.status]
})

const description = computed(() => {
    return {
        503: 'Omlouváme se, právě provádíme údržbu. Zkuste to prosím později.',
        500: 'Omlouváme se, na serveru došlo k neočekávané chybě.',
        404: 'Omlouváme se, stránka kterou hledáte nebyla nalezena.',
        403: 'Omlouváme se, nemáte oprávnění k přístupu na tuto stránku.',
    }[props.status]
})

const iconComponent = computed(() => {
    return {
        503: WrenchScrewdriverIcon,
        500: ExclamationTriangleIcon,
        404: MagnifyingGlassIcon,
        403: LockClosedIcon,
    }[props.status]
})

const iconColor = computed(() => {
    return {
        503: 'text-yellow-500',
        500: 'text-red-500',
        404: 'text-blue-500',
        403: 'text-orange-500',
    }[props.status]
})
</script>

<template>
    <Head :title="`${status} - ${title}`" />

    <div class="flex min-h-screen flex-col items-center justify-center px-4">
        <div class="w-full max-w-md overflow-hidden rounded-lg bg-white px-8 py-12 text-center shadow-lg">
            <div class="mb-6 flex justify-center">
                <component
                    :is="iconComponent"
                    class="size-20 animate-pulse"
                    :class="iconColor"
                />
            </div>

            <h1 class="mb-2 text-6xl font-bold text-gray-800">
                {{ status }}
            </h1>

            <h2 class="mb-4 text-xl font-semibold text-gray-700">
                {{ title }}
            </h2>

            <p class="mb-8 text-gray-500">
                {{ description }}
            </p>

            <div
                v-if="message"
                class="mb-8 rounded-lg bg-gray-100 p-4 text-left"
            >
                <p class="text-xs font-medium text-gray-500">Detail:</p>
                <pre class="mt-1 max-h-40 overflow-auto text-sm wrap-break-word whitespace-pre-wrap text-gray-700">{{
                    message
                }}</pre>
            </div>

            <div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                    href="/"
                    class="inline-flex items-center justify-center rounded-lg bg-green-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
                >
                    <HomeIcon class="mr-2 size-4" />
                    Back to Home
                </Link>
            </div>
        </div>

        <p class="mt-8 text-sm text-gray-400">error page {{ status }}</p>
    </div>
</template>
