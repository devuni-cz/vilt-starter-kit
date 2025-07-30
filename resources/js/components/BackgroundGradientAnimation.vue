<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
    gradientBackgroundStart: { type: String, default: 'rgb(108, 0, 162)' },
    gradientBackgroundEnd: { type: String, default: 'rgb(0, 17, 82)' },
    firstColor: { type: String, default: '18, 113, 255' },
    secondColor: { type: String, default: '221, 74, 255' },
    thirdColor: { type: String, default: '100, 220, 255' },
    fourthColor: { type: String, default: '200, 50, 50' },
    fifthColor: { type: String, default: '180, 180, 50' },
    pointerColor: { type: String, default: '140, 100, 255' },
    size: { type: String, default: '80%' },
    blendingValue: { type: String, default: 'hard-light' },
    interactive: { type: Boolean, default: true },
    containerClassName: { type: String, default: '' },
    className: { type: String, default: '' },
})

const interactiveRef = ref(null)
const curX = ref(0)
const curY = ref(0)
const tgX = ref(0)
const tgY = ref(0)
const isSafari = ref(false)

function handleMouseMove(event) {
    if (!interactiveRef.value) return
    const rect = interactiveRef.value.getBoundingClientRect()
    tgX.value = event.clientX - rect.left
    tgY.value = event.clientY - rect.top
}

function move() {
    if (!interactiveRef.value) return
    curX.value += (tgX.value - curX.value) / 20
    curY.value += (tgY.value - curY.value) / 20
    interactiveRef.value.style.transform = `translate(${Math.round(curX.value)}px, ${Math.round(curY.value)}px)`
    requestAnimationFrame(move)
}

onMounted(() => {
    const root = document.documentElement
    root.style.setProperty('--gradient-background-start', props.gradientBackgroundStart)
    root.style.setProperty('--gradient-background-end', props.gradientBackgroundEnd)
    root.style.setProperty('--first-color', props.firstColor)
    root.style.setProperty('--second-color', props.secondColor)
    root.style.setProperty('--third-color', props.thirdColor)
    root.style.setProperty('--fourth-color', props.fourthColor)
    root.style.setProperty('--fifth-color', props.fifthColor)
    root.style.setProperty('--pointer-color', props.pointerColor)
    root.style.setProperty('--size', props.size)
    root.style.setProperty('--blending-value', props.blendingValue)
    isSafari.value = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    requestAnimationFrame(move)
})
</script>

<template>
    <div :class="['relative overflow-hidden', containerClassName]">
        <svg class="hidden">
            <defs>
                <filter id="blurMe">
                    <feGaussianBlur
                        in="SourceGraphic"
                        stdDeviation="10"
                        result="blur"
                    />
                    <feColorMatrix
                        in="blur"
                        mode="matrix"
                        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                        result="goo"
                    />
                    <feBlend
                        in="SourceGraphic"
                        in2="goo"
                    />
                </filter>
            </defs>
        </svg>
        <div :class="className">
            <slot />
        </div>
        <div
            :class="[
                'gradients-container h-full w-full blur-lg',
                isSafari ? 'blur-2xl' : '[filter:url(#blurMe)_blur(40px)]',
            ]"
        >
            <div
                class="animate-first absolute top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] [transform-origin:center_center] opacity-100 [mix-blend-mode:var(--blending-value)] [background:radial-gradient(circle_at_center,_var(--first-color)_0,_var(--first-color)_50%)_no-repeat]"
            ></div>
            <div
                class="animate-second absolute top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] [transform-origin:calc(50%-400px)] opacity-100 [mix-blend-mode:var(--blending-value)] [background:radial-gradient(circle_at_center,_rgba(var(--second-color),_0.8)_0,_rgba(var(--second-color),_0)_50%)_no-repeat]"
            ></div>
            <div
                class="animate-third absolute top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] [transform-origin:calc(50%+400px)] opacity-100 [mix-blend-mode:var(--blending-value)] [background:radial-gradient(circle_at_center,_rgba(var(--third-color),_0.8)_0,_rgba(var(--third-color),_0)_50%)_no-repeat]"
            ></div>
            <div
                class="animate-fourth absolute top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] [transform-origin:calc(50%-200px)] opacity-70 [mix-blend-mode:var(--blending-value)] [background:radial-gradient(circle_at_center,_rgba(var(--fourth-color),_0.8)_0,_rgba(var(--fourth-color),_0)_50%)_no-repeat]"
            ></div>
            <div
                class="animate-fifth absolute top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] [transform-origin:calc(50%-800px)_calc(50%+800px)] opacity-100 [mix-blend-mode:var(--blending-value)] [background:radial-gradient(circle_at_center,_rgba(var(--fifth-color),_0.8)_0,_rgba(var(--fifth-color),_0)_50%)_no-repeat]"
            ></div>
            <div
                v-if="interactive"
                ref="interactiveRef"
                @mousemove="handleMouseMove"
                class="absolute -top-1/2 -left-1/2 h-full w-full opacity-70 [mix-blend-mode:var(--blending-value)] [background:radial-gradient(circle_at_center,_rgba(var(--pointer-color),_0.8)_0,_rgba(var(--pointer-color),_0)_50%)_no-repeat]"
            ></div>
        </div>
    </div>
</template>
