import { supabase } from '@/lib/supabase';
import type { Note } from '@/types';

export async function fetchNotes(): Promise<Note[]> {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createNote(
  payload: Pick<Note, 'title' | 'content' | 'color'>
): Promise<Note> {
  const { data, error } = await supabase
    .from('notes')
    .insert({ title: payload.title, content: payload.content, color: payload.color })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateNote(
  id: string,
  patch: Partial<Pick<Note, 'title' | 'content' | 'color'>>
): Promise<void> {
  const { error } = await supabase.from('notes').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}

export async function deleteNote(id: string): Promise<void> {
  const { error } = await supabase.from('notes').delete().eq('id', id);
  if (error) throw error;
}
