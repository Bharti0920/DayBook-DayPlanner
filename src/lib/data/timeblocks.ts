import { api } from '@/lib/api';
import type { TimeBlock } from '@/types';

export async function fetchTimeBlocks(date: string): Promise<TimeBlock[]> {
  return api<TimeBlock[]>(`timeblocks?date=${encodeURIComponent(date)}`);
}

export async function createTimeBlock(
  payload: Omit<TimeBlock, 'id' | 'user_id' | 'created_at' | 'block_date'> & { block_date?: string }
): Promise<TimeBlock> {
  return api<TimeBlock>('timeblocks', {
    method: 'POST',
    json: { ...payload, block_date: payload.block_date ?? new Date().toISOString().slice(0, 10) },
  });
}

export async function deleteTimeBlock(id: string): Promise<void> {
  await api(`timeblocks/${id}`, { method: 'DELETE' });
}
