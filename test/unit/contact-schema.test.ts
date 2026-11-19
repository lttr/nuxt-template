import { describe, expect, it } from "vitest"
import { contactSchema } from "#shared/schemas/contact"

describe("contactSchema", () => {
  it("accepts a valid message", () => {
    expect(
      contactSchema.safeParse({ email: "a@example.com", message: "Hello there!" }).success,
    ).toBe(true)
  })

  it("rejects a short message", () => {
    expect(contactSchema.safeParse({ email: "a@example.com", message: "Hi" }).success).toBe(false)
  })
})
