import type { Board } from "./types";

export async function fetchBoard(username: string): Promise<Board | null> {
  try {
    const res = await fetch(`/api/kanban/${username}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data && Array.isArray(data.columns) && Array.isArray(data.cards)) {
      return data as Board;
    }
    return null;
  } catch {
    return null;
  }
}

export async function saveBoard(username: string, board: Board): Promise<void> {
  try {
    await fetch(`/api/kanban/${username}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(board),
    });
  } catch {
    // Silently fail — board state is still correct in memory
  }
}
