 "use client";

import type { Card as CardType } from "@/src/lib/kanban/types";
import { Draggable } from "@hello-pangea/dnd";

type Props = {
  card: CardType;
  index: number;
  onDelete: (cardId: string) => void;
};

export function Card({ card, index, onDelete }: Props) {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <article
          className="kanban-card"
          aria-label={card.title}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            boxShadow: snapshot.isDragging
              ? "0 16px 40px rgba(15,23,42,0.45)"
              : provided.draggableProps.style?.boxShadow,
            transform: snapshot.isDragging
              ? `${provided.draggableProps.style?.transform ?? ""} scale(1.02)`
              : provided.draggableProps.style?.transform,
          }}
        >
          <header>
            <h3 className="kanban-card-title">{card.title}</h3>
          </header>
          {card.details && (
            <p className="kanban-card-details">{card.details}</p>
          )}
          <footer className="kanban-card-footer">
            <span className="text-[11px] text-slate-400">
              {card.columnId.toUpperCase().replace("_", " ")}
            </span>
            <button
              type="button"
              className="kanban-card-delete"
              onClick={() => onDelete(card.id)}
              aria-label="Delete card"
            >
              ×
            </button>
          </footer>
        </article>
      )}
    </Draggable>
  );
}

