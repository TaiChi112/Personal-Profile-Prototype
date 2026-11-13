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

test.describe("PMS AI Agent Phase 2 In-Cycle E2E", () => {
  test("verifies Phase 2 In-Cycle bot check-in, telemetry sync, and HITL drift acknowledge", async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    await page.goto("/projects/pms-agent");
    await expect(
      page.getByRole("heading", { name: "rsxyz PMS AI Agent Studio" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Reset State" }).click();

    // Switch Swimlane to Phase 2
    await page.getByRole("button", { name: /Phase 2: ระหว่าง Cycle/ }).click();
    await expect(
      page.getByRole("heading", {
        name: /ติดตามผลระหว่าง Cycle, Bot Check-in/,
      }),
    ).toBeVisible();

    // Verify PII masking indicator is active
    await expect(
      page.getByText(/Bot Redacted ID: ENG_ANON_8832/),
    ).toBeVisible();

    // Send LINE bot check-in and submit a slipping metric (45h -> CRITICAL_DRIFT)
    await page.getByRole("button", { name: "LINE", exact: true }).click();
    await page.getByRole("button", { name: "Send Bot Ping" }).click();
    await expect(page.getByText("PENDING").first()).toBeVisible();

    await page
      .getByPlaceholder("พิมพ์คำตอบสั้นๆ ของพนักงาน...")
      .first()
      .fill("งานติด review queue อยู่ช่วงสัปดาห์นี้");
    await page.getByLabel("Reported metric value").first().fill("45");
    await page.getByRole("button", { name: "Submit Bot Reply" }).click();

    await expect(page.getByText("CRITICAL_DRIFT")).toBeVisible();
    await page
      .getByRole("button", { name: "Acknowledge Drift (HITL)" })
      .click();
    await expect(page.getByText("Manager Acknowledged")).toBeVisible();

    // Sync good telemetry -> ON_TRACK recovery
    await page.getByLabel("Telemetry value").fill("24");
    await page.getByRole("button", { name: "Sync Telemetry" }).click();
    await expect(page.getByText("ON_TRACK")).toBeVisible();

    // Switch Swimlane to Phase 3 Evaluation & verify cross-phase synthesis
    await page.getByRole("button", { name: /Phase 3: Evaluation/ }).click();
    await expect(
      page.getByRole("heading", {
        name: /สังเคราะห์ผลประเมินจากหลักฐานจริง/,
      }),
    ).toBeVisible();

    await page
      .getByRole("button", { name: "Re-synthesize from Cycle Evidence" })
      .click();
    await expect(page.getByText("KPI Progress: 80%")).toBeVisible();

    await page.getByRole("button", { name: "Submit Self-Review" }).click();
    await expect(page.getByText("SELF_REVIEW_SUBMITTED").first()).toBeVisible();

    await page.getByRole("button", { name: "Endorse AI Score (HITL)" }).click();
    await expect(page.getByText("ENDORSED_MANAGER").first()).toBeVisible();
    await expect(
      page.getByText("MANAGER_SCORE_ENDORSED").first(),
    ).toBeVisible();

    expect(pageErrors).toEqual([]);
  });
});
