import { api } from '@/lib/api';
import type { Goal } from '@/types';

export async function fetchGoals(): Promise<Goal[]> {
  return api<Goal[]>('goals');
}

export async function createGoal(
  payload: Pick<Goal, 'title' | 'description' | 'target'>
): Promise<Goal> {
  return api<Goal>('goals', { method: 'POST', json: payload });
}

export async function updateGoal(
  id: string,
  patch: Partial<Pick<Goal, 'progress' | 'completed' | 'title' | 'target'>>
): Promise<void> {
  await api(`goals/${id}`, { method: 'PATCH', json: patch });
}

export async function deleteGoal(id: string): Promise<void> {
  await api(`goals/${id}`, { method: 'DELETE' });
}
