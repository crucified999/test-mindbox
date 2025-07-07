import type { Todo } from "../../types/todo";

export interface TodoStatsProps {
  todos: Todo[];
  onClearCompleted: () => void;
}
