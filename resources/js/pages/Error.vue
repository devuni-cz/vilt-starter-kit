<script setup>
import { computed } from 'vue'
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline'

const props = defineProps({ status: Number })

const title = computed(() => {
    return {
        503: '503: Service Unavailable',
        500: '500: Server Error',
        404: '404: Page Not Found',
        403: '403: Forbidden',
    }[props.status]
})

const description = computed(() => {
    return {
        503: 'Sorry, we are doing some maintenance. Please check back soon.',
        500: 'Whoops, something went wrong on our servers.',
        404: 'Sorry, the page you are looking for could not be found.',
        403: 'Sorry, you are forbidden from accessing this page.',
    }[props.status]
})
</script>

<template>
    <section class="bg-white">
        <div class="container mx-auto flex min-h-screen items-center px-6 py-12">
            <div class="mx-auto flex max-w-sm flex-col items-center text-center">
                <p class="rounded-full bg-blue-50 p-3 text-sm font-medium text-blue-500">
                    <ExclamationCircleIcon class="size-6" />
                </p>
                <h1 class="mt-3 text-2xl font-semibold text-gray-800 md:text-3xl">
                    {{ title }}
                </h1>
                <p class="mt-4 text-gray-500">
                    {{ description }}
                </p>

                <div class="mt-6 flex w-full shrink-0 items-center gap-x-3 sm:w-auto">
                    <Link
                        class="w-1/2 shrink-0 rounded-lg bg-blue-500 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 hover:bg-blue-600 sm:w-auto"
                        aria-label="Back to home"
                        :href="route('welcome')"
                    >
                        Back to home
                    </Link>
                </div>
            </div>
        </div>
    </section>
</template>
