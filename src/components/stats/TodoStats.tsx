import React from "react";
import type { TodoStatsProps } from "./types";
import styles from "./TodoStats.module.css";

export const TodoStats: React.FC<TodoStatsProps> = ({
  todos,
  onClearCompleted,
}) => {
  const totalTodos = todos.length;
  const completedTodos = todos.filter((todo) => todo.completed).length;
  const activeTodos = totalTodos - completedTodos;

  return (
    <div className={styles.todoStats}>
      <div className={styles.statsInfo}>
        <span className={styles.statItem}>
          Всего задач: <strong>{totalTodos}</strong>
        </span>
        <span className={styles.statItem}>
          Осталось: <strong>{activeTodos}</strong>
        </span>
        <span className={styles.statItem}>
          Выполнено: <strong>{completedTodos}</strong>
        </span>
      </div>
      {completedTodos > 0 && (
        <button onClick={onClearCompleted} className={styles.clearCompletedBtn}>
          Очистить выполненные
        </button>
      )}
    </div>
  );
};
