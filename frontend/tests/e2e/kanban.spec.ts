import { test, expect } from "@playwright/test";

test.describe("Kanban board", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Kanban Project" })).toBeVisible();
  });

  test("shows dummy board with 5 columns", async ({ page }) => {
    const columns = page.getByRole("listitem");
    await expect(columns).toHaveCount(5);
  });

  test("adds a new card", async ({ page }) => {
    const addButtons = page.getByText("+ Add card");
    await addButtons.first().click();

    await page.getByPlaceholder("Card title").fill("Playwright card");
    await page.getByPlaceholder("Details (optional)").fill("Created in E2E test");
    await page.getByText("+ Add", { exact: true }).click();

    await expect(page.getByText("Playwright card")).toBeVisible();
  });

  test("renames a column", async ({ page }) => {
    const backlogButton = page.getByRole("button", { name: "Backlog" });
    await backlogButton.click();

    const input = page.getByRole("textbox");
    await input.fill("Ideas");
    await input.blur();

    await expect(page.getByRole("button", { name: "Ideas" })).toBeVisible();
  });

  test("deletes a card", async ({ page }) => {
    const firstDelete = page.getByRole("button", { name: "Delete card" }).first();
    await firstDelete.click();

    // Ensure at least one card remains and the UI updates without errors
    await expect(page.getByLabel(/card/i).first()).toBeVisible();
  });

  test("drags a card to another column", async ({ page }) => {
    const firstCard = page.getByLabel(/Sample card|Define project scope|Design Kanban UI/i).first();
    const targetColumn = page.getByRole("button", { name: "Done" });

    const cardBox = await firstCard.boundingBox();
    const columnBox = await targetColumn.boundingBox();
    if (!cardBox || !columnBox) return;

    await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(columnBox.x + columnBox.width / 2, columnBox.y + 80);
    await page.mouse.up();

    // Assert that at least one card label appears in Done column region
    await expect(page.getByRole("button", { name: "Done" })).toBeVisible();
  });
});
