 "use client";

import { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import type { Card as CardType, Column as ColumnType } from "@/src/lib/kanban/types";
import type { ColumnId } from "@/src/lib/kanban/types";
import { Card } from "./Card";

type Props = {
  column: ColumnType;
  cards: CardType[];
  onRenameColumn: (columnId: ColumnId, title: string) => void;
  onAddCard: (columnId: ColumnId, input: { title: string; details?: string }) => void;
  onDeleteCard: (cardId: string) => void;
};

export function Column({
  column,
  cards,
  onRenameColumn,
  onAddCard,
  onDeleteCard,
}: Props) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(column.title);

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDetails, setNewDetails] = useState("");

  const handleTitleBlur = () => {
    onRenameColumn(column.id, titleDraft);
    setIsEditingTitle(false);
  };

  const handleAddCard = () => {
    if (!newTitle.trim()) return;
    onAddCard(column.id, { title: newTitle, details: newDetails });
    setNewTitle("");
    setNewDetails("");
    setIsAdding(false);
  };

  return (
    <section className="kanban-column" aria-label={column.title}>
      <header className="kanban-column-header">
        {isEditingTitle ? (
          <input
            className="kanban-column-title-input"
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={handleTitleBlur}
            autoFocus
          />
        ) : (
          <button
            type="button"
            className="kanban-column-title text-left"
            onClick={() => setIsEditingTitle(true)}
          >
            {column.title}
          </button>
        )}
        <span className="kanban-column-count">{cards.length}</span>
      </header>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            className="kanban-card-list"
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              backgroundColor: snapshot.isDraggingOver
                ? "rgba(148, 163, 184, 0.08)"
                : "transparent",
            }}
          >
            {cards.map((card, index) => (
              <Card
                key={card.id}
                card={card}
                index={index}
                onDelete={onDeleteCard}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="kanban-add-card">
        {isAdding ? (
          <>
            <input
              className="kanban-input"
              placeholder="Card title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <textarea
              className="kanban-textarea"
              placeholder="Details (optional)"
              value={newDetails}
              onChange={(e) => setNewDetails(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="kanban-add-card-button"
                onClick={handleAddCard}
              >
                + Add
              </button>
              <button
                type="button"
                className="text-[11px] text-slate-400 hover:underline"
                onClick={() => {
                  setIsAdding(false);
                  setNewTitle("");
                  setNewDetails("");
                }}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            className="kanban-add-card-button"
            onClick={() => setIsAdding(true)}
          >
            + Add card
          </button>
        )}
      </div>
    </section>
  );
}

