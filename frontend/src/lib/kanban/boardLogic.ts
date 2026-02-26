import type { Board, Card, Column, ColumnId } from "./types";
import { DEFAULT_COLUMNS } from "./types";
import { dummyBoard } from "./mockData";

export function createInitialBoard(): Board {
  return {
    ...dummyBoard,
    columns: [...DEFAULT_COLUMNS],
    cards: [...dummyBoard.cards].sort((a, b) => a.position - b.position),
  };
}

export function renameColumn(board: Board, columnId: ColumnId, title: string): Board {
  const trimmed = title.trim();
  if (!trimmed) return board;
  const columns: Column[] = board.columns.map((col) =>
    col.id === columnId ? { ...col, title: trimmed } : col,
  );
  return { ...board, columns };
}

export function addCard(
  board: Board,
  columnId: ColumnId,
  input: { title: string; details?: string },
): Board {
  const title = input.title.trim();
  if (!title) return board;

  const cardsInColumn = board.cards.filter((c) => c.columnId === columnId);
  const nextPosition =
    cardsInColumn.length === 0
      ? 0
      : Math.max(...cardsInColumn.map((c) => c.position)) + 1;

  const card: Card = {
    id: `card-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    columnId,
    title,
    details: input.details?.trim() || undefined,
    position: nextPosition,
  };

  return { ...board, cards: [...board.cards, card] };
}

export function deleteCard(board: Board, cardId: string): Board {
  const cards = board.cards.filter((c) => c.id !== cardId);
  return { ...board, cards };
}

export function moveCard(
  board: Board,
  cardId: string,
  toColumnId: ColumnId,
  toIndex: number,
): Board {
  const card = board.cards.find((c) => c.id === cardId);
  if (!card) return board;

  const remaining = board.cards.filter((c) => c.id !== cardId);
  const targetColumnCards = remaining
    .filter((c) => c.columnId === toColumnId)
    .sort((a, b) => a.position - b.position);

  const clampedIndex = Math.max(0, Math.min(toIndex, targetColumnCards.length));

  const updatedCard: Card = {
    ...card,
    columnId: toColumnId,
  };

  const before = targetColumnCards.slice(0, clampedIndex);
  const after = targetColumnCards.slice(clampedIndex);
  const reordered = [...before, updatedCard, ...after].map((c, index) => ({
    ...c,
    position: index,
  }));

  const otherCards = remaining.filter((c) => c.columnId !== toColumnId);
  return {
    ...board,
    cards: [...otherCards, ...reordered],
  };
}

