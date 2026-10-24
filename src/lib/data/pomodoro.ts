import { supabase } from '@/lib/supabase';
import type { PomodoroSession } from '@/types';

export async function fetchPomodoroSessions(): Promise<PomodoroSession[]> {
  const { data, error } = await supabase
    .from('pomodoro_sessions')
    .select('*')
    .order('completed_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data ?? [];
}

export async function logPomodoroSession(
  type: PomodoroSession['type'],
  durationMinutes: number
): Promise<void> {
  const { error } = await supabase
    .from('pomodoro_sessions')
    .insert({ type, duration_minutes: durationMinutes });
  if (error) throw error;
}
