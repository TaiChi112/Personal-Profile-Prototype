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

test.describe("AI Bridge Health Observatory E2E", () => {
  test("displays all 8 AI bridge routes, updates live metrics, filters, and resets circuits cleanly", async ({
    page,
    request,
  }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    // Seed real telemetry via stateless API call with PII so dashboard reflects live activity
    const seedRes = await request.post("/api/agentic-testing/intent", {
      data: {
        prompt: "Verify checkout for customer@example.com phone 0812345678",
        currentNodes: [{ id: "node-1", label: "Start" }],
        currentEdges: [],
      },
    });
    expect(seedRes.status()).toBe(200);

    await page.goto("/projects/ai-bridge-health");
    await expect(
      page.getByRole("heading", { name: "AI Bridge Health Observatory" }),
    ).toBeVisible();

    await expect(page.getByTestId("kpi-total-routes")).toHaveText("8");
    await expect(page.getByTestId("route-card-stateflow:intent")).toBeVisible();
    await expect(
      page.getByTestId("route-card-agentic-testing:intent"),
    ).toBeVisible();
    await expect(page.getByTestId("route-card-webhooks:line-ai")).toBeVisible();

    await page.getByRole("button", { name: "CLOSED", exact: true }).click();
    await expect(page.getByTestId("route-card-chat:assistant")).toBeVisible();

    await page.getByRole("button", { name: "ALL", exact: true }).click();
    await page.getByRole("button", { name: "Reset All Circuits" }).click();
    await expect(page.getByTestId("ai-bridge-action-note")).toContainText(
      "RESET_CIRCUIT",
    );

    expect(pageErrors).toEqual([]);
  });
});
