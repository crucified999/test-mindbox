import React from "react";
import type { TodoItemProps } from "./types";
import styles from "./TodoItem.module.css";

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
}) => {
  return (
    <div className={styles.todoItem}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className={styles.todoCheckbox}
      />
      <span
        className={`${styles.todoText} ${
          todo.completed ? styles.completed : ""
        }`}
      >
        {todo.text}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className={styles.deleteBtn}
        aria-label="Удалить задачу"
      >
        ×
      </button>
    </div>
  );
};
