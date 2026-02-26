## Kanban Project MVP

Single-board Kanban web app built with Next.js (App Router), TypeScript, and Tailwind, focused on a slick, minimal UI and simple interactions.

### Features
- **Single board**: One board with **5 fixed columns**, titles editable.
- **Cards**: Each card has a **title** and **details**.
- **Drag and drop**: Smooth card drag-and-drop between and within columns.
- **Basic actions**: Add card, delete card, rename columns.
- **No extras**: No persistence, auth, archive, or search.

### Getting started
- **Install dependencies**:
  - `cd frontend`
  - `npm install`
- **Run dev server**:
  - `npm run dev`
  - Open `http://localhost:3000`

### Testing
- **Unit tests** (Vitest + React Testing Library):
  - `cd frontend`
  - `npm test`
- **E2E tests** (Playwright):
  - `cd frontend`
  - `npm run test:e2e`

