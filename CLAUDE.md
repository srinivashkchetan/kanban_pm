# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kanban Project Management MVP — a single-board Kanban app with an AI chat sidebar. The frontend is Next.js; the backend is Python FastAPI (also serves the built frontend). Everything runs in Docker.

## Key Commands

### Frontend (run from `frontend/`)
```bash
npm install          # Install dependencies
npm run dev          # Dev server at http://localhost:3000
npm run build        # Build for production (outputs to frontend/.next/)
npm run lint         # ESLint
npm test             # Unit tests (Vitest)
npm run test:ui      # Unit tests with browser UI
npm run test:e2e     # E2E tests (Playwright)
```

### Backend / Docker (run from `app/`)
```bash
./scripts/start.sh   # Build and start Docker container (port 8000)
./scripts/stop.sh    # Stop Docker container
```

### Backend tests (run from `app/`)
```bash
pytest backend/test_backend.py
```

### Run a single unit test
```bash
cd frontend && npx vitest run src/lib/kanban/__tests__/boardLogic.test.ts
```

## Architecture

```
kanban_pm/
├── frontend/        # Next.js 16 source (App Router, TypeScript, Tailwind v4)
│   ├── app/         # Route pages
│   └── src/
│       ├── components/kanban/   # React components: Board, Column, Card
│       └── lib/kanban/          # Pure business logic + state hook
│           ├── boardLogic.ts    # Pure functions (addCard, moveCard, etc.)
│           ├── useBoardState.ts # React hook — single source of truth
│           └── types.ts         # Board, Column, Card, ColumnId interfaces
├── app/             # Dockerized production app
│   ├── backend/
│   │   ├── main.py             # FastAPI app — API routes + serves /
│   │   └── kanban_data/        # File-based persistence: {username}.json
│   ├── frontend/               # Built Next.js assets (copy here before Docker build)
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── scripts/                # start.sh / stop.sh
└── docs/            # Plan, schema, and design docs
```

### Data Flow

1. The built Next.js app is served as static files by FastAPI at `/`.
2. The browser calls `/api/kanban/{username}` to load/save board state.
3. Board state is persisted as JSON files in `app/backend/kanban_data/`.
4. AI chat hits `/api/ai-kanban-structured/{username}`, which calls OpenRouter (`openai/gpt-oss-120b`) and returns both a text response and an optional `kanban_update` payload that the frontend applies.

### Frontend State

State lives entirely in `useBoardState.ts` (useState + callbacks). All mutations go through pure functions in `boardLogic.ts` — no Redux or Context API.

Drag-and-drop is handled by `@hello-pangea/dnd`.

### Backend Persistence

Each user's board is one JSON file at `app/backend/kanban_data/{username}.json`. If the file doesn't exist, the backend auto-creates a default board.

## Key Technical Decisions (from Agents.md)

- AI calls use **OpenRouter** (`OPENROUTER_API_KEY` in `app/.env`), model `openai/gpt-oss-120b`.
- Python package manager inside Docker is **uv**.
- Database target is **SQLite** (currently JSON files — migration planned).
- MVP auth is hardcoded: username `user`, password `password`.
- 5 fixed columns per board; column titles are editable.

## Coding Standards

- No over-engineering. No unnecessary defensive programming.
- No emojis anywhere.
- When hitting issues, identify root cause with evidence before fixing.
- Use latest idiomatic versions of libraries.
