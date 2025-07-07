import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TodoStats } from "./TodoStats";
import type { Todo } from "../../types/todo";

describe("TodoStats", () => {
  const mockOnClearCompleted = vi.fn();

  beforeEach(() => {
    mockOnClearCompleted.mockClear();
  });

  it("отображает правильную статистику для всех задач", () => {
    const todos: Todo[] = [
      { id: "1", text: "Задача 1", completed: false, createdAt: new Date() },
      { id: "2", text: "Задача 2", completed: true, createdAt: new Date() },
      { id: "3", text: "Задача 3", completed: false, createdAt: new Date() },
      { id: "4", text: "Задача 4", completed: true, createdAt: new Date() },
    ];

    render(<TodoStats todos={todos} onClearCompleted={mockOnClearCompleted} />);

    expect(screen.getByText(/Всего задач:/)).toBeInTheDocument();
    expect(screen.getAllByText("4")[0]).toBeInTheDocument();
    expect(screen.getByText(/Осталось:/)).toBeInTheDocument();
    expect(screen.getAllByText("2")[0]).toBeInTheDocument();
    expect(screen.getByText(/Выполнено:/)).toBeInTheDocument();
  });

  it("отображает статистику для пустого списка", () => {
    render(<TodoStats todos={[]} onClearCompleted={mockOnClearCompleted} />);

    expect(screen.getByText(/Всего задач:/)).toBeInTheDocument();
    expect(screen.getAllByText("0")[0]).toBeInTheDocument();
    expect(screen.getByText(/Осталось:/)).toBeInTheDocument();
    expect(screen.getByText(/Выполнено:/)).toBeInTheDocument();
  });

  it("отображает статистику только для активных задач", () => {
    const todos: Todo[] = [
      { id: "1", text: "Задача 1", completed: false, createdAt: new Date() },
      { id: "2", text: "Задача 2", completed: false, createdAt: new Date() },
      { id: "3", text: "Задача 3", completed: false, createdAt: new Date() },
    ];

    render(<TodoStats todos={todos} onClearCompleted={mockOnClearCompleted} />);

    expect(screen.getByText(/Всего задач:/)).toBeInTheDocument();
    expect(screen.getAllByText("3")[0]).toBeInTheDocument();
    expect(screen.getByText(/Осталось:/)).toBeInTheDocument();
    expect(screen.getByText(/Выполнено:/)).toBeInTheDocument();
  });

  it("отображает статистику только для выполненных задач", () => {
    const todos: Todo[] = [
      { id: "1", text: "Задача 1", completed: true, createdAt: new Date() },
      { id: "2", text: "Задача 2", completed: true, createdAt: new Date() },
    ];

    render(<TodoStats todos={todos} onClearCompleted={mockOnClearCompleted} />);

    expect(screen.getByText(/Всего задач:/)).toBeInTheDocument();
    expect(screen.getAllByText("2")[0]).toBeInTheDocument();
    expect(screen.getByText(/Осталось:/)).toBeInTheDocument();
    expect(screen.getByText(/Выполнено:/)).toBeInTheDocument();
  });

  it("показывает кнопку очистки при наличии выполненных задач", () => {
    const todos: Todo[] = [
      { id: "1", text: "Задача 1", completed: false, createdAt: new Date() },
      { id: "2", text: "Задача 2", completed: true, createdAt: new Date() },
    ];

    render(<TodoStats todos={todos} onClearCompleted={mockOnClearCompleted} />);

    expect(
      screen.getByRole("button", { name: "Очистить выполненные" })
    ).toBeInTheDocument();
  });

  it("не показывает кнопку очистки при отсутствии выполненных задач", () => {
    const todos: Todo[] = [
      { id: "1", text: "Задача 1", completed: false, createdAt: new Date() },
      { id: "2", text: "Задача 2", completed: false, createdAt: new Date() },
    ];

    render(<TodoStats todos={todos} onClearCompleted={mockOnClearCompleted} />);

    expect(
      screen.queryByRole("button", { name: "Очистить выполненные" })
    ).not.toBeInTheDocument();
  });

  it("вызывает onClearCompleted при клике на кнопку очистки", () => {
    const todos: Todo[] = [
      { id: "1", text: "Задача 1", completed: false, createdAt: new Date() },
      { id: "2", text: "Задача 2", completed: true, createdAt: new Date() },
    ];

    render(<TodoStats todos={todos} onClearCompleted={mockOnClearCompleted} />);

    const clearButton = screen.getByRole("button", {
      name: "Очистить выполненные",
    });
    fireEvent.click(clearButton);

    expect(mockOnClearCompleted).toHaveBeenCalledTimes(1);
  });

  it("правильно рассчитывает статистику для смешанных задач", () => {
    const todos: Todo[] = [
      { id: "1", text: "Задача 1", completed: false, createdAt: new Date() },
      { id: "2", text: "Задача 2", completed: true, createdAt: new Date() },
      { id: "3", text: "Задача 3", completed: false, createdAt: new Date() },
      { id: "4", text: "Задача 4", completed: true, createdAt: new Date() },
      { id: "5", text: "Задача 5", completed: true, createdAt: new Date() },
    ];

    render(<TodoStats todos={todos} onClearCompleted={mockOnClearCompleted} />);

    expect(screen.getByText(/Всего задач:/)).toBeInTheDocument();
    expect(screen.getAllByText("5")[0]).toBeInTheDocument();
    expect(screen.getByText(/Осталось:/)).toBeInTheDocument();
    expect(screen.getByText(/Выполнено:/)).toBeInTheDocument();
  });

  it("отображает статистику для одной задачи", () => {
    const todos: Todo[] = [
      {
        id: "1",
        text: "Единственная задача",
        completed: false,
        createdAt: new Date(),
      },
    ];

    render(<TodoStats todos={todos} onClearCompleted={mockOnClearCompleted} />);

    expect(screen.getByText(/Всего задач:/)).toBeInTheDocument();
    expect(screen.getAllByText("1")[0]).toBeInTheDocument();
    expect(screen.getByText(/Осталось:/)).toBeInTheDocument();
    expect(screen.getByText(/Выполнено:/)).toBeInTheDocument();
  });

  it("правильно отображает статистику при изменении статуса задач", () => {
    const { rerender } = render(
      <TodoStats
        todos={[
          { id: "1", text: "Задача", completed: false, createdAt: new Date() },
        ]}
        onClearCompleted={mockOnClearCompleted}
      />
    );

    expect(screen.getByText(/Всего задач:/)).toBeInTheDocument();
    expect(screen.getAllByText("1")[0]).toBeInTheDocument();
    expect(screen.getByText(/Осталось:/)).toBeInTheDocument();
    expect(screen.getByText(/Выполнено:/)).toBeInTheDocument();

    // Изменяем статус задачи на выполненную
    rerender(
      <TodoStats
        todos={[
          { id: "1", text: "Задача", completed: true, createdAt: new Date() },
        ]}
        onClearCompleted={mockOnClearCompleted}
      />
    );

    expect(screen.getByText(/Всего задач:/)).toBeInTheDocument();
    expect(screen.getAllByText("1")[0]).toBeInTheDocument();
    expect(screen.getByText(/Осталось:/)).toBeInTheDocument();
    expect(screen.getByText(/Выполнено:/)).toBeInTheDocument();
  });
});
