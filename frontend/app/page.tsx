 "use client";

import { useState, useEffect } from "react";
import { Board } from "@/src/components/kanban/Board";
import { AiSidebar } from "@/src/components/kanban/AiSidebar";
import { useBoardState } from "@/src/lib/kanban/useBoardState";
import { LoginForm } from "@/src/components/kanban/LoginForm";

function BoardPage({
  username,
  onLogout,
}: {
  username: string;
  onLogout: () => void;
}) {
  const { board, replaceBoard, renameColumn, addCard, deleteCard, moveCard } =
    useBoardState(username);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-transparent text-slate-50">
      <main className="flex-1 overflow-auto px-4 py-6 sm:px-8 sm:py-10">
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSidebarOpen((o) => !o)}
                className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400 transition hover:border-[var(--color-kanban-primary)] hover:text-[var(--color-kanban-primary)]"
                aria-label={sidebarOpen ? "Hide AI sidebar" : "Show AI sidebar"}
              >
                {sidebarOpen ? "Hide AI" : "AI Assistant"}
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400 transition hover:border-slate-500 hover:text-slate-200"
              >
                Sign out
              </button>
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

      {sidebarOpen && (
        <aside className="ai-sidebar-wrapper" aria-label="AI chat">
          <AiSidebar
            username={username}
            board={board}
            onBoardUpdate={replaceBoard}
          />
        </aside>
      )}
    </div>
  );
}

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("kanban_user");
    setUsername(stored ?? "");
  }, []);

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
