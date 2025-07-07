import { useState, useEffect } from "react";
import type { Todo, TodoFilter } from "../../types/todo";
import { TodoInput } from "../input";
import { TodoList } from "../list";
import { TodoStats } from "../stats";
import styles from "./App.module.css";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>("all");

  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos);
        // Восстанавливаем даты
        const todosWithDates = parsedTodos.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
        }));
        setTodos(todosWithDates);
      } catch (error) {
        console.error("Ошибка при загрузке задач:", error);
      }
    }
  }, []);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date(),
    };

    const updatedTodos = [...todos, newTodo];

    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const toggleTodo = (id: string) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );

    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const deleteTodo = (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);

    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const clearCompleted = () => {
    const updatedTodos = todos.filter((todo) => !todo.completed);

    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  return (
    <div className={styles.app}>
      <header className={styles.appHeader}>
        <h1>Список дел</h1>
      </header>

      <main className={styles.appMain}>
        <TodoInput onAdd={addTodo} />

        <TodoStats todos={todos} onClearCompleted={clearCompleted} />

        <div className={styles.filterButtons}>
          <button
            className={`${styles.filterBtn} ${
              filter === "all" ? styles.active : ""
            }`}
            onClick={() => setFilter("all")}
          >
            Все
          </button>
          <button
            className={`${styles.filterBtn} ${
              filter === "active" ? styles.active : ""
            }`}
            onClick={() => setFilter("active")}
          >
            Активные
          </button>
          <button
            className={`${styles.filterBtn} ${
              filter === "completed" ? styles.active : ""
            }`}
            onClick={() => setFilter("completed")}
          >
            Выполненные
          </button>
        </div>

        <TodoList
          todos={todos}
          filter={filter}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      </main>
    </div>
  );
}

export default App;
