import React, { useState } from "react";
import type { TodoInputProps } from "./types";
import styles from "./TodoInput.module.css";

export const TodoInput: React.FC<TodoInputProps> = ({ onAdd }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.todoInput}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Введите новую задачу..."
        className={styles.todoInputField}
      />
      <button type="submit" className={styles.addBtn} disabled={!text.trim()}>
        Добавить
      </button>
    </form>
  );
};
