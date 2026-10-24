import { api } from '@/lib/api';
import type { Todo } from '@/types';

export async function fetchTodos(): Promise<Todo[]> {
  return api<Todo[]>('todos');
}

export async function createTodo(
  payload: Pick<Todo, 'title' | 'priority' | 'due_date'>
): Promise<Todo> {
  return api<Todo>('todos', { method: 'POST', json: payload });
}

export async function updateTodo(
  id: string,
  patch: Partial<Pick<Todo, 'title' | 'completed' | 'priority' | 'due_date'>>
): Promise<void> {
  await api(`todos/${id}`, { method: 'PATCH', json: patch });
}

export async function deleteTodo(id: string): Promise<void> {
  await api(`todos/${id}`, { method: 'DELETE' });
}
