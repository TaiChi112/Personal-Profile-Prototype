import { describe, it, expect, mock, beforeEach } from "bun:test";
import React, { act } from "react";
import { render, screen, fireEvent } from "@testing-library/react";

// Mock next/cache
const mockRevalidatePath = mock();
mock.module("next/cache", () => ({
  revalidatePath: mockRevalidatePath,
}));

// Mock auth
const mockAuth = mock();
mock.module("@/auth", () => ({
  auth: mockAuth,
}));
mock.module("../../../auth", () => ({
  auth: mockAuth,
}));

// Mock prisma
const mockTodo = {
  findMany: mock(),
  create: mock(),
  update: mock(),
  delete: mock(),
};

const mockPrisma = {
  todo: mockTodo,
};

mock.module("@/lib/prisma", () => ({
  default: mockPrisma,
  prisma: mockPrisma,
}));
mock.module("../../../lib/prisma", () => ({
  default: mockPrisma,
  prisma: mockPrisma,
}));

import TodoList from "@/app/projects/(micro-apps)/todo/TodoList";

describe("TodoList Component", () => {
  beforeEach(() => {
    mockRevalidatePath.mockReset();
    mockAuth.mockReset();
    mockTodo.findMany.mockReset();
    mockTodo.create.mockReset();
    mockTodo.update.mockReset();
    mockTodo.delete.mockReset();

    mockAuth.mockResolvedValue({ user: { id: "user_test" } });
  });

  it("should render empty state message when initialTodos is empty", () => {
    render(<TodoList initialTodos={[]} />);
    expect(screen.getByText("No todos yet. Add one above!")).toBeInTheDocument();
  });

  it("should render initial todos correctly", () => {
    const todos = [
      { id: "1", userId: "u1", text: "Buy groceries", completed: false, createdAt: new Date() },
      { id: "2", userId: "u1", text: "Read a book", completed: true, createdAt: new Date() },
    ];
    render(<TodoList initialTodos={todos} />);

    expect(screen.getByText("Buy groceries")).toBeInTheDocument();
    expect(screen.getByText("Read a book")).toBeInTheDocument();
  });

  it("should trigger addTodo when typing text and clicking Add", async () => {
    mockTodo.create.mockResolvedValueOnce({ id: "t1" });
    render(<TodoList initialTodos={[]} />);

    const input = screen.getByPlaceholderText("What needs to be done?");
    const button = screen.getByText("Add");

    fireEvent.change(input, { target: { value: "New Task" } });
    await act(async () => {
      fireEvent.click(button);
    });

    expect(mockTodo.create).toHaveBeenCalledWith({
      data: {
        userId: "user_test",
        text: "New Task",
        completed: false,
      },
    });
  });

  it("should trigger addTodo on Enter key press", async () => {
    mockTodo.create.mockResolvedValueOnce({ id: "t2" });
    render(<TodoList initialTodos={[]} />);

    const input = screen.getByPlaceholderText("What needs to be done?");
    fireEvent.change(input, { target: { value: "Task on Enter" } });
    await act(async () => {
      fireEvent.keyDown(input, { key: "Enter" });
    });

    expect(mockTodo.create).toHaveBeenCalledWith({
      data: {
        userId: "user_test",
        text: "Task on Enter",
        completed: false,
      },
    });
  });

  it("should not trigger addTodo if input is empty or whitespace", async () => {
    render(<TodoList initialTodos={[]} />);

    const input = screen.getByPlaceholderText("What needs to be done?");
    const button = screen.getByText("Add");

    fireEvent.change(input, { target: { value: "   " } });
    await act(async () => {
      fireEvent.click(button);
    });

    expect(mockTodo.create).not.toHaveBeenCalled();
  });

  it("should trigger toggleTodo when checkbox is clicked", async () => {
    mockTodo.update.mockResolvedValueOnce({ id: "item-1", completed: true });
    const todos = [
      { id: "item-1", userId: "u1", text: "Task to toggle", completed: false, createdAt: new Date() },
    ];
    render(<TodoList initialTodos={todos} />);

    const checkbox = screen.getByRole("checkbox");
    await act(async () => {
      fireEvent.click(checkbox);
    });

    expect(mockTodo.update).toHaveBeenCalledWith({
      where: {
        id: "item-1",
        userId: "user_test",
      },
      data: {
        completed: true,
      },
    });
  });

  it("should trigger deleteTodo when Delete button is clicked", async () => {
    mockTodo.delete.mockResolvedValueOnce({ id: "item-2" });
    const todos = [
      { id: "item-2", userId: "u1", text: "Task to delete", completed: false, createdAt: new Date() },
    ];
    render(<TodoList initialTodos={todos} />);

    const deleteBtn = screen.getByText("Delete");
    await act(async () => {
      fireEvent.click(deleteBtn);
    });

    expect(mockTodo.delete).toHaveBeenCalledWith({
      where: {
        id: "item-2",
        userId: "user_test",
      },
    });
  });
});
