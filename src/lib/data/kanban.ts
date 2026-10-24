import { supabase } from '@/lib/supabase';
import type { KanbanCard } from '@/types';

export async function fetchKanbanCards(): Promise<KanbanCard[]> {
  const { data, error } = await supabase
    .from('kanban_cards')
    .select('*')
    .order('position', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createKanbanCard(
  payload: Pick<KanbanCard, 'title' | 'status' | 'description'>
): Promise<KanbanCard> {
  const { count } = await supabase
    .from('kanban_cards')
    .select('id', { count: 'exact', head: true })
    .eq('status', payload.status);
  const position = count ?? 0;
  const { data, error } = await supabase
    .from('kanban_cards')
    .insert({ title: payload.title, status: payload.status, description: payload.description, position })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateKanbanCard(
  id: string,
  patch: Partial<Pick<KanbanCard, 'title' | 'description' | 'status' | 'position'>>
): Promise<void> {
  const { error } = await supabase.from('kanban_cards').update(patch).eq('id', id);
  if (error) throw error;
}

export async function deleteKanbanCard(id: string): Promise<void> {
  const { error } = await supabase.from('kanban_cards').delete().eq('id', id);
  if (error) throw error;
}
