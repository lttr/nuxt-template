import { z } from "zod"

// One schema for both sides: UForm validates with it in the browser,
// readValidatedBody validates with it on the server.
export const contactSchema = z.object({
  email: z.email(),
  message: z.string().trim().min(10, "Write at least 10 characters"),
})

export type Contact = z.infer<typeof contactSchema>
