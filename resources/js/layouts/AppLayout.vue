<script setup>
import Navbar from '@/layouts/partials/Navbar.vue'
import Footer from '@/layouts/partials/Footer.vue'
</script>

<template>
    <Navbar />

    <main>
        <slot name="content" />
    </main>
    <Footer />
</template>
