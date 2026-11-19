import { mountSuspended } from "@nuxt/test-utils/runtime"
import { describe, expect, it } from "vitest"
import ContactForm from "~/components/ContactForm.vue"

describe("ContactForm", () => {
  it("renders the fields", async () => {
    const wrapper = await mountSuspended(ContactForm)
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find("textarea").exists()).toBe(true)
  })
})
