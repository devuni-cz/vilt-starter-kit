<script setup>
import { RocketLaunchIcon } from '@heroicons/vue/24/solid'
</script>

<template>
    <header class="fixed top-0 left-0 z-50 w-full translate-y-0 opacity-100">
        <div class="group bg-gray-50 py-3 shadow-lg shadow-gray-100">
            <div class="flex items-center justify-center space-x-4 text-green-500">
                <span class="relative left-0 text-sky-500">
                    <RocketLaunchIcon class="animate- size-6" />
                </span>
                <span class="text-sm tracking-wider text-zinc-700 underline-offset-4 group-hover:underline">
                    We are looking for a new job opportunity
                </span>
            </div>

            <a
                class="absolute inset-0"
                aria-label="Open job offers"
                rel="follow"
                target="_blank"
                href="https://devuni.cz/"
            />
        </div>
    </header>
</template>
