 "use client";

import { useState, useEffect } from "react";
import { Board } from "@/src/components/kanban/Board";
import { useBoardState } from "@/src/lib/kanban/useBoardState";
import { LoginForm } from "@/src/components/kanban/LoginForm";

function BoardPage({
  username,
  onLogout,
}: {
  username: string;
  onLogout: () => void;
}) {
  const { board, renameColumn, addCard, deleteCard, moveCard } =
    useBoardState(username);

  return (
    <div className="app-shell">
      <main className="app-shell-main">
        <section className="kanban-board" aria-label="Kanban board">
          <header className="kanban-header">
            <div>
              <p className="pill-badge mb-3">
                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-kanban-accent)]" />
                {username}
              </p>
              <h1 className="kanban-title">Kanban Project</h1>
              <p className="kanban-subtitle">
                A focused, single-board workspace with a gorgeous drag-and-drop
                experience.
              </p>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="self-start rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400 transition hover:border-slate-500 hover:text-slate-200"
            >
              Sign out
            </button>
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

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("kanban_user");
    setUsername(stored ?? "");
  }, []);

  // null = hydrating (avoid flash)
  if (username === null) return null;

  if (!username) {
    return (
      <LoginForm
        onLogin={(u) => {
          sessionStorage.setItem("kanban_user", u);
          setUsername(u);
        }}
      />
    );
  }

  return (
    <BoardPage
      username={username}
      onLogout={() => {
        sessionStorage.removeItem("kanban_user");
        setUsername("");
      }}
    />
  );
}
