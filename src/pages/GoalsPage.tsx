import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Trash2, Loader2, Target, X, Minus, Check } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { fetchGoals, createGoal, updateGoal, deleteGoal } from '@/lib/data/goals';
import type { Goal } from '@/types';

const GOAL_BANNER = 'https://images.pexels.com/photos/584179/pexels-photo-584179.jpeg?auto=compress&cs=tinysrgb&h=400&w=1200';

const GOAL_IMAGES: { keywords: string[]; src: string }[] = [
  { keywords: ['read', 'book', 'reading', 'study', 'learn', 'learn', 'course'], src: 'https://images.pexels.com/photos/3563697/pexels-photo-3563697.jpeg?auto=compress&cs=tinysrgb&h=400&w=600' },
  { keywords: ['run', 'fitness', 'exercise', 'workout', 'gym', 'health'], src: 'https://images.pexels.com/photos/4065511/pexels-photo-4065511.jpeg?auto=compress&cs=tinysrgb&h=400&w=600' },
  { keywords: ['work', 'project', 'build', 'ship', 'code', 'develop'], src: 'https://images.pexels.com/photos/326511/pexels-photo-326511.jpeg?auto=compress&cs=tinysrgb&h=400&w=600' },
];
const DEFAULT_GOAL_IMG = 'https://images.pexels.com/photos/1109881/pexels-photo-1109881.jpeg?auto=compress&cs=tinysrgb&h=400&w=600';

function goalImage(title: string): string {
  const lower = title.toLowerCase();
  const match = GOAL_IMAGES.find((g) => g.keywords.some((k) => lower.includes(k)));
  return match?.src ?? DEFAULT_GOAL_IMG;
}

export function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [target, setTarget] = useState(1);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchGoals()
      .then(setGoals)
      .catch(() => setGoals([]))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setAdding(true);
    try {
      const created = await createGoal({
        title: title.trim(),
        description: description.trim(),
        target: Math.max(1, target),
      });
      setGoals((p) => [created, ...p]);
      setTitle('');
      setDescription('');
      setTarget(1);
      setShowForm(false);
    } finally {
      setAdding(false);
    }
  };

  const setProgress = async (goal: Goal, progress: number) => {
    const clamped = Math.max(0, Math.min(goal.target, progress));
    const completed = clamped >= goal.target;
    await updateGoal(goal.id, { progress: clamped, completed });
    setGoals((p) =>
      p.map((g) => (g.id === goal.id ? { ...g, progress: clamped, completed } : g))
    );
  };

  const remove = async (id: string) => {
    await deleteGoal(id);
    setGoals((p) => p.filter((g) => g.id !== id));
  };

  return (
    <AppShell active="goals" title="Goals" subtitle="Track progress on what matters.">
      {/* Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-6 h-40 animate-float-in">
        <img src={GOAL_BANNER} alt="Mountain summit" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f14]/70 via-[#0b0f14]/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-6">
          <h2 className="font-serif text-3xl text-white">Reach your summits.</h2>
          <p className="text-white/80 text-sm mt-1">Every big goal is just a stack of small steps.</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted">{goals.length} active goal{goals.length !== 1 ? 's' : ''}</p>
        <button onClick={() => setShowForm((s) => !s)} className="btn-primary">
          <Plus className="size-4" /> New goal
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="surface p-5 mb-6 animate-float-in">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold">New goal</h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-muted hover:text-[var(--text)]">
              <X className="size-4" />
            </button>
          </div>
          <div className="space-y-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Goal title (e.g. Read 3 books)"
              className="input"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              rows={2}
              className="input resize-none"
            />
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium whitespace-nowrap">Target steps</label>
              <input
                type="number"
                min={1}
                value={target}
                onChange={(e) => setTarget(parseInt(e.target.value) || 1)}
                className="input w-28"
              />
            </div>
            <button type="submit" disabled={adding} className="btn-primary w-full">
              {adding && <Loader2 className="size-4 animate-spin" />}
              Create goal
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted" />
        </div>
      ) : goals.length === 0 ? (
        <div className="surface p-12 text-center">
          <Target className="size-10 text-muted mx-auto mb-3" />
          <p className="text-muted">No goals yet. Set your first one to start tracking.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const pct = goal.target > 0 ? Math.round((goal.progress / goal.target) * 100) : 0;
            return (
              <div key={goal.id} className="surface overflow-hidden group animate-float-in flex flex-col">
                {/* Thumbnail */}
                <div className="relative h-32 overflow-hidden">
                  <img src={goalImage(goal.title)} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {goal.completed && (
                    <div className="absolute top-3 right-3 chip bg-[var(--primary)] text-white">
                      <Check className="size-3" /> Achieved
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate">{goal.title}</h3>
                    {goal.description && (
                      <p className="text-sm text-muted mt-0.5 line-clamp-2">{goal.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => remove(goal.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted hover:text-rose-300 p-1 shrink-0"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm mb-2">
                  <span className={goal.completed ? 'text-[var(--primary)] font-medium' : 'text-muted'}>
                    {goal.completed ? 'Completed!' : `${goal.progress} / ${goal.target}`}
                  </span>
                  <span className="text-muted">{pct}%</span>
                </div>

                <div className="h-2.5 rounded-full bg-[var(--surface-2)] overflow-hidden mb-4">
                  <div
                    className="h-full rounded-full bg-[var(--primary)] transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setProgress(goal, goal.progress - 1)}
                    disabled={goal.progress <= 0}
                    className="size-8 rounded-lg bg-[var(--surface-2)] flex items-center justify-center hover:bg-[var(--border)] disabled:opacity-40 transition-colors"
                  >
                    <Minus className="size-4" />
                  </button>
                  <button
                    onClick={() => setProgress(goal, goal.progress + 1)}
                    disabled={goal.progress >= goal.target}
                    className="size-8 rounded-lg bg-[var(--surface-2)] flex items-center justify-center hover:bg-[var(--border)] disabled:opacity-40 transition-colors"
                  >
                    <Plus className="size-4" />
                  </button>
                  <div className="flex-1 text-right">
                    {goal.completed ? (
                      <span className="chip bg-[var(--primary)]/15 text-[var(--primary)]">Done</span>
                    ) : (
                      <button
                        onClick={() => setProgress(goal, goal.target)}
                        className="text-xs text-muted hover:text-[var(--primary)] transition-colors"
                      >
                        Mark complete
                      </button>
                    )}
                  </div>
                </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
