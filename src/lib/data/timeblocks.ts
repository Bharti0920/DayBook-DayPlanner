import { supabase } from '@/lib/supabase';
import type { TimeBlock } from '@/types';

export async function fetchTimeBlocks(date: string): Promise<TimeBlock[]> {
  const { data, error } = await supabase
    .from('timeblocks')
    .select('*')
    .eq('block_date', date)
    .order('start_time', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createTimeBlock(
  payload: Omit<TimeBlock, 'id' | 'user_id' | 'created_at' | 'block_date'> & { block_date?: string }
): Promise<TimeBlock> {
  const { data, error } = await supabase
    .from('timeblocks')
    .insert({ ...payload, block_date: payload.block_date ?? new Date().toISOString().slice(0, 10) })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTimeBlock(id: string): Promise<void> {
  const { error } = await supabase.from('timeblocks').delete().eq('id', id);
  if (error) throw error;
}
