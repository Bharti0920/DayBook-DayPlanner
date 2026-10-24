import { useEffect, useState } from 'react';
import { Plus, Trash2, Loader2, X } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { fetchNotes, createNote, updateNote, deleteNote } from '@/lib/data/notes';
import type { Note } from '@/types';
import { NOTE_COLORS } from '@/types';

function colorMeta(id: string) {
  return NOTE_COLORS.find((c) => c.id === id) ?? NOTE_COLORS[0];
}

export function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Note | null>(null);

  useEffect(() => {
    fetchNotes()
      .then(setNotes)
      .catch(() => setNotes([]))
      .finally(() => setLoading(false));
  }, []);

  const handleNew = async () => {
    const created = await createNote({ title: 'Untitled', content: '', color: 'amber' });
    setNotes((p) => [created, ...p]);
    setEditing(created);
  };

  const save = async (id: string, title: string, content: string, color: string) => {
    await updateNote(id, { title, content, color });
    setNotes((p) =>
      p.map((n) => (n.id === id ? { ...n, title, content, color, updated_at: new Date().toISOString() } : n))
    );
  };

  const remove = async (id: string) => {
    await deleteNote(id);
    setNotes((p) => p.filter((n) => n.id !== id));
    if (editing?.id === id) setEditing(null);
  };

  return (
    <AppShell active="notes" title="Notes" subtitle="Store what you'll need later.">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted">{notes.length} note{notes.length !== 1 ? 's' : ''}</p>
        <button onClick={handleNew} className="btn-primary">
          <Plus className="size-4" /> New note
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted" />
        </div>
      ) : notes.length === 0 ? (
        <div className="surface p-12 text-center text-muted">
          No notes yet. Create your first one to start collecting ideas.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note, i) => {
            const meta = colorMeta(note.color);
            return (
              <button
                key={note.id}
                onClick={() => setEditing(note)}
                className={`surface p-5 text-left border ${meta.border} ${meta.bg} hover:scale-[1.02] transition-transform animate-float-in group`}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`size-2.5 rounded-full ${meta.dot}`} />
                    <h3 className="font-semibold truncate">{note.title || 'Untitled'}</h3>
                  </div>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(note.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted hover:text-rose-300 p-0.5"
                  >
                    <Trash2 className="size-3.5" />
                  </span>
                </div>
                <p className="text-sm text-muted line-clamp-5 whitespace-pre-wrap min-h-[60px]">
                  {note.content || 'Empty note'}
                </p>
                <p className="text-xs text-muted mt-3">
                  {new Date(note.updated_at).toLocaleDateString()}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {editing && (
        <NoteEditor
          note={editing}
          onClose={() => setEditing(null)}
          onSave={save}
          onDelete={remove}
        />
      )}
    </AppShell>
  );
}

function NoteEditor({
  note,
  onClose,
  onSave,
  onDelete,
}: {
  note: Note;
  onClose: () => void;
  onSave: (id: string, title: string, content: string, color: string) => void;
  onDelete: (id: string) => void;
}) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [color, setColor] = useState(note.color);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative surface p-6 w-full max-w-lg animate-float-in">
        <div className="flex items-center justify-between mb-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="bg-transparent text-lg font-semibold outline-none flex-1 mr-3"
          />
          <button onClick={onClose} className="text-muted hover:text-[var(--text)]">
            <X className="size-5" />
          </button>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          rows={8}
          className="input resize-none mb-4"
        />

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {NOTE_COLORS.map((c) => (
              <button
                key={c.id}
                onClick={() => setColor(c.id)}
                className={`size-6 rounded-full ${c.dot} transition-transform ${
                  color === c.id ? 'ring-2 ring-offset-2 ring-offset-[var(--surface)] ring-white/40 scale-110' : ''
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onDelete(note.id)}
              className="btn-ghost text-rose-300 hover:bg-rose-500/10"
            >
              <Trash2 className="size-4" />
            </button>
            <button onClick={() => { onSave(note.id, title, content, color); onClose(); }} className="btn-primary">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
