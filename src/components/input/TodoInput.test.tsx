import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TodoInput } from "./TodoInput";

describe("TodoInput", () => {
  const mockOnAdd = vi.fn();

  beforeEach(() => {
    mockOnAdd.mockClear();
  });

  it("рендерит форму ввода", () => {
    render(<TodoInput onAdd={mockOnAdd} />);

    expect(
      screen.getByPlaceholderText("Введите новую задачу...")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Добавить" })
    ).toBeInTheDocument();
  });

  it("добавляет новую задачу при отправке формы", () => {
    render(<TodoInput onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText("Введите новую задачу...");
    const button = screen.getByRole("button", { name: "Добавить" });

    fireEvent.change(input, { target: { value: "Новая задача" } });
    fireEvent.click(button);

    expect(mockOnAdd).toHaveBeenCalledWith("Новая задача");
    expect(input).toHaveValue("");
  });

  it("добавляет задачу при нажатии Enter", () => {
    render(<TodoInput onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText("Введите новую задачу...");

    fireEvent.change(input, { target: { value: "Задача с Enter" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(mockOnAdd).toHaveBeenCalledWith("Задача с Enter");
    expect(input).toHaveValue("");
  });

  it("не добавляет пустую задачу", () => {
    render(<TodoInput onAdd={mockOnAdd} />);

    const button = screen.getByRole("button", { name: "Добавить" });

    fireEvent.click(button);

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it("не добавляет задачу только с пробелами", () => {
    render(<TodoInput onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText("Введите новую задачу...");
    const button = screen.getByRole("button", { name: "Добавить" });

    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.click(button);

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it("обрезает пробелы в начале и конце", () => {
    render(<TodoInput onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText("Введите новую задачу...");
    const button = screen.getByRole("button", { name: "Добавить" });

    fireEvent.change(input, { target: { value: "  Задача с пробелами  " } });
    fireEvent.click(button);

    expect(mockOnAdd).toHaveBeenCalledWith("Задача с пробелами");
  });

  it("кнопка неактивна для пустого ввода", () => {
    render(<TodoInput onAdd={mockOnAdd} />);

    const button = screen.getByRole("button", { name: "Добавить" });

    expect(button).toBeDisabled();
  });

  it("кнопка активна при вводе текста", () => {
    render(<TodoInput onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText("Введите новую задачу...");
    const button = screen.getByRole("button", { name: "Добавить" });

    fireEvent.change(input, { target: { value: "Тестовая задача" } });

    expect(button).not.toBeDisabled();
  });
});
