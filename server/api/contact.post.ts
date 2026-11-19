import { defineEventHandler, readValidatedBody } from "nuxt/server"
import { contactSchema } from "#shared/schemas/contact"

export default defineEventHandler(async (event) => {
  const contact = await readValidatedBody(event, contactSchema)
  // Persist or forward the message here.
  return { received: contact.email }
})
