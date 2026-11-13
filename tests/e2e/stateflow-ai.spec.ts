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

test.describe("StateFlow AI Live Browser E2E Verification", () => {
  test("verifies compound NLP, Apply Optimization, .spec.ts/.mmd downloads, and all 5 MCP tools", async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    await page.goto("/projects/stateflow-ai");
    await expect(
      page.getByRole("heading", { name: "StateFlow AI" }),
    ).toBeVisible();

    // Reset to guarantee deterministic baseline
    await page.getByRole("button", { name: "Reset", exact: true }).click();
    await expect(page.getByText("320 / 500 Pts")).toBeVisible();
    await expect(page.getByText("125,000 THB").first()).toBeVisible();

    // 1. Compound NLP Chain
    await page.getByRole("button", { name: "+ Compound Chain" }).click();
    await page
      .getByRole("button", { name: "สั่ง AI Agent อัปเดต State SSOT" })
      .click();
    await expect(page.getByText("e-KYC Verify #1").first()).toBeVisible();
    await expect(page.getByText("Warehouse Lock #2").first()).toBeVisible();

    // 2. Apply Webhook Optimization & Undo + Report Download
    await page
      .getByRole("button", { name: "Apply Webhook Optimization Now" })
      .click();
    await expect(
      page.getByText("Webhook Dead-Letter Queue").first(),
    ).toBeVisible();

    await page.getByRole("button", { name: "Undo" }).first().click();
    await expect(
      page.getByRole("button", { name: "Apply Webhook Optimization Now" }),
    ).toBeVisible();

    await page
      .getByRole("button", { name: "Apply Webhook Optimization Now" })
      .click();
    const mdDownloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export Report (.md)" }).click();
    const mdDownload = await mdDownloadPromise;
    expect(mdDownload.suggestedFilename()).toContain("-quotation.md");

    // 3. QA Tests View: Playwright (.spec.ts) & Mermaid (.mmd) Codegen + Download
    await page.getByRole("button", { name: "QA Tests" }).click();
    await page.getByRole("button", { name: "Playwright", exact: true }).click();
    await expect(
      page.getByText("StateFlow SSOT MBT Suite").first(),
    ).toBeVisible();

    const specDownloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download" }).click();
    const specDownload = await specDownloadPromise;
    expect(specDownload.suggestedFilename()).toContain(".spec.ts");

    await page.getByRole("button", { name: "Mermaid", exact: true }).click();
    await expect(page.getByText("stateDiagram-v2").first()).toBeVisible();
    const mmdDownloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download" }).click();
    const mmdDownload = await mmdDownloadPromise;
    expect(mmdDownload.suggestedFilename()).toContain(".mmd");

    // 4. Interactive 5-Tool MCP Runner
    await page.getByRole("button", { name: "MCP Tools" }).click();
    await page.getByRole("button", { name: "Reset", exact: true }).click();

    const mcpArgsBox = page.locator("#mcp-args-input");
    await mcpArgsBox.fill(JSON.stringify({ includeMetrics: true }));
    await page.getByRole("button", { name: /1\. read_ssot_graph\(\)/ }).click();
    await expect(
      page.getByText(/"workflowSlug": "ecommerce_checkout_ssot"/).first(),
    ).toBeVisible();

    await mcpArgsBox.fill(
      JSON.stringify({ intent: "เพิ่มตรวจเครดิตบูโร", autoCalculateCost: true }),
    );
    await page
      .getByRole("button", { name: /2\. mutate_state_graph\(\)/ })
      .click();
    await expect(
      page.getByText(/"status": "AST_UPDATED"/).first(),
    ).toBeVisible();

    await page
      .getByRole("button", { name: /3\. evaluate_nxn_matrix\(\)/ })
      .click();
    await expect(
      page.getByText(/"combinatorialTestPaths":/).first(),
    ).toBeVisible();

    await mcpArgsBox.fill(JSON.stringify({ format: "playwright" }));
    await page
      .getByRole("button", { name: /4\. generate_qa_playwright\(\)/ })
      .click();
    await expect(
      page
        .getByText(/import \{ test, expect \} from "@playwright\/test"/)
        .first(),
    ).toBeVisible();

    await page
      .getByRole("button", { name: /5\. optimize_topology\(\)/ })
      .click();
    await expect(page.getByText(/"applied": true/).first()).toBeVisible();

    expect(pageErrors).toEqual([]);
  });
});
