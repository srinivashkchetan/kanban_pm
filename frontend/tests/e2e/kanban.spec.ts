import { test, expect } from "@playwright/test";
import type { Board } from "../../src/lib/kanban/types";

const MOCK_BOARD: Board = {
  id: "demo-board",
  name: "Product Launch",
  columns: [
    { id: "backlog", title: "Backlog" },
    { id: "todo", title: "To Do" },
    { id: "in_progress", title: "In Progress" },
    { id: "review", title: "Review" },
    { id: "done", title: "Done" },
  ],
  cards: [
    { id: "card-1", columnId: "backlog", title: "Define project scope", details: "Outline goals.", position: 0 },
    { id: "card-2", columnId: "backlog", title: "Research competitors", details: "Capture examples.", position: 1 },
    { id: "card-3", columnId: "todo", title: "Design Kanban UI", details: "Keep it minimal.", position: 0 },
    { id: "card-4", columnId: "in_progress", title: "Implement board layout", details: "Columns and cards.", position: 0 },
    { id: "card-5", columnId: "review", title: "Review interaction details", details: "Check states.", position: 0 },
    { id: "card-6", columnId: "done", title: "Project brief", details: "Problem statement.", position: 0 },
  ],
};

type Page = Parameters<Parameters<typeof test>[1]>[0]["page"];

async function mockApi(page: Page) {
  await page.route("/api/kanban/user", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({ json: MOCK_BOARD });
    } else {
      await route.fulfill({ json: { status: "saved" } });
    }
  });
}

async function mockAiApi(page: Page, response: { response: string; kanban_update?: Board }) {
  await page.route("/api/ai-kanban-structured/user", async (route) => {
    await route.fulfill({ json: response });
  });
}

async function login(page: Parameters<Parameters<typeof test>[1]>[0]["page"]) {
  await page.getByPlaceholder("Username").fill("user");
  await page.getByPlaceholder("Password").fill("password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Kanban Project" })).toBeVisible();
}

test.describe("Login", () => {
  test("shows login form on first visit", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByPlaceholder("Username")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });

  test("rejects bad credentials", async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("Username").fill("wrong");
    await page.getByPlaceholder("Password").fill("wrong");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("Invalid username or password")).toBeVisible();
  });

  test("accepts correct credentials and shows board", async ({ page }) => {
    await mockApi(page);
    await page.goto("/");
    await login(page);
    await expect(page.getByRole("listitem")).toHaveCount(5);
  });

  test("sign out returns to login form", async ({ page }) => {
    await mockApi(page);
    await page.goto("/");
    await login(page);
    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page.getByPlaceholder("Username")).toBeVisible();
  });
});

test.describe("Kanban board", () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page);
    await page.goto("/");
    await login(page);
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

    const input = page.getByRole("textbox").first();
    await input.fill("Ideas");
    await input.blur();

    await expect(page.getByRole("button", { name: "Ideas" })).toBeVisible();
  });

  test("deletes a card", async ({ page }) => {
    const firstDelete = page.getByRole("button", { name: "Delete card" }).first();
    await firstDelete.click();

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

    await expect(page.getByRole("button", { name: "Done" })).toBeVisible();
  });
});

test.describe("AI Sidebar", () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page);
    await page.goto("/");
    await login(page);
  });

  test("sidebar is visible by default and can be toggled", async ({ page }) => {
    await expect(page.getByLabel("AI chat")).toBeVisible();
    await page.getByRole("button", { name: "Hide AI sidebar" }).click();
    await expect(page.getByLabel("AI chat")).not.toBeVisible();
    await page.getByRole("button", { name: "Show AI sidebar" }).click();
    await expect(page.getByLabel("AI chat")).toBeVisible();
  });

  test("sends a message and shows AI response", async ({ page }) => {
    await mockAiApi(page, { response: "Here is a summary of your board." });
    await page.getByPlaceholder("Ask the AI…").fill("Summarize my board");
    await page.getByRole("button", { name: "Send" }).click();
    await expect(page.getByText("Here is a summary of your board.")).toBeVisible();
  });

  test("shows board-updated badge when AI updates the board", async ({ page }) => {
    const updatedBoard: Board = {
      ...MOCK_BOARD,
      cards: [
        ...MOCK_BOARD.cards,
        { id: "card-ai-1", columnId: "todo", title: "AI added card", details: "From AI", position: 1 },
      ],
    };
    await mockAiApi(page, { response: "I added a card for you.", kanban_update: updatedBoard });
    await page.getByPlaceholder("Ask the AI…").fill("Add a card called AI added card");
    await page.getByRole("button", { name: "Send" }).click();
    await expect(page.getByText("Board updated")).toBeVisible();
    await expect(page.getByText("AI added card").first()).toBeVisible();
  });
});
