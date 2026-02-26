 "use client";

import { Board } from "@/src/components/kanban/Board";
import { useBoardState } from "@/src/lib/kanban/useBoardState";

export default function Home() {
  const { board, renameColumn, addCard, deleteCard, moveCard } = useBoardState();

  return (
    <div className="app-shell">
      <main className="app-shell-main">
        <section className="kanban-board" aria-label="Kanban board">
          <header className="kanban-header">
            <div>
              <p className="pill-badge mb-3">
                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-kanban-accent)]" />
                Single board · No persistence
              </p>
              <h1 className="kanban-title">Kanban Project</h1>
              <p className="kanban-subtitle">
                A focused, single-board workspace with a gorgeous drag-and-drop
                experience.
              </p>
            </div>
          </header>

          <Board
            board={board}
            onRenameColumn={renameColumn}
            onAddCard={addCard}
            onDeleteCard={deleteCard}
            onMoveCard={moveCard}
          />
        </section>
      </main>
    </div>
  );
}
