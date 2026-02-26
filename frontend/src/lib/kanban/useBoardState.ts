 "use client";

import { useState, useCallback } from "react";
import type { Board, ColumnId } from "./types";
import {
  addCard as addCardLogic,
  createInitialBoard,
  deleteCard as deleteCardLogic,
  moveCard as moveCardLogic,
  renameColumn as renameColumnLogic,
} from "./boardLogic";

export function useBoardState() {
  const [board, setBoard] = useState<Board>(() => createInitialBoard());

  const renameColumn = useCallback((columnId: ColumnId, title: string) => {
    setBoard((prev) => renameColumnLogic(prev, columnId, title));
  }, []);

  const addCard = useCallback(
    (columnId: ColumnId, input: { title: string; details?: string }) => {
      setBoard((prev) => addCardLogic(prev, columnId, input));
    },
    [],
  );

  const deleteCard = useCallback((cardId: string) => {
    setBoard((prev) => deleteCardLogic(prev, cardId));
  }, []);

  const moveCard = useCallback(
    (cardId: string, toColumnId: ColumnId, toIndex: number) => {
      setBoard((prev) => moveCardLogic(prev, cardId, toColumnId, toIndex));
    },
    [],
  );

  return {
    board,
    renameColumn,
    addCard,
    deleteCard,
    moveCard,
  };
}

