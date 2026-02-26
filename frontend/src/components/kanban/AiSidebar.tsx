 "use client";

import { useState, useRef, useEffect } from "react";
import type { Board } from "@/src/lib/kanban/types";
import { askAI, type AiMessage } from "@/src/lib/kanban/api";

type ChatMessage = AiMessage & { boardUpdated?: boolean };

type Props = {
  username: string;
  board: Board;
  onBoardUpdate: (board: Board) => void;
};

export function AiSidebar({ username, board, onBoardUpdate }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const question = input.trim();
    if (!question || loading) return;

    const userMsg: ChatMessage = { role: "user", content: question };
    const history: AiMessage[] = messages.map(({ role, content }) => ({ role, content }));

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const result = await askAI(username, question, board, history);
      const text = result.response ?? result.error ?? "Something went wrong.";
      const boardUpdated = !!result.kanban_update;

      if (result.kanban_update) {
        onBoardUpdate(result.kanban_update);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: text, boardUpdated },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Failed to reach the AI. Is the backend running?" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="ai-sidebar">
      <div className="ai-sidebar-header">
        <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-kanban-primary)]">
          AI Assistant
        </span>
        <span className="pill-badge">beta</span>
      </div>

      <div className="ai-messages">
        {messages.length === 0 && (
          <p className="ai-empty-hint">
            Ask me to add cards, move tasks, or summarize your board.
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`ai-message ${msg.role === "user" ? "ai-message-user" : "ai-message-assistant"}`}
          >
            <p className="whitespace-pre-wrap text-xs leading-relaxed">{msg.content}</p>
            {msg.boardUpdated && (
              <span className="ai-board-updated-badge">Board updated</span>
            )}
          </div>
        ))}
        {loading && (
          <div className="ai-message ai-message-assistant">
            <span className="ai-thinking">Thinking…</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="ai-input-area">
        <textarea
          className="ai-input"
          placeholder="Ask the AI…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          disabled={loading}
        />
        <button
          type="button"
          className="ai-send-button"
          onClick={send}
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
