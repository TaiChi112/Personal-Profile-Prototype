import fs from "node:fs";
import { expect, test } from "@playwright/test";

const MAC_CHROME_PATH =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

if (fs.existsSync(MAC_CHROME_PATH)) {
  test.use({
    launchOptions: {
      executablePath: MAC_CHROME_PATH,
    },
  });
}

test.describe("Agentic Testing Bridge E2E Verification", () => {
  test("verifies AUTO bridge fallback/live execution and LOCAL_ONLY zero-API execution", async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    await page.goto("/projects/agentic-testing");
    await expect(
      page.getByRole("heading", { name: "Agentic Testing Simulator" }),
    ).toBeVisible();

    await expect(
      page.getByTestId("agentic-testing-ai-source-badge"),
    ).toHaveText("IDLE");

    const promptInput = page.getByPlaceholder(
      /Instruct AI to modify workflow/i,
    );
    await promptInput.fill("Add 2FA OTP check after payment");
    await page.getByRole("button", { name: "Execute" }).click();

    await expect(
      page.getByTestId("agentic-testing-ai-source-badge"),
    ).toHaveText(/LOCAL_FALLBACK|LIVE_GEMINI/);
    await expect(page.getByText(/AI Action:/i).first()).toBeVisible();

    await page.getByRole("button", { name: "LOCAL_ONLY", exact: true }).click();
    await expect(
      page.getByTestId("agentic-testing-ai-source-badge"),
    ).toHaveText("LOCAL_ONLY");

    await promptInput.fill("Add fraud check branch");
    await page.getByRole("button", { name: "Execute" }).click();
    await expect(
      page.getByTestId("agentic-testing-ai-source-badge"),
    ).toHaveText("LOCAL_ONLY");

    expect(pageErrors).toEqual([]);
  });
});
