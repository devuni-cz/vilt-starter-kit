<script setup>
import Footer from '@/layouts/partials/Footer.vue'
import Navbar from '@/layouts/partials/Navbar.vue'
</script>

<template>
    <div class="flex min-h-screen flex-col justify-between">
        <Navbar />

        <main>
            <slot />
        </main>

        <Footer />
    </div>
</template>
