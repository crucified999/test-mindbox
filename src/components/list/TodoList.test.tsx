import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { TodoList } from "./TodoList";
import type { Todo } from "../../types/todo";

describe("TodoList", () => {
  const mockOnToggle = vi.fn();
  const mockOnDelete = vi.fn();

  const mockTodos: Todo[] = [
    {
      id: "1",
      text: "Первая задача",
      completed: false,
      createdAt: new Date("2024-01-01"),
    },
    {
      id: "2",
      text: "Вторая задача",
      completed: true,
      createdAt: new Date("2024-01-02"),
    },
    {
      id: "3",
      text: "Третья задача",
      completed: false,
      createdAt: new Date("2024-01-03"),
    },
  ];

  beforeEach(() => {
    mockOnToggle.mockClear();
    mockOnDelete.mockClear();
  });

  it('рендерит все задачи при фильтре "all"', () => {
    render(
      <TodoList
        todos={mockTodos}
        filter="all"
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Все задачи")).toBeInTheDocument();
    expect(screen.getByText("Первая задача")).toBeInTheDocument();
    expect(screen.getByText("Вторая задача")).toBeInTheDocument();
    expect(screen.getByText("Третья задача")).toBeInTheDocument();
  });

  it('рендерит только активные задачи при фильтре "active"', () => {
    render(
      <TodoList
        todos={mockTodos}
        filter="active"
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Невыполненные задачи")).toBeInTheDocument();
    expect(screen.getByText("Первая задача")).toBeInTheDocument();
    expect(screen.queryByText("Вторая задача")).not.toBeInTheDocument();
    expect(screen.getByText("Третья задача")).toBeInTheDocument();
  });

  it('рендерит только выполненные задачи при фильтре "completed"', () => {
    render(
      <TodoList
        todos={mockTodos}
        filter="completed"
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Выполненные задачи")).toBeInTheDocument();
    expect(screen.queryByText("Первая задача")).not.toBeInTheDocument();
    expect(screen.getByText("Вторая задача")).toBeInTheDocument();
    expect(screen.queryByText("Третья задача")).not.toBeInTheDocument();
  });

  it("отображает сообщение при отсутствии задач", () => {
    render(
      <TodoList
        todos={[]}
        filter="all"
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Все задачи")).toBeInTheDocument();
    expect(screen.getByText("Нет задач")).toBeInTheDocument();
  });

  it("отображает сообщение при отсутствии активных задач", () => {
    const completedTodos: Todo[] = [
      {
        id: "1",
        text: "Выполненная задача",
        completed: true,
        createdAt: new Date("2024-01-01"),
      },
    ];

    render(
      <TodoList
        todos={completedTodos}
        filter="active"
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Невыполненные задачи")).toBeInTheDocument();
    expect(screen.getByText("Нет невыполненных задач")).toBeInTheDocument();
  });

  it("отображает сообщение при отсутствии выполненных задач", () => {
    const activeTodos: Todo[] = [
      {
        id: "1",
        text: "Активная задача",
        completed: false,
        createdAt: new Date("2024-01-01"),
      },
    ];

    render(
      <TodoList
        todos={activeTodos}
        filter="completed"
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Выполненные задачи")).toBeInTheDocument();
    expect(screen.getByText("Нет выполненных задач")).toBeInTheDocument();
  });

  it("передает правильные пропсы в TodoItem", () => {
    render(
      <TodoList
        todos={mockTodos}
        filter="all"
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    // Проверяем, что все задачи отображаются
    expect(screen.getByText("Первая задача")).toBeInTheDocument();
    expect(screen.getByText("Вторая задача")).toBeInTheDocument();
    expect(screen.getByText("Третья задача")).toBeInTheDocument();
  });

  it("правильно фильтрует задачи при изменении фильтра", () => {
    const { rerender } = render(
      <TodoList
        todos={mockTodos}
        filter="all"
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    // Проверяем все задачи
    expect(screen.getByText("Все задачи")).toBeInTheDocument();
    expect(screen.getByText("Первая задача")).toBeInTheDocument();
    expect(screen.getByText("Вторая задача")).toBeInTheDocument();
    expect(screen.getByText("Третья задача")).toBeInTheDocument();

    // Меняем фильтр на активные
    rerender(
      <TodoList
        todos={mockTodos}
        filter="active"
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Невыполненные задачи")).toBeInTheDocument();
    expect(screen.getByText("Первая задача")).toBeInTheDocument();
    expect(screen.queryByText("Вторая задача")).not.toBeInTheDocument();
    expect(screen.getByText("Третья задача")).toBeInTheDocument();
  });
});
