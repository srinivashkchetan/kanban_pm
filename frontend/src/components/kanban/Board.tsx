 "use client";

import type { Board as BoardType, ColumnId } from "@/src/lib/kanban/types";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { Column } from "./Column";

type Props = {
  board: BoardType;
  onRenameColumn: (columnId: ColumnId, title: string) => void;
  onAddCard: (columnId: ColumnId, input: { title: string; details?: string }) => void;
  onDeleteCard: (cardId: string) => void;
  onMoveCard: (cardId: string, toColumnId: ColumnId, toIndex: number) => void;
};

export function Board({
  board,
  onRenameColumn,
  onAddCard,
  onDeleteCard,
  onMoveCard,
}: Props) {
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    onMoveCard(
      draggableId,
      destination.droppableId as ColumnId,
      destination.index,
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="kanban-columns" role="list" aria-label={`${board.name} board`}>
        {board.columns.map((column) => {
          const cards = board.cards
            .filter((c) => c.columnId === column.id)
            .sort((a, b) => a.position - b.position);

          return (
            <div key={column.id} role="listitem">
              <Column
                column={column}
                cards={cards}
                onRenameColumn={onRenameColumn}
                onAddCard={onAddCard}
                onDeleteCard={onDeleteCard}
              />
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}

