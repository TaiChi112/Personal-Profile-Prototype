"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useTodoStore } from '@/app/features/todo/store/useTodoStore';
import { useSession, signIn } from 'next-auth/react';
import { syncTodosToCloud, fetchCloudTodos } from '@/app/features/todo/actions';

export default function TodoMiniApp() {
  const { todos, addTodo, toggleTodo, deleteTodo, setTodos } = useTodoStore();
  const [inputValue, setInputValue] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const { status } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddTodo = () => {
    if (inputValue.trim() !== "") {
      addTodo(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  const handleSync = async () => {
    if (status === 'unauthenticated') {
      signIn('google');
      return;
    }

    if (status === 'authenticated') {
      try {
        setIsSyncing(true);
        // Map local format to cloud format (Date vs number)
        const cloudFormatTodos = todos.map(t => ({
          ...t,
          createdAt: new Date(t.createdAt).toISOString(),
        }));
        
        await syncTodosToCloud(cloudFormatTodos);
        
        // Fetch back from cloud
        const cloudTodos = await fetchCloudTodos();
        
        // Map back to local format
        const localFormatTodos = cloudTodos.map(t => ({
          ...t,
          createdAt: new Date(t.createdAt).getTime(),
        }));
        
        setTodos(localFormatTodos);
        
        alert('Successfully synced to cloud!');
      } catch (error) {
        console.error('Failed to sync:', error);
        alert('Failed to sync. Please try again.');
      } finally {
        setIsSyncing(false);
      }
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <Link 
            href="/projects" 
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center gap-2"
          >
            &larr; Back to Projects
          </Link>
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isSyncing ? "Syncing..." : "☁️ Sync to Cloud"}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Todo Mini-App
          </h1>

          <div className="flex gap-3 mb-8">
            <input 
              type="text" 
              placeholder="What needs to be done?" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={handleAddTodo}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Add
            </button>
          </div>

          <ul className="space-y-3">
            {todos.length === 0 ? (
              <li className="text-gray-500 dark:text-gray-400 text-center py-4">
                No todos yet. Add one above!
              </li>
            ) : (
              todos.map((todo) => (
                <li key={todo.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                  <input 
                    type="checkbox" 
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer" 
                  />
                  <span className={`flex-1 ${todo.completed ? 'text-gray-500 dark:text-gray-500 line-through' : 'text-gray-700 dark:text-gray-300'}`}>
                    {todo.text}
                  </span>
                  <button 
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 px-3 py-1 rounded-md text-sm font-medium transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-800"
                  >
                    Delete
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
