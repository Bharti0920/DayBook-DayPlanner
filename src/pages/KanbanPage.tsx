import { useEffect, useState } from 'react';
import { Plus, Trash2, Loader2, X } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { fetchKanbanCards, createKanbanCard, updateKanbanCard, deleteKanbanCard } from '@/lib/data/kanban';
import type { KanbanCard } from '@/types';
import { KANBAN_COLUMNS } from '@/types';

export function KanbanPage() {
  const [cards, setCards] = useState<KanbanCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingCol, setAddingCol] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [dragId, setDragId] = useState<string | null>(null);
  const [editing, setEditing] = useState<KanbanCard | null>(null);

  useEffect(() => {
    fetchKanbanCards()
      .then(setCards)
      .catch(() => setCards([]))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (status: string) => {
    if (!newTitle.trim()) return;
    const created = await createKanbanCard({ title: newTitle.trim(), status: status as KanbanCard['status'], description: '' });
    setCards((p) => [...p, created]);
    setNewTitle('');
    setAddingCol(null);
  };

  const moveTo = async (card: KanbanCard, status: KanbanCard['status']) => {
    await updateKanbanCard(card.id, { status });
    setCards((p) => p.map((c) => (c.id === card.id ? { ...c, status } : c)));
  };

  const remove = async (id: string) => {
    await deleteKanbanCard(id);
    setCards((p) => p.filter((c) => c.id !== id));
  };

  const saveEdit = async (title: string, description: string) => {
    if (!editing) return;
    await updateKanbanCard(editing.id, { title, description });
    setCards((p) =>
      p.map((c) => (c.id === editing.id ? { ...c, title, description } : c))
    );
    setEditing(null);
  };

  return (
    <AppShell active="kanban" title="Kanban" subtitle="See your work in motion.">
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted" />
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {KANBAN_COLUMNS.map((col) => {
            const colCards = cards.filter((c) => c.status === col.id);
            return (
              <div
                key={col.id}
                className="surface p-3 flex flex-col min-h-[300px]"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragId) {
                    const card = cards.find((c) => c.id === dragId);
                    if (card && card.status !== col.id) moveTo(card, col.id);
                    setDragId(null);
                  }
                }}
              >
                <div className="flex items-center justify-between px-1 mb-3">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    {col.label}
                    <span className="text-xs text-muted font-normal">{colCards.length}</span>
                  </h3>
                  <button
                    onClick={() => setAddingCol(col.id)}
                    className="p-1 rounded-lg hover:bg-[var(--surface-2)] text-muted hover:text-[var(--text)]"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>

                <div className="space-y-2 flex-1">
                  {colCards.map((card) => (
                    <div
                      key={card.id}
                      draggable
                      onDragStart={() => setDragId(card.id)}
                      onClick={() => setEditing(card)}
                      className="surface-2 rounded-xl p-3 cursor-grab active:cursor-grabbing group hover:border-[var(--primary)]/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium">{card.title}</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            remove(card.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted hover:text-rose-300"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                      {card.description && (
                        <p className="text-xs text-muted mt-1.5 line-clamp-2">{card.description}</p>
                      )}
                    </div>
                  ))}

                  {addingCol === col.id && (
                    <div className="surface-2 rounded-xl p-2">
                      <input
                        autoFocus
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAdd(col.id);
                          if (e.key === 'Escape') setAddingCol(null);
                        }}
                        placeholder="Card title..."
                        className="input py-2 text-sm bg-[var(--surface)]"
                      />
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => handleAdd(col.id)} className="btn-primary text-xs py-1.5 flex-1">
                          Add
                        </button>
                        <button
                          onClick={() => setAddingCol(null)}
                          className="btn-ghost text-xs py-1.5 px-2"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <EditModal card={editing} onClose={() => setEditing(null)} onSave={saveEdit} />
      )}
    </AppShell>
  );
}

function EditModal({
  card,
  onClose,
  onSave,
}: {
  card: KanbanCard;
  onClose: () => void;
  onSave: (title: string, description: string) => void;
}) {
  const [title, setTitle] = useState(card.title);
  const [desc, setDesc] = useState(card.description);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative surface p-6 w-full max-w-md animate-float-in">
        <h3 className="font-semibold mb-4">Edit card</h3>
        <label className="block text-sm font-medium mb-1.5">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="input mb-4" />
        <label className="block text-sm font-medium mb-1.5">Description</label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={4}
          className="input resize-none mb-4"
        />
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button onClick={() => onSave(title, desc)} className="btn-primary">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
