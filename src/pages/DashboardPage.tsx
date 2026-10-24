import { useEffect, useState } from 'react';
import {
  ListTodo,
  KanbanSquare,
  Timer,
  Target,
  StickyNote,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { useRouter, type Route } from '@/context/RouterContext';
import { fetchTodos } from '@/lib/data/todos';
import { fetchKanbanCards } from '@/lib/data/kanban';
import { fetchPomodoroSessions } from '@/lib/data/pomodoro';
import { fetchGoals } from '@/lib/data/goals';
import { fetchNotes } from '@/lib/data/notes';

export function DashboardPage() {
  const { navigate } = useRouter();
  const [stats, setStats] = useState<{
    todosDone: number;
    todosTotal: number;
    kanbanDone: number;
    kanbanTotal: number;
    focusMinutes: number;
    goalsDone: number;
    goalsTotal: number;
    notes: number;
  } | null>(null);

  useEffect(() => {
    Promise.all([
      fetchTodos(),
      fetchKanbanCards(),
      fetchPomodoroSessions(),
      fetchGoals(),
      fetchNotes(),
    ])
      .then(([todos, cards, sessions, goals, notes]) => {
        setStats({
          todosDone: todos.filter((t) => t.completed).length,
          todosTotal: todos.length,
          kanbanDone: cards.filter((c) => c.status === 'done').length,
          kanbanTotal: cards.length,
          focusMinutes: sessions
            .filter((s) => s.type === 'focus')
            .reduce((sum, s) => sum + s.duration_minutes, 0),
          goalsDone: goals.filter((g) => g.completed).length,
          goalsTotal: goals.length,
          notes: notes.length,
        });
      })
      .catch(() => setStats(null));
  }, []);

  const cards: {
    label: string;
    value: string;
    sub: string;
    icon: typeof ListTodo;
    route: Route;
    accent: string;
  }[] = [
    {
      label: 'Tasks',
      value: stats ? `${stats.todosDone}/${stats.todosTotal}` : '—',
      sub: 'completed',
      icon: ListTodo,
      route: 'todos',
      accent: 'text-[#214f43]',
    },
    {
      label: 'Kanban',
      value: stats ? `${stats.kanbanDone}/${stats.kanbanTotal}` : '—',
      sub: 'done cards',
      icon: KanbanSquare,
      route: 'kanban',
      accent: 'text-[#477a78]',
    },
    {
      label: 'Focus Time',
      value: stats ? `${stats.focusMinutes}m` : '—',
      sub: 'logged today',
      icon: Timer,
      route: 'pomodoro',
      accent: 'text-[#a36c3e]',
    },
    {
      label: 'Goals',
      value: stats ? `${stats.goalsDone}/${stats.goalsTotal}` : '—',
      sub: 'achieved',
      icon: Target,
      route: 'goals',
      accent: 'text-[#786777]',
    },
  ];

  const quickLinks: { label: string; icon: typeof ListTodo; route: Route }[] = [
    { label: 'Add a task', icon: ListTodo, route: 'todos' },
    { label: 'Open board', icon: KanbanSquare, route: 'kanban' },
    { label: 'Start focus', icon: Timer, route: 'pomodoro' },
    { label: 'Plan your day', icon: StickyNote, route: 'planner' },
    { label: 'Review goals', icon: Target, route: 'goals' },
    { label: 'Jot a note', icon: StickyNote, route: 'notes' },
  ];

  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());
  return (
    <AppShell active="dashboard" title="Your day" subtitle="A little structure for everything that matters.">
      <section className="rounded-[2rem] bg-[#fffdfa] border border-[#e7e2db] p-7 sm:p-10 mb-5 shadow-[0_8px_25px_rgba(65,55,40,0.04)] animate-float-in">
        <p className="text-xs uppercase tracking-[0.26em] text-[#938d83] mb-6">{today}</p>
        <h2 className="font-serif text-5xl sm:text-7xl leading-[0.92] tracking-tight">
          A good day starts
          <br />
          <em>with one clear thing.</em>
        </h2>
        <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[#817b72]">
          <span className="font-medium text-[#2c302b]">{stats ? `${stats.todosTotal - stats.todosDone} open tasks` : 'Your open tasks'}</span>
          <span className="text-[#c3beb5]">/</span>
          <span>{stats ? `${stats.focusMinutes} minutes focused` : 'Your focus time'}</span>
        </div>
      </section>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <button
              key={c.label}
              onClick={() => navigate(c.route)}
              className="surface p-5 sm:p-6 text-left rounded-[1.5rem] hover:border-[#214f43]/40 transition-colors animate-float-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className={`size-5 ${c.accent}`} />
                <ArrowRight className="size-4 text-muted" />
              </div>
              <p className="text-2xl font-bold">{c.value}</p>
              <p className="text-sm text-muted">
                {c.label} · {c.sub}
              </p>
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="surface p-6 lg:col-span-2 rounded-[1.5rem] animate-float-in">
          <p className="text-xs uppercase tracking-[0.24em] text-[#938d83] mb-2">Make some room</p>
          <h2 className="font-serif text-3xl mb-5">Quick actions</h2>
          {!stats ? (
            <div className="flex justify-center py-8">
              <Loader2 className="size-5 animate-spin text-muted" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-2">
              {quickLinks.map((q) => {
                const Icon = q.icon;
                return (
                  <button
                    key={q.label}
                    onClick={() => navigate(q.route)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-[#f1eee8] hover:bg-[#e8e1d7] transition-colors text-left"
                  >
                    <Icon className="size-4 text-[#214f43]" />
                    <span className="text-sm font-medium">{q.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="surface p-6 rounded-[1.5rem] animate-float-in">
          <p className="text-xs uppercase tracking-[0.24em] text-[#938d83] mb-4">Your next gentle step</p>
          <h2 className="font-serif text-3xl leading-snug">
            Give every hour a job before it picks one.
          </h2>
          <button
            onClick={() => navigate('planner')}
            className="mt-6 inline-flex items-center gap-2 text-sm text-[#214f43] hover:gap-3 transition-all"
          >
            Plan your day <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </AppShell>
  );
}
