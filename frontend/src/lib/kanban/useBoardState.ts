 "use client";

import { useState, useCallback, useEffect } from "react";
import type { Board, ColumnId } from "./types";
import {
  addCard as addCardLogic,
  createInitialBoard,
  deleteCard as deleteCardLogic,
  moveCard as moveCardLogic,
  renameColumn as renameColumnLogic,
} from "./boardLogic";
import { fetchBoard, saveBoard } from "./api";

export function useBoardState(username: string) {
  const [board, setBoard] = useState<Board>(() => createInitialBoard());

  useEffect(() => {
    fetchBoard(username).then((remote) => {
      if (remote) setBoard(remote);
    });
  }, [username]);

  const renameColumn = useCallback(
    (columnId: ColumnId, title: string) => {
      setBoard((prev) => {
        const next = renameColumnLogic(prev, columnId, title);
        saveBoard(username, next);
        return next;
      });
    },
    [username],
  );

  const addCard = useCallback(
    (columnId: ColumnId, input: { title: string; details?: string }) => {
      setBoard((prev) => {
        const next = addCardLogic(prev, columnId, input);
        saveBoard(username, next);
        return next;
      });
    },
    [username],
  );

  const deleteCard = useCallback(
    (cardId: string) => {
      setBoard((prev) => {
        const next = deleteCardLogic(prev, cardId);
        saveBoard(username, next);
        return next;
      });
    },
    [username],
  );

  const moveCard = useCallback(
    (cardId: string, toColumnId: ColumnId, toIndex: number) => {
      setBoard((prev) => {
        const next = moveCardLogic(prev, cardId, toColumnId, toIndex);
        saveBoard(username, next);
        return next;
      });
    },
    [username],
  );

  return {
    board,
    renameColumn,
    addCard,
    deleteCard,
    moveCard,
  };
}
