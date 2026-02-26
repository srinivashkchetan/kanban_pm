import type { Board } from "./types";
import { DEFAULT_COLUMNS } from "./types";

function createId(prefix: string, index: number) {
  return `${prefix}-${index}`;
}

export const dummyBoard: Board = {
  id: "demo-board",
  name: "Product Launch",
  columns: DEFAULT_COLUMNS,
  cards: [
    {
      id: createId("card", 1),
      columnId: "backlog",
      title: "Define project scope",
      details: "Outline goals, constraints, and initial assumptions.",
      position: 0,
    },
    {
      id: createId("card", 2),
      columnId: "backlog",
      title: "Research competitors",
      details: "Capture 3–5 examples with screenshots.",
      position: 1,
    },
    {
      id: createId("card", 3),
      columnId: "todo",
      title: "Design Kanban UI",
      details: "Use the provided color palette and keep it minimal.",
      position: 0,
    },
    {
      id: createId("card", 4),
      columnId: "in_progress",
      title: "Implement board layout",
      details: "Columns, cards, spacing, and responsive behavior.",
      position: 0,
    },
    {
      id: createId("card", 5),
      columnId: "review",
      title: "Review interaction details",
      details: "Check drag-and-drop, hover, and focus states.",
      position: 0,
    },
    {
      id: createId("card", 6),
      columnId: "done",
      title: "Project brief",
      details: "Capture problem statement and success metrics.",
      position: 0,
    },
  ],
};

