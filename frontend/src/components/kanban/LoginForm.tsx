 "use client";

import { useState } from "react";

type Props = {
  onLogin: (username: string) => void;
};

export function LoginForm({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "user" && password === "password") {
      onLogin(username);
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="app-shell">
      <main className="app-shell-main flex items-center justify-center">
        <div className="w-full max-w-sm rounded-2xl border border-slate-800/60 bg-slate-900/60 p-8 shadow-xl backdrop-blur">
          <div className="mb-6">
            <p className="pill-badge mb-3">
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-kanban-accent)]" />
              Kanban Project
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
              Sign in
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              className="kanban-input"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
            <input
              className="kanban-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            {error && (
              <p className="text-xs text-red-400">{error}</p>
            )}
            <button
              type="submit"
              className="mt-1 rounded-full bg-[var(--color-kanban-secondary)] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-purple-700"
            >
              Sign in
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
