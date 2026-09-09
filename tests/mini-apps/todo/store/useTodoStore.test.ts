import { expect, test, describe, beforeEach } from 'bun:test';
import { useTodoStore } from '../../../../app/features/todo/store/useTodoStore';

describe('useTodoStore', () => {
  beforeEach(() => {
    useTodoStore.setState({ todos: [] });
  });

  test('should initialize with empty todos', () => {
    const state = useTodoStore.getState();
    expect(state.todos).toEqual([]);
  });

  test('should add a new todo', () => {
    const store = useTodoStore.getState();
    store.addTodo('Test my mini-app');
    
    const updatedStore = useTodoStore.getState();
    expect(updatedStore.todos.length).toBe(1);
    expect(updatedStore.todos[0].text).toBe('Test my mini-app');
    expect(updatedStore.todos[0].completed).toBe(false);
  });

  test('should toggle todo completion status', () => {
    const store = useTodoStore.getState();
    store.addTodo('Toggle me');
    
    const todoId = useTodoStore.getState().todos[0].id;
    useTodoStore.getState().toggleTodo(todoId);
    
    expect(useTodoStore.getState().todos[0].completed).toBe(true);
    
    useTodoStore.getState().toggleTodo(todoId);
    expect(useTodoStore.getState().todos[0].completed).toBe(false);
  });

  test('should delete a todo', () => {
    const store = useTodoStore.getState();
    store.addTodo('Delete me');
    
    const todoId = useTodoStore.getState().todos[0].id;
    useTodoStore.getState().deleteTodo(todoId);
    
    expect(useTodoStore.getState().todos.length).toBe(0);
  });

  test('should set all todos', () => {
    const mockTodos = [
      { id: '1', text: 'Task 1', completed: false, createdAt: Date.now() },
      { id: '2', text: 'Task 2', completed: true, createdAt: Date.now() },
    ];
    
    useTodoStore.getState().setTodos(mockTodos);
    expect(useTodoStore.getState().todos).toEqual(mockTodos);
  });
});
