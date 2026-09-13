"use client";

import React, { useState, useTransition } from 'react';
import { addTodo, toggleTodo, deleteTodo } from '@/app/features/todo/actions';

type Todo = {
  id: string;
  userId: string;
  text: string;
  completed: boolean;
  createdAt: Date;
};

export default function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const [inputValue, setInputValue] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAddTodo = () => {
    if (inputValue.trim() !== "") {
      const text = inputValue.trim();
      setInputValue("");
      startTransition(async () => {
        await addTodo(text);
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isPending) {
      handleAddTodo();
    }
  };

  return (
    <>
      <div className="flex gap-3 mb-8">
        <input 
          type="text" 
          placeholder="What needs to be done?" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isPending}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        <button 
          onClick={handleAddTodo}
          disabled={isPending}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {isPending ? "Adding..." : "Add"}
        </button>
      </div>

      <ul className="space-y-3 relative">
        {isPending && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 z-10 flex items-center justify-center rounded-lg">
            <span className="text-sm text-gray-500">Updating...</span>
          </div>
        )}
        
        {initialTodos.length === 0 ? (
          <li className="text-gray-500 dark:text-gray-400 text-center py-4">
            No todos yet. Add one above!
          </li>
        ) : (
          initialTodos.map((todo) => (
            <li key={todo.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
              <input 
                type="checkbox" 
                checked={todo.completed}
                onChange={() => {
                  startTransition(async () => {
                    await toggleTodo(todo.id, !todo.completed);
                  });
                }}
                disabled={isPending}
                className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer disabled:opacity-50" 
              />
              <span className={`flex-1 ${todo.completed ? 'text-gray-500 dark:text-gray-500 line-through' : 'text-gray-700 dark:text-gray-300'}`}>
                {todo.text}
              </span>
              <button 
                onClick={() => {
                  startTransition(async () => {
                    await deleteTodo(todo.id);
                  });
                }}
                disabled={isPending}
                className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 px-3 py-1 rounded-md text-sm font-medium transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-800 disabled:opacity-50"
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </>
  );
}
