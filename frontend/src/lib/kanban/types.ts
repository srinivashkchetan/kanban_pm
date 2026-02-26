export type ColumnId =
  | "backlog"
  | "todo"
  | "in_progress"
  | "review"
  | "done";

export interface Card {
  id: string;
  columnId: ColumnId;
  title: string;
  details?: string;
  position: number;
}

export interface Column {
  id: ColumnId;
  title: string;
}

export interface Board {
  id: string;
  name: string;
  columns: Column[];
  cards: Card[];
}

export const DEFAULT_COLUMNS: Column[] = [
  { id: "backlog", title: "Backlog" },
  { id: "todo", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "review", title: "Review" },
  { id: "done", title: "Done" },
];

