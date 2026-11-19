import { $fetch, createPage, setup } from "@nuxt/test-utils/e2e"
import { describe, expect, it } from "vitest"

describe("app", async () => {
  // Uses the installed Google Chrome, so Playwright needs no browser download.
  await setup({
    browser: true,
    browserOptions: { type: "chromium", launch: { channel: "chrome" } },
  })

  it("serves the health endpoint", async () => {
    expect(await $fetch("/api/health")).toEqual({ status: "ok" })
  })

  it("rejects an invalid contact message", async () => {
    await expect(
      $fetch("/api/contact", { method: "POST", body: { email: "nope" } }),
    ).rejects.toThrow()
  })

  it("submits the contact form", async () => {
    const page = await createPage("/")
    await page.getByLabel("Email").fill("a@example.com")
    await page.getByLabel("Message").fill("Hello from the e2e test")
    await page.getByRole("button", { name: "Send" }).click()
    await page.getByText("Message sent", { exact: true }).waitFor()
  })
})
