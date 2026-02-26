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

export type AiMessage = { role: "user" | "assistant"; content: string };

export type AiResponse = {
  response?: string;
  kanban_update?: Board;
  error?: string;
};

export async function askAI(
  username: string,
  question: string,
  board: Board,
  history: AiMessage[],
): Promise<AiResponse> {
  const res = await fetch(`/api/ai-kanban-structured/${username}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kanban: board, question, history }),
  });
  if (!res.ok) throw new Error("AI request failed");
  return res.json();
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
