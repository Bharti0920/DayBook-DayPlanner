export type Todo = {
  id: string;
  user_id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  created_at: string;
};

export type KanbanCard = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  position: number;
  created_at: string;
};

export type PomodoroSession = {
  id: string;
  user_id: string;
  type: 'focus' | 'short_break' | 'long_break';
  duration_minutes: number;
  completed_at: string;
};

export type TimeBlock = {
  id: string;
  user_id: string;
  block_date: string;
  title: string;
  start_time: string;
  end_time: string;
  category: 'work' | 'study' | 'personal' | 'break';
  created_at: string;
};

export type Goal = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  completed: boolean;
  created_at: string;
};

export type Note = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  color: string;
  created_at: string;
  updated_at: string;
};

export const KANBAN_COLUMNS = [
  { id: 'todo', label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
] as const;

export const PRIORITY_META = {
  low: { label: 'Low', color: 'text-sky-300', dot: 'bg-sky-400' },
  medium: { label: 'Medium', color: 'text-amber-300', dot: 'bg-amber-400' },
  high: { label: 'High', color: 'text-rose-300', dot: 'bg-rose-400' },
} as const;

export const CATEGORY_META = {
  work: { label: 'Work', color: 'bg-sky-500/15 text-sky-300', dot: 'bg-sky-400' },
  study: { label: 'Study', color: 'bg-violet-500/15 text-violet-300', dot: 'bg-violet-400' },
  personal: { label: 'Personal', color: 'bg-emerald-500/15 text-emerald-300', dot: 'bg-emerald-400' },
  break: { label: 'Break', color: 'bg-amber-500/15 text-amber-300', dot: 'bg-amber-400' },
} as const;

export const NOTE_COLORS = [
  { id: 'amber', bg: 'bg-amber-400/10', border: 'border-amber-400/30', dot: 'bg-amber-400' },
  { id: 'emerald', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30', dot: 'bg-emerald-400' },
  { id: 'sky', bg: 'bg-sky-400/10', border: 'border-sky-400/30', dot: 'bg-sky-400' },
  { id: 'rose', bg: 'bg-rose-400/10', border: 'border-rose-400/30', dot: 'bg-rose-400' },
  { id: 'violet', bg: 'bg-violet-400/10', border: 'border-violet-400/30', dot: 'bg-violet-400' },
] as const;
