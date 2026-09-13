"use client";
import React, { useState, useEffect, startTransition } from 'react';
import { addKanbanTask, updateKanbanTask, deleteKanbanTask } from '../actions';

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export default function KanbanBoard({ initialTasks }: { initialTasks: any[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const handleAdd = async () => {
    if (newTask.trim()) {
      const title = newTask.trim();
      setNewTask('');
      setTasks(prev => [...prev, { id: 'temp-' + Date.now(), title, status: 'todo' }]);
      await addKanbanTask(title);
    }
  };

  const handleMove = async (id: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    await updateKanbanTask(id, newStatus);
  };

  const handleDelete = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    await deleteKanbanTask(id);
  };

  const Column = ({ title, status }: { title: string, status: TaskStatus }) => (
    <div className="flex-1 bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl min-h-[500px]">
      <h2 className="font-bold text-lg mb-4 capitalize">{title}</h2>
      {status === 'todo' && (
        <div className="flex gap-2 mb-4">
          <input 
            value={newTask} 
            onChange={e => setNewTask(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="Add task..." 
            className="flex-1 px-3 py-2 rounded-lg border text-sm dark:bg-gray-700" 
          />
          <button onClick={handleAdd} className="bg-blue-500 text-white px-3 py-2 rounded-lg font-bold">+</button>
        </div>
      )}
      <div className="space-y-3">
        {tasks.filter(t => t.status === status).map(task => (
          <div key={task.id} className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-sm border dark:border-gray-600">
            <p className="font-medium mb-3">{task.title}</p>
            <div className="flex justify-between items-center text-xs">
              <button onClick={() => handleDelete(task.id)} className="text-red-500 font-bold hover:underline">Delete</button>
              <div className="flex gap-2">
                {status !== 'todo' && <button onClick={() => handleMove(task.id, status === 'done' ? 'in-progress' : 'todo')} className="text-blue-500 hover:underline">← Move</button>}
                {status !== 'done' && <button onClick={() => handleMove(task.id, status === 'todo' ? 'in-progress' : 'done')} className="text-blue-500 hover:underline">Move →</button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <Column title="Todo" status="todo" />
      <Column title="In Progress" status="in-progress" />
      <Column title="Done" status="done" />
    </div>
  );
}
