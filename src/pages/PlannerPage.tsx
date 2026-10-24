import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Trash2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { fetchTimeBlocks, createTimeBlock, deleteTimeBlock } from '@/lib/data/timeblocks';
import type { TimeBlock } from '@/types';
import { CATEGORY_META } from '@/types';

function fmt(date: Date) {
  return date.toISOString().slice(0, 10);
}

function shiftDate(dateStr: string, days: number) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return fmt(d);
}

const HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 7am - 9pm

export function PlannerPage() {
  const today = fmt(new Date());
  const [date, setDate] = useState(today);
  const [blocks, setBlocks] = useState<TimeBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [category, setCategory] = useState<TimeBlock['category']>('work');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchTimeBlocks(date)
      .then(setBlocks)
      .catch(() => setBlocks([]))
      .finally(() => setLoading(false));
  }, [date]);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setAdding(true);
    try {
      const created = await createTimeBlock({
        title: title.trim(),
        start_time: startTime,
        end_time: endTime,
        category,
        block_date: date,
      });
      setBlocks((p) =>
        [...p, created].sort((a, b) => a.start_time.localeCompare(b.start_time))
      );
      setTitle('');
    } finally {
      setAdding(false);
    }
  };

  const remove = async (id: string) => {
    await deleteTimeBlock(id);
    setBlocks((p) => p.filter((b) => b.id !== id));
  };

  const dateLabel = new Date(date + 'T00:00:00').toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <AppShell active="planner" title="Day Planner" subtitle="Plan your day with time blocking.">
      {/* Date nav */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDate(shiftDate(date, -1))}
            className="size-9 rounded-xl bg-[var(--surface)] flex items-center justify-center hover:bg-[var(--surface-2)] transition-colors"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="font-semibold min-w-[200px] text-center">{dateLabel}</span>
          <button
            onClick={() => setDate(shiftDate(date, 1))}
            className="size-9 rounded-xl bg-[var(--surface)] flex items-center justify-center hover:bg-[var(--surface-2)] transition-colors"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
        <button
          onClick={() => setDate(today)}
          className="btn-ghost text-sm"
        >
          Today
        </button>
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} className="surface p-4 mb-6 grid sm:grid-cols-5 gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What are you working on?"
          className="input sm:col-span-2"
        />
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="input"
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="input"
        />
        <div className="flex gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as TimeBlock['category'])}
            className="input flex-1"
          >
            <option value="work">Work</option>
            <option value="study">Study</option>
            <option value="personal">Personal</option>
            <option value="break">Break</option>
          </select>
          <button type="submit" disabled={adding} className="btn-primary px-3">
            {adding ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          </button>
        </div>
      </form>

      {/* Timeline */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted" />
        </div>
      ) : blocks.length === 0 ? (
        <div className="surface p-12 text-center text-muted">
          No blocks planned for this day. Add your first one above.
        </div>
      ) : (
        <div className="surface p-2 sm:p-4">
          {HOURS.map((hour) => {
            const hourStr = String(hour).padStart(2, '0') + ':00';
            const hourBlocks = blocks.filter((b) => {
              const bh = parseInt(b.start_time.slice(0, 2));
              return bh === hour;
            });
            return (
              <div key={hour} className="flex gap-3 min-h-[56px] border-b border-[var(--border)] last:border-0">
                <div className="w-12 shrink-0 pt-2 text-xs text-muted tabular-nums">
                  {hour % 12 === 0 ? 12 : hour % 12} {hour < 12 ? 'AM' : 'PM'}
                </div>
                <div className="flex-1 py-1.5 space-y-2">
                  {hourBlocks.map((b) => {
                    const meta = CATEGORY_META[b.category];
                    return (
                      <div
                        key={b.id}
                        className={`rounded-xl px-3 py-2 flex items-center justify-between group ${meta.color} border border-[var(--border)] animate-float-in`}
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{b.title}</p>
                          <p className="text-xs opacity-80">
                            {b.start_time} – {b.end_time}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="chip bg-white/60 text-xs">
                            <span className={`size-1.5 rounded-full ${meta.dot}`} />
                            {meta.label}
                          </span>
                          <button
                            onClick={() => remove(b.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted hover:text-rose-300 p-1"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
