import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Trash2, Loader2, Check, CalendarDays } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from '@/lib/data/todos';
import type { Todo } from '@/types';
import { PRIORITY_META } from '@/types';

export function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Todo['priority']>('medium');
  const [dueDate, setDueDate] = useState('');
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    fetchTodos()
      .then(setTodos)
      .catch(() => setTodos([]))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setAdding(true);
    try {
      const created = await createTodo({
        title: title.trim(),
        priority,
        due_date: dueDate || null,
      });
      setTodos((p) => [created, ...p]);
      setTitle('');
      setDueDate('');
      setPriority('medium');
    } finally {
      setAdding(false);
    }
  };

  const toggle = async (todo: Todo) => {
    await updateTodo(todo.id, { completed: !todo.completed });
    setTodos((p) => p.map((t) => (t.id === todo.id ? { ...t, completed: !t.completed } : t)));
  };

  const remove = async (id: string) => {
    await deleteTodo(id);
    setTodos((p) => p.filter((t) => t.id !== id));
  };

  const filtered = todos.filter((t) =>
    filter === 'all' ? true : filter === 'active' ? !t.completed : t.completed
  );

  const stats = {
    total: todos.length,
    done: todos.filter((t) => t.completed).length,
  };

  return (
    <AppShell active="todos" title="Tasks" subtitle="Your personalized task list.">
      <form onSubmit={handleAdd} className="surface p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task..."
          className="input flex-1"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Todo['priority'])}
          className="input sm:w-36"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <div className="relative sm:w-40">
          <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted pointer-events-none" />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="input pl-11"
          />
        </div>
        <button type="submit" disabled={adding} className="btn-primary sm:w-32">
          {adding ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          Add
        </button>
      </form>

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === f
                  ? 'bg-[var(--surface-2)] text-[var(--text)]'
                  : 'text-muted hover:text-[var(--text)]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <span className="text-sm text-muted">
          {stats.done} / {stats.total} done
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="surface p-12 text-center text-muted">
          No tasks here yet. Add your first one above.
        </div>
      ) : (
        <ul className="space-y-2">
          {filtered.map((todo) => {
            const meta = PRIORITY_META[todo.priority];
            return (
              <li
                key={todo.id}
                className="surface px-4 py-3 flex items-center gap-3 group animate-float-in"
              >
                <button
                  onClick={() => toggle(todo)}
                  className={`size-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    todo.completed
                      ? 'bg-[var(--primary)] border-[var(--primary)]'
                      : 'border-[var(--border)] hover:border-[var(--primary)]'
                  }`}
                >
                  {todo.completed && <Check className="size-3.5 text-white" />}
                </button>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${
                      todo.completed ? 'line-through text-muted' : ''
                    }`}
                  >
                    {todo.title}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className={`chip text-xs ${meta.color}`}>
                      <span className={`size-1.5 rounded-full ${meta.dot}`} />
                      {meta.label}
                    </span>
                    {todo.due_date && (
                      <span className="text-xs text-muted">{todo.due_date}</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => remove(todo.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted hover:text-rose-300 p-1"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </AppShell>
  );
}
