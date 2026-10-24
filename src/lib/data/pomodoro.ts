import { api } from '@/lib/api';
import type { PomodoroSession } from '@/types';

export async function fetchPomodoroSessions(): Promise<PomodoroSession[]> {
  return api<PomodoroSession[]>('pomodoro');
}

export async function logPomodoroSession(
  type: PomodoroSession['type'],
  durationMinutes: number
): Promise<void> {
  await api('pomodoro', { method: 'POST', json: { type, duration_minutes: durationMinutes } });
}
