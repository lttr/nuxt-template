<script setup lang="ts">
import ContactForm from "~/components/ContactForm.vue"

useSeoMeta({ title: "Nuxt template" })
</script>

<template>
  <UContainer class="py-12">
    <h1 class="mb-8 text-2xl font-semibold">Nuxt template</h1>
    <ContactForm />
  </UContainer>
</template>
