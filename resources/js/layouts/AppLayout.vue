<script setup>
import Navbar from '@/layouts/partials/Navbar.vue'
import Footer from '@/layouts/partials/Footer.vue'
</script>

<template>
    <Navbar />
    <slot name="content" />
    <Footer />
</template>
