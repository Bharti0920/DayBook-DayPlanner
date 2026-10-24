import { supabase } from '@/lib/supabase';
import type { Goal } from '@/types';

export async function fetchGoals(): Promise<Goal[]> {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createGoal(
  payload: Pick<Goal, 'title' | 'description' | 'target'>
): Promise<Goal> {
  const { data, error } = await supabase
    .from('goals')
    .insert({ title: payload.title, description: payload.description, target: payload.target })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateGoal(
  id: string,
  patch: Partial<Pick<Goal, 'progress' | 'completed' | 'title' | 'target'>>
): Promise<void> {
  const { error } = await supabase.from('goals').update(patch).eq('id', id);
  if (error) throw error;
}

export async function deleteGoal(id: string): Promise<void> {
  const { error } = await supabase.from('goals').delete().eq('id', id);
  if (error) throw error;
}
