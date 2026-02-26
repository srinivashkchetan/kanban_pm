import { describe, it, expect } from "vitest";
import type { Board } from "../types";
import { DEFAULT_COLUMNS } from "../types";
import { addCard, deleteCard, moveCard, renameColumn } from "../boardLogic";

function createEmptyBoard(): Board {
  return {
    id: "b1",
    name: "Test",
    columns: DEFAULT_COLUMNS,
    cards: [],
  };
}

describe("boardLogic", () => {
  it("renames a column", () => {
    const board = createEmptyBoard();
    const updated = renameColumn(board, "todo", "Next Up");
    expect(updated.columns.find((c) => c.id === "todo")?.title).toBe("Next Up");
  });

  it("adds a card to a column", () => {
    const board = createEmptyBoard();
    const updated = addCard(board, "todo", { title: "My task" });
    expect(updated.cards).toHaveLength(1);
    expect(updated.cards[0]).toMatchObject({
      title: "My task",
      columnId: "todo",
      position: 0,
    });
  });

  it("deletes a card", () => {
    const board = createEmptyBoard();
    const withCard = addCard(board, "todo", { title: "My task" });
    const cardId = withCard.cards[0].id;
    const updated = deleteCard(withCard, cardId);
    expect(updated.cards).toHaveLength(0);
  });

  it("moves a card between columns and reorders", () => {
    let board = createEmptyBoard();
    board = addCard(board, "todo", { title: "A" });
    board = addCard(board, "todo", { title: "B" });
    const [first, second] = board.cards;

    const moved = moveCard(board, first.id, "done", 0);

    const doneCards = moved.cards
      .filter((c) => c.columnId === "done")
      .sort((a, b) => a.position - b.position);
    const todoCards = moved.cards
      .filter((c) => c.columnId === "todo")
      .sort((a, b) => a.position - b.position);

    expect(doneCards).toHaveLength(1);
    expect(doneCards[0].id).toBe(first.id);
    expect(doneCards[0].position).toBe(0);

    expect(todoCards).toHaveLength(1);
    expect(todoCards[0].id).toBe(second.id);
  });
});

