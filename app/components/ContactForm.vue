<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import { contactSchema, type Contact } from "#shared/schemas/contact"

const state = reactive<Partial<Contact>>({ email: "", message: "" })
const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Contact>) {
  const result = await $fetch("/api/contact", { method: "POST", body: event.data })
  toast.add({ title: "Message sent", description: `Thanks, ${result.received}`, color: "success" })
  state.message = ""
}
</script>

<template>
  <UForm :schema="contactSchema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormField label="Email" name="email">
      <UInput v-model="state.email" type="email" class="w-full" />
    </UFormField>
    <UFormField label="Message" name="message">
      <UTextarea v-model="state.message" class="w-full" />
    </UFormField>
    <UButton type="submit" icon="i-lucide-send">Send</UButton>
  </UForm>
</template>
