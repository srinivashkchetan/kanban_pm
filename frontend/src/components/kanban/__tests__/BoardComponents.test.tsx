import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Board } from "../Board";
import type { Board as BoardType } from "../../../lib/kanban/types";
import { DEFAULT_COLUMNS } from "../../../lib/kanban/types";

function createBoard(): BoardType {
  return {
    id: "b1",
    name: "Demo",
    columns: DEFAULT_COLUMNS,
    cards: [
      {
        id: "c1",
        columnId: "todo",
        title: "Sample card",
        details: "Some details",
        position: 0,
      },
    ],
  };
}

describe("Board components", () => {
  it("renders columns and cards", () => {
    const board = createBoard();
    render(
      <Board
        board={board}
        onRenameColumn={() => {}}
        onAddCard={() => {}}
        onDeleteCard={() => {}}
        onMoveCard={() => {}}
      />,
    );

    expect(screen.getByText("Sample card")).toBeInTheDocument();
    expect(screen.getByText("To Do")).toBeInTheDocument();
  });

  it("allows adding a card via Column controls", () => {
    const board = createBoard();
    const handleAdd = vi.fn();

    render(
      <Board
        board={board}
        onRenameColumn={() => {}}
        onAddCard={handleAdd}
        onDeleteCard={() => {}}
        onMoveCard={() => {}}
      />,
    );

    const addButton = screen.getAllByText("+ Add card")[0];
    fireEvent.click(addButton);

    const titleInput = screen.getByPlaceholderText("Card title");
    fireEvent.change(titleInput, { target: { value: "New task" } });

    const confirmButton = screen.getByText("+ Add");
    fireEvent.click(confirmButton);

    expect(handleAdd).toHaveBeenCalledWith("backlog", {
      title: "New task",
      details: "",
    });
  });
});
