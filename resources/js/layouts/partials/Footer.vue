<script setup>
import { GlobeAltIcon, CameraIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

const show_logo = ref(false)
</script>

<template>
    <footer class="fixed bottom-5 w-full">
        <div class="mx-auto flex w-full flex-col items-center justify-center xl:max-w-lg">
            <div
                class="relative flex w-full max-w-[25rem] items-center justify-center md:max-w-[20rem] md:justify-start"
            >
                <div
                    class="z-50 mx-auto overflow-hidden rounded-xl border border-sky-200 bg-sky-500/10"
                    v-on:mouseleave="show_logo = false"
                >
                    <div
                        @click="show_logo = true"
                        v-on:mouseover="show_logo = true"
                        class="relative overflow-hidden rounded-full p-2"
                    >
                        <a
                            href="https://devuni.cz/"
                            target="_blank"
                            rel="noopener external"
                            title="Web developers - Devuni"
                            aria-label="Visit Devuni website"
                            class="absolute inset-0 hidden rounded-full lg:block"
                        />
                        <picture>
                            <source
                                srcset="https://ludwigtomas.cz/source/partners/footer/tomas_ludwig-footer-logo.webp"
                                type="image/webp"
                            />
                            <img
                                class="size-8 xl:size-10"
                                src="https://ludwigtomas.cz/source/partners/footer/tomas_ludwig-footer-logo.png"
                                alt="Tomáš Ludwig - profesionální webový vývojář a programátor"
                                loading="lazy"
                                width="40"
                                height="40"
                            />
                        </picture>
                    </div>

                    <Transition name="fade">
                        <div
                            v-if="show_logo"
                            class="absolute bottom-0 left-0 w-full overflow-hidden rounded-xl bg-gray-900 shadow-lg shadow-neutral-950"
                            role="dialog"
                            aria-labelledby="developer-info"
                        >
                            <div class="bg-gradient-to-br from-sky-500/40 via-zinc-800 to-zinc-900 px-5 py-4">
                                <div
                                    class="absolute inset-0 bg-sky-400/5 [mask-image:linear-gradient(to_bottom_right,blue,transparent,transparent)] text-sky-500"
                                >
                                    <svg
                                        class="absolute hidden h-full w-full lg:block"
                                        xmlns="http://www.w3.org/2000/svg"
                                        aria-hidden="true"
                                    >
                                        <defs>
                                            <pattern
                                                id="grid-bg"
                                                width="40"
                                                height="40"
                                                patternUnits="userSpaceOnUse"
                                                x="100%"
                                                patternTransform="translate(0 -1)"
                                            >
                                                <path
                                                    d="M0 40V.5H40"
                                                    fill="none"
                                                    stroke="currentColor"
                                                />
                                            </pattern>
                                        </defs>
                                        <rect
                                            width="100%"
                                            height="100%"
                                            fill="url(#grid-bg)"
                                        />
                                    </svg>
                                </div>

                                <div class="relative flex flex-col items-center justify-center">
                                    <h3
                                        id="developer-info"
                                        class="text-sm text-gray-100 uppercase"
                                    >
                                        Starter Kit by
                                    </h3>

                                    <p class="font-robotoSlab text-lg font-extrabold tracking-wide text-white">
                                        Devuni
                                    </p>

                                    <div class="py-4 md:py-6">
                                        <a
                                            href="https://devuni.cz/"
                                            target="_blank"
                                            rel="noopener external"
                                            title="Web developers - Devuni"
                                            aria-label="Visit Devuni website"
                                        >
                                            <picture>
                                                <source
                                                    srcset="
                                                        https://ludwigtomas.cz/source/partners/footer/tomas_ludwig-footer-logo.webp
                                                    "
                                                    type="image/webp"
                                                />
                                                <img
                                                    class="size-16 xl:size-20"
                                                    src="https://ludwigtomas.cz/source/partners/footer/Tomas_Ludwig-modal-logo.webp"
                                                    alt="Devuni - developers"
                                                    loading="lazy"
                                                    width="80"
                                                    height="80"
                                                />
                                            </picture>
                                        </a>
                                    </div>

                                    <nav
                                        class="relative grid grid-cols-12 gap-x-5"
                                        aria-label="Odkazy na portfolio a sociální sítě Tomáše Ludwiga"
                                    >
                                        <a
                                            href="https://devuni.cz/"
                                            target="_blank"
                                            class="group col-span-4 flex flex-col items-center"
                                            rel="noopener external"
                                            title="Web developers - Devuni"
                                            aria-label="Visit Devuni website"
                                        >
                                            <GlobeAltIcon
                                                class="size-8 text-gray-400 transition-all delay-200 duration-100 ease-linear group-hover:text-sky-300 xl:size-10"
                                                aria-hidden="true"
                                            />

                                            <span
                                                class="font-bold tracking-wider text-gray-400 transition-all delay-200 duration-100 ease-linear group-hover:text-sky-500"
                                            >
                                                Portfolio
                                            </span>
                                        </a>

                                        <a
                                            class="group col-span-4 flex flex-col items-center"
                                            target="_blank"
                                            href="https://www.instagram.com/dev_ludwigtomas/"
                                            rel="external noopener noreferrer nofollow"
                                            aria-label="Navštívit Instagram Tomáše Ludwiga"
                                        >
                                            <CameraIcon
                                                class="size-8 text-gray-400 transition-all delay-200 duration-100 ease-linear group-hover:text-orange-300 xl:size-10"
                                                aria-hidden="true"
                                            />

                                            <span
                                                class="font-bold tracking-wider text-gray-400 transition-all delay-200 duration-100 ease-linear group-hover:text-orange-500"
                                            >
                                                Instagram
                                            </span>
                                        </a>

                                        <button
                                            class="group col-span-4 flex flex-col items-center"
                                            @click="show_logo = false"
                                            aria-label="Zavřít informace o Tomáši Ludwigovi"
                                        >
                                            <XMarkIcon
                                                class="size-8 text-gray-400 transition-all delay-200 duration-100 ease-linear group-hover:text-red-300 xl:size-10"
                                                aria-hidden="true"
                                            />

                                            <span
                                                class="font-bold tracking-wider text-gray-400 transition-all delay-200 duration-100 ease-linear group-hover:text-red-500"
                                            >
                                                Zavřít
                                            </span>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>
    </footer>
</template>

<style scoped>
.fade-enter-active {
    animation: bounce-in 0.5s;
}

.fade-leave-active {
    animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
    0% {
        transform: scale(0);
    }

    50% {
        transform: scale(1.25);
    }

    100% {
        transform: scale(1);
    }
}
</style>
