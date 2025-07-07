import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TodoItem } from "./TodoItem";
import type { Todo } from "../../types/todo";

describe("TodoItem", () => {
  const mockOnToggle = vi.fn();
  const mockOnDelete = vi.fn();

  const mockTodo: Todo = {
    id: "1",
    text: "Тестовая задача",
    completed: false,
    createdAt: new Date("2024-01-01"),
  };

  const mockCompletedTodo: Todo = {
    id: "2",
    text: "Выполненная задача",
    completed: true,
    createdAt: new Date("2024-01-01"),
  };

  beforeEach(() => {
    mockOnToggle.mockClear();
    mockOnDelete.mockClear();
  });

  it("рендерит невыполненную задачу", () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Тестовая задача")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    expect(
      screen.getByRole("button", { name: "Удалить задачу" })
    ).toBeInTheDocument();
  });

  it("рендерит выполненную задачу", () => {
    render(
      <TodoItem
        todo={mockCompletedTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Выполненная задача")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("вызывает onToggle при клике на чекбокс", () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(mockOnToggle).toHaveBeenCalledWith("1");
  });

  it("вызывает onDelete при клике на кнопку удаления", () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByRole("button", { name: "Удалить задачу" });
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith("1");
  });

  it("применяет стили для выполненной задачи", () => {
    render(
      <TodoItem
        todo={mockCompletedTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    const textElement = screen.getByText("Выполненная задача");
    expect(textElement.className).toContain("completed");
  });

  it("не применяет стили completed для невыполненной задачи", () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    const textElement = screen.getByText("Тестовая задача");
    expect(textElement.className).not.toContain("completed");
  });

  it("отображает правильный текст задачи", () => {
    const longTextTodo: Todo = {
      id: "3",
      text: "Очень длинный текст задачи для проверки отображения",
      completed: false,
      createdAt: new Date("2024-01-01"),
    };

    render(
      <TodoItem
        todo={longTextTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    expect(
      screen.getByText("Очень длинный текст задачи для проверки отображения")
    ).toBeInTheDocument();
  });

  it("имеет правильные атрибуты доступности", () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByRole("button", { name: "Удалить задачу" });
    expect(deleteButton).toHaveAttribute("aria-label", "Удалить задачу");
  });
});
