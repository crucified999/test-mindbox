import React from "react";
import type { TodoListProps } from "./types";
import { TodoItem } from "../item";
import styles from "./TodoList.module.css";

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  filter,
  onToggle,
  onDelete,
}) => {
  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case "active":
        return !todo.completed;
      case "completed":
        return todo.completed;
      default:
        return true;
    }
  });

  const getFilterTitle = () => {
    switch (filter) {
      case "active":
        return "Невыполненные задачи";
      case "completed":
        return "Выполненные задачи";
      default:
        return "Все задачи";
    }
  };

  if (filteredTodos.length === 0) {
    return (
      <div className={styles.todoList}>
        <h3>{getFilterTitle()}</h3>
        <p className={styles.emptyMessage}>
          {filter === "all" && "Нет задач"}
          {filter === "active" && "Нет невыполненных задач"}
          {filter === "completed" && "Нет выполненных задач"}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.todoList}>
      <h3>{getFilterTitle()}</h3>
      <div className={styles.todoItems}>
        {filteredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};
