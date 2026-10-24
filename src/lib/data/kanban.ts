import { api } from '@/lib/api';
import type { KanbanCard } from '@/types';

export async function fetchKanbanCards(): Promise<KanbanCard[]> {
  return api<KanbanCard[]>('kanban');
}

export async function createKanbanCard(
  payload: Pick<KanbanCard, 'title' | 'status' | 'description'>
): Promise<KanbanCard> {
  return api<KanbanCard>('kanban', { method: 'POST', json: payload });
}

export async function updateKanbanCard(
  id: string,
  patch: Partial<Pick<KanbanCard, 'title' | 'description' | 'status' | 'position'>>
): Promise<void> {
  await api(`kanban/${id}`, { method: 'PATCH', json: patch });
}

export async function deleteKanbanCard(id: string): Promise<void> {
  await api(`kanban/${id}`, { method: 'DELETE' });
}
