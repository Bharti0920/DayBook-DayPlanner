import { supabase } from '@/lib/supabase';
import type { Todo } from '@/types';

export async function fetchTodos(): Promise<Todo[]> {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createTodo(
  payload: Pick<Todo, 'title' | 'priority' | 'due_date'>
): Promise<Todo> {
  const { data, error } = await supabase
    .from('todos')
    .insert({ title: payload.title, priority: payload.priority, due_date: payload.due_date })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTodo(
  id: string,
  patch: Partial<Pick<Todo, 'title' | 'completed' | 'priority' | 'due_date'>>
): Promise<void> {
  const { error } = await supabase.from('todos').update(patch).eq('id', id);
  if (error) throw error;
}

export async function deleteTodo(id: string): Promise<void> {
  const { error } = await supabase.from('todos').delete().eq('id', id);
  if (error) throw error;
}
