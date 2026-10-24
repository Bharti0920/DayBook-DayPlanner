import { api } from '@/lib/api';
import type { Note } from '@/types';

export async function fetchNotes(): Promise<Note[]> {
  return api<Note[]>('notes');
}

export async function createNote(
  payload: Pick<Note, 'title' | 'content' | 'color'>
): Promise<Note> {
  return api<Note>('notes', { method: 'POST', json: payload });
}

export async function updateNote(
  id: string,
  patch: Partial<Pick<Note, 'title' | 'content' | 'color'>>
): Promise<void> {
  await api(`notes/${id}`, { method: 'PATCH', json: patch });
}

export async function deleteNote(id: string): Promise<void> {
  await api(`notes/${id}`, { method: 'DELETE' });
}
