import type { Todo, TodoFilter } from "../../types/todo";

export interface TodoListProps {
  todos: Todo[];
  filter: TodoFilter;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}
