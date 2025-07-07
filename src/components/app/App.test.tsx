import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

// Мокаем localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("App Integration Tests", () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
    vi.clearAllMocks();
  });

  it("рендерит основное приложение", () => {
    render(<App />);

    expect(screen.getByText("Список дел")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Введите новую задачу...")
    ).toBeInTheDocument();
    expect(screen.getByText(/Всего задач:/)).toBeInTheDocument();
  });

  it("добавляет новую задачу", async () => {
    render(<App />);

    const input = screen.getByPlaceholderText("Введите новую задачу...");
    const addButton = screen.getByRole("button", { name: "Добавить" });

    fireEvent.change(input, { target: { value: "Новая тестовая задача" } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Новая тестовая задача")).toBeInTheDocument();
    });

    expect(screen.getByText(/Всего задач:/)).toBeInTheDocument();
    expect(screen.getAllByText("1")[0]).toBeInTheDocument();
    expect(screen.getByText(/Осталось:/)).toBeInTheDocument();
  });

  it("отмечает задачу как выполненную", async () => {
    render(<App />);

    // Добавляем задачу
    const input = screen.getByPlaceholderText("Введите новую задачу...");
    const addButton = screen.getByRole("button", { name: "Добавить" });

    fireEvent.change(input, { target: { value: "Задача для выполнения" } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Задача для выполнения")).toBeInTheDocument();
    });

    // Отмечаем как выполненную
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(checkbox).toBeChecked();
    });

    expect(screen.getByText(/Всего задач:/)).toBeInTheDocument();
    expect(screen.getAllByText("1")[0]).toBeInTheDocument();
    expect(screen.getByText(/Осталось:/)).toBeInTheDocument();
    expect(screen.getByText(/Выполнено:/)).toBeInTheDocument();
  });

  it("удаляет задачу", async () => {
    render(<App />);

    // Добавляем задачу
    const input = screen.getByPlaceholderText("Введите новую задачу...");
    const addButton = screen.getByRole("button", { name: "Добавить" });

    fireEvent.change(input, { target: { value: "Задача для удаления" } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Задача для удаления")).toBeInTheDocument();
    });

    // Удаляем задачу
    const deleteButton = screen.getByRole("button", { name: "Удалить задачу" });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText("Задача для удаления")).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Всего задач:/)).toBeInTheDocument();
    expect(screen.getAllByText("0")[0]).toBeInTheDocument();
  });

  it("фильтрует задачи", async () => {
    render(<App />);

    // Добавляем несколько задач
    const input = screen.getByPlaceholderText("Введите новую задачу...");
    const addButton = screen.getByRole("button", { name: "Добавить" });

    // Первая задача (активная)
    fireEvent.change(input, { target: { value: "Активная задача" } });
    fireEvent.click(addButton);

    // Вторая задача (выполненная)
    fireEvent.change(input, { target: { value: "Выполненная задача" } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Активная задача")).toBeInTheDocument();
      expect(screen.getByText("Выполненная задача")).toBeInTheDocument();
    });

    // Отмечаем вторую задачу как выполненную
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]); // Вторая задача

    await waitFor(() => {
      expect(checkboxes[1]).toBeChecked();
    });

    // Проверяем фильтр "Активные"
    const activeFilter = screen.getByRole("button", { name: "Активные" });
    fireEvent.click(activeFilter);

    await waitFor(() => {
      expect(screen.getByText("Активная задача")).toBeInTheDocument();
      expect(screen.queryByText("Выполненная задача")).not.toBeInTheDocument();
    });

    // Проверяем фильтр "Выполненные"
    const completedFilter = screen.getByRole("button", { name: "Выполненные" });
    fireEvent.click(completedFilter);

    await waitFor(() => {
      expect(screen.queryByText("Активная задача")).not.toBeInTheDocument();
      expect(screen.getByText("Выполненная задача")).toBeInTheDocument();
    });
  });

  it("очищает выполненные задачи", async () => {
    render(<App />);

    // Добавляем задачи
    const input = screen.getByPlaceholderText("Введите новую задачу...");
    const addButton = screen.getByRole("button", { name: "Добавить" });

    fireEvent.change(input, { target: { value: "Активная задача" } });
    fireEvent.click(addButton);

    fireEvent.change(input, { target: { value: "Выполненная задача" } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Активная задача")).toBeInTheDocument();
      expect(screen.getByText("Выполненная задача")).toBeInTheDocument();
    });

    // Отмечаем вторую задачу как выполненную
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]);

    await waitFor(() => {
      expect(checkboxes[1]).toBeChecked();
    });

    // Очищаем выполненные
    const clearButton = screen.getByRole("button", {
      name: "Очистить выполненные",
    });
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(screen.getByText("Активная задача")).toBeInTheDocument();
      expect(screen.queryByText("Выполненная задача")).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Всего задач:/)).toBeInTheDocument();
    expect(screen.getAllByText("1")[0]).toBeInTheDocument();
    expect(screen.getByText(/Осталось:/)).toBeInTheDocument();
  });

  it("сохраняет задачи в localStorage", async () => {
    render(<App />);

    const input = screen.getByPlaceholderText("Введите новую задачу...");
    const addButton = screen.getByRole("button", { name: "Добавить" });

    fireEvent.change(input, { target: { value: "Тестовая задача" } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });

  it("загружает задачи из localStorage", () => {
    const savedTodos = JSON.stringify([
      {
        id: "1",
        text: "Сохраненная задача",
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ]);

    localStorageMock.getItem.mockReturnValue(savedTodos);

    render(<App />);

    expect(screen.getByText("Сохраненная задача")).toBeInTheDocument();
    expect(screen.getByText(/Всего задач:/)).toBeInTheDocument();
    expect(screen.getAllByText("1")[0]).toBeInTheDocument();
  });

  it("не добавляет пустые задачи", async () => {
    render(<App />);

    const addButton = screen.getByRole("button", { name: "Добавить" });

    // Кнопка должна быть неактивна
    expect(addButton).toBeDisabled();

    fireEvent.click(addButton);

    expect(screen.getByText(/Всего задач:/)).toBeInTheDocument();
    expect(screen.getAllByText("0")[0]).toBeInTheDocument();
  });
});
