import { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, Loader2 } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { fetchPomodoroSessions, logPomodoroSession } from '@/lib/data/pomodoro';
import type { PomodoroSession } from '@/types';

type Mode = 'focus' | 'short_break' | 'long_break';

const MODES: Record<Mode, { label: string; minutes: number; icon: typeof Brain; color: string }> = {
  focus: { label: 'Focus', minutes: 25, icon: Brain, color: 'text-emerald-300' },
  short_break: { label: 'Short Break', minutes: 5, icon: Coffee, color: 'text-sky-300' },
  long_break: { label: 'Long Break', minutes: 15, icon: Coffee, color: 'text-violet-300' },
};

export function PomodoroPage() {
  const [mode, setMode] = useState<Mode>('focus');
  const [secondsLeft, setSecondsLeft] = useState(MODES.focus.minutes * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    fetchPomodoroSessions()
      .then(setSessions)
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            window.clearInterval(intervalRef.current!);
            handleComplete();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const handleComplete = async () => {
    setRunning(false);
    try {
      await logPomodoroSession(mode, MODES[mode].minutes);
      const fresh = await fetchPomodoroSessions();
      setSessions(fresh);
    } catch {
      /* ignore */
    }
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setSecondsLeft(MODES[m].minutes * 60);
    setRunning(false);
  };

  const reset = () => {
    setSecondsLeft(MODES[mode].minutes * 60);
    setRunning(false);
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');
  const total = MODES[mode].minutes * 60;
  const progress = ((total - secondsLeft) / total) * 100;

  const focusSessions = sessions.filter((s) => s.type === 'focus');
  const focusMinutes = focusSessions.reduce((sum, s) => sum + s.duration_minutes, 0);

  return (
    <AppShell active="pomodoro" title="Focus Timer" subtitle="Study with me — track your focus sessions.">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Timer */}
        <div className="surface p-8 lg:col-span-2 flex flex-col items-center justify-center min-h-[420px]">
          {/* Mode tabs */}
          <div className="flex gap-2 mb-8">
            {(Object.keys(MODES) as Mode[]).map((m) => {
              const Icon = MODES[m].icon;
              return (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`chip border transition-all ${
                    mode === m
                      ? 'bg-[var(--surface-2)] border-[var(--primary)]/40 text-[var(--text)]'
                      : 'border-[var(--border)] text-muted hover:text-[var(--text)]'
                  }`}
                >
                  <Icon className={`size-3.5 ${mode === m ? MODES[m].color : ''}`} />
                  {MODES[m].label}
                </button>
              );
            })}
          </div>

          {/* Circle */}
          <div className="relative size-64 mb-8">
            <svg className="size-full -rotate-90" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="92" fill="none" stroke="var(--border)" strokeWidth="8" />
              <circle
                cx="100"
                cy="100"
                r="92"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 92}
                strokeDashoffset={2 * Math.PI * 92 * (1 - progress / 100)}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold tabular-nums tracking-tight">
                {mm}:{ss}
              </span>
              <span className="text-sm text-muted mt-1">{MODES[mode].label}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setRunning((r) => !r)}
              className={`size-16 rounded-full flex items-center justify-center transition-all ${
                running
                  ? 'bg-[var(--surface-2)] hover:bg-[var(--border)]'
                  : 'bg-[var(--primary)] text-white animate-pulse-ring'
              }`}
            >
              {running ? <Pause className="size-6" /> : <Play className="size-6 ml-0.5" />}
            </button>
            <button
              onClick={reset}
              className="size-12 rounded-full flex items-center justify-center bg-[var(--surface-2)] hover:bg-[var(--border)] text-muted hover:text-[var(--text)] transition-colors"
            >
              <RotateCcw className="size-5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <div className="surface p-6">
            <h3 className="font-semibold mb-4">Today's focus</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[var(--surface-2)] rounded-xl p-4">
                <p className="text-3xl font-bold text-[var(--primary)]">{focusSessions.length}</p>
                <p className="text-xs text-muted mt-1">sessions</p>
              </div>
              <div className="bg-[var(--surface-2)] rounded-xl p-4">
                <p className="text-3xl font-bold text-sky-300">{focusMinutes}m</p>
                <p className="text-xs text-muted mt-1">focused</p>
              </div>
            </div>
          </div>

          <div className="surface p-6">
            <h3 className="font-semibold mb-4">Recent sessions</h3>
            {loading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="size-5 animate-spin text-muted" />
              </div>
            ) : sessions.length === 0 ? (
              <p className="text-sm text-muted text-center py-6">
                No sessions yet. Start your first focus block!
              </p>
            ) : (
              <ul className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
                {sessions.slice(0, 12).map((s) => (
                  <li key={s.id} className="flex items-center justify-between text-sm py-1">
                    <span className="flex items-center gap-2">
                      <span
                        className={`size-2 rounded-full ${
                          s.type === 'focus'
                            ? 'bg-emerald-400'
                            : s.type === 'short_break'
                            ? 'bg-sky-400'
                            : 'bg-violet-400'
                        }`}
                      />
                      {s.type === 'focus' ? 'Focus' : s.type === 'short_break' ? 'Short break' : 'Long break'}
                    </span>
                    <span className="text-muted">{s.duration_minutes}m</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
