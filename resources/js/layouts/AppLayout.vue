<script setup>
import Navbar from '@/layouts/partials/Navbar.vue'
import Footer from '@/layouts/partials/Footer.vue'
</script>

<template>
    <div class="flex min-h-screen flex-col justify-between">
        <Navbar />

        <main class="">
            <slot name="content" />
        </main>
        <Footer />
    </div>
</template>
