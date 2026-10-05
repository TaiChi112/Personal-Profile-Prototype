import { describe, it, expect, mock, beforeEach } from 'bun:test';
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';

const mockAuth = mock();
mock.module('@/auth', () => ({
  auth: mockAuth,
}));

const mockRevalidatePath = mock();
mock.module('next/cache', () => ({
  revalidatePath: mockRevalidatePath,
}));

const mockKanbanRepository = {
  getTasks: mock(),
  addTask: mock(),
  updateTask: mock(),
  deleteTask: mock(),
};

mock.module('@/lib/repositories/kanban.repository', () => ({
  KanbanRepository: mockKanbanRepository,
}));

mock.module('@/app/components/onboarding/OnboardingWrapper', () => ({
  OnboardingWrapper: ({ children, appId, appName }: any) => (
    <div data-testid="onboarding-wrapper" data-app-id={appId} data-app-name={appName}>
      {children}
    </div>
  ),
}));

import Page from '@/app/projects/(micro-apps)/kanban/page';
import KanbanBoard from '@/app/projects/(micro-apps)/kanban/components/KanbanBoard';

describe('Kanban Page and Board UI Component Suite', () => {
  beforeEach(() => {
    mockAuth.mockReset();
    mockRevalidatePath.mockReset();
    mockKanbanRepository.getTasks.mockReset();
    mockKanbanRepository.addTask.mockReset();
    mockKanbanRepository.updateTask.mockReset();
    mockKanbanRepository.deleteTask.mockReset();
  });

  it('should render login prompt when session is null', async () => {
    mockAuth.mockResolvedValue(null);

    const PageElement = await Page();
    const { getByText, getByRole } = render(PageElement);

    expect(getByText('Kanban Board', { exact: false })).toBeInTheDocument();
    expect(getByText('Please login to manage your tasks.')).toBeInTheDocument();

    const loginLink = getByRole('link', { name: 'Login with Google' });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.getAttribute('href')).toBe('/api/auth/signin?callbackUrl=/projects/kanban');
    expect(mockKanbanRepository.getTasks).not.toHaveBeenCalled();
  });

  it('should render Page with KanbanBoard for authenticated user', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-kb-1', email: 'kb@test.com' } });
    mockKanbanRepository.getTasks.mockResolvedValue([
      { id: 't1', title: 'Task in Todo', status: 'todo' },
      { id: 't2', title: 'Task in Progress', status: 'in-progress' },
      { id: 't3', title: 'Task in Done', status: 'done' },
    ]);

    const PageElement = await Page();
    const { getByText, getByTestId } = render(PageElement);

    expect(mockKanbanRepository.getTasks).toHaveBeenCalledTimes(1);
    expect(getByTestId('onboarding-wrapper')).toBeInTheDocument();
    expect(getByText('Task in Todo')).toBeInTheDocument();
    expect(getByText('Task in Progress')).toBeInTheDocument();
    expect(getByText('Task in Done')).toBeInTheDocument();
  });

  it('should support adding, moving, and deleting tasks in KanbanBoard', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-kb-1' } });
    mockKanbanRepository.addTask.mockResolvedValue({ id: 'new-id', title: 'My New Todo Item', status: 'todo' });
    mockKanbanRepository.updateTask.mockResolvedValue({ id: 't1', status: 'in-progress' });
    mockKanbanRepository.deleteTask.mockResolvedValue({ id: 't1' });

    const initialTasks = [
      { id: 't1', title: 'First Task', status: 'todo' },
      { id: 't2', title: 'Second Task', status: 'in-progress' },
    ];

    const { getByPlaceholderText, getByText, getAllByText, queryByText } = render(
      <KanbanBoard initialTasks={initialTasks} />
    );

    // 1. Add task
    const input = getByPlaceholderText('Add task...');

    act(() => {
      fireEvent.change(input, { target: { value: 'My New Todo Item' } });
    });

    const addBtn = getByText('+');
    await act(async () => {
      fireEvent.click(addBtn);
    });

    expect(getByText('My New Todo Item')).toBeInTheDocument();
    expect(mockKanbanRepository.addTask).toHaveBeenCalledWith('user-kb-1', 'My New Todo Item');

    // 2. Move First Task from todo -> in-progress
    const moveForwardButtons = getAllByText('Move →');
    await act(async () => {
      fireEvent.click(moveForwardButtons[0]);
    });
    expect(mockKanbanRepository.updateTask).toHaveBeenCalledWith('user-kb-1', 't1', 'in-progress');

    // 3. Delete Task
    const deleteButtons = getAllByText('Delete');
    await act(async () => {
      fireEvent.click(deleteButtons[0]);
    });
    expect(mockKanbanRepository.deleteTask).toHaveBeenCalled();
    expect(queryByText('My New Todo Item')).toBeNull();
  });

  it('should support adding task via Enter key and moving task backwards', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-kb-1' } });
    mockKanbanRepository.addTask.mockResolvedValue({ id: 'enter-task', title: 'Task via Enter', status: 'todo' });
    mockKanbanRepository.updateTask.mockResolvedValue({ id: 'done-task', status: 'in-progress' });

    const initialTasks = [
      { id: 'prog-task', title: 'Task In Prog', status: 'in-progress' },
      { id: 'done-task', title: 'Task in Done', status: 'done' },
    ];

    const { getByPlaceholderText, getByText, getAllByText, rerender } = render(
      <KanbanBoard initialTasks={initialTasks} />
    );

    const input = getByPlaceholderText('Add task...');

    // Ignore empty/whitespace input on Enter
    act(() => {
      fireEvent.change(getByPlaceholderText('Add task...'), { target: { value: '   ' } });
    });
    act(() => {
      fireEvent.keyDown(getByPlaceholderText('Add task...'), { key: 'Enter' });
    });
    expect(mockKanbanRepository.addTask).not.toHaveBeenCalled();

    // Valid input on Enter
    act(() => {
      fireEvent.change(getByPlaceholderText('Add task...'), { target: { value: 'Task via Enter' } });
    });
    await act(async () => {
      fireEvent.keyDown(getByPlaceholderText('Add task...'), { key: 'Enter' });
    });
    expect(getByText('Task via Enter')).toBeInTheDocument();
    expect(mockKanbanRepository.addTask).toHaveBeenCalledWith('user-kb-1', 'Task via Enter');

    // Move backward from in-progress -> todo
    await act(async () => {
      fireEvent.click(getAllByText('← Move')[0]);
    });
    expect(mockKanbanRepository.updateTask).toHaveBeenCalledWith('user-kb-1', 'prog-task', 'todo');

    // Move backward from done -> in-progress
    await act(async () => {
      fireEvent.click(getByText('← Move'));
    });
    expect(mockKanbanRepository.updateTask).toHaveBeenCalledWith('user-kb-1', 'done-task', 'in-progress');

    // Rerender with new initialTasks triggers useEffect
    rerender(<KanbanBoard initialTasks={[{ id: 'updated-1', title: 'Updated List', status: 'todo' }]} />);
    expect(getByText('Updated List')).toBeInTheDocument();
  });
});
