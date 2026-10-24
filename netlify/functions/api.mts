import type { Config } from '@netlify/functions';
import { getUser } from '@netlify/identity';
import { and, asc, count, desc, eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { goals, kanban_cards, notes, pomodoro_sessions, timeblocks, todos } from '../../db/schema.js';

// Fields the client is allowed to write per resource. Everything else (id, user_id, timestamps) is server-owned.
const RESOURCES = {
  todos: { table: todos, writable: ['title', 'completed', 'priority', 'due_date'] },
  kanban: { table: kanban_cards, writable: ['title', 'description', 'status', 'position'] },
  pomodoro: { table: pomodoro_sessions, writable: ['type', 'duration_minutes'] },
  timeblocks: { table: timeblocks, writable: ['block_date', 'title', 'start_time', 'end_time', 'category'] },
  goals: { table: goals, writable: ['title', 'description', 'target', 'progress', 'completed'] },
  notes: { table: notes, writable: ['title', 'content', 'color'] },
} as const;

type ResourceName = keyof typeof RESOURCES;

function pick(body: Record<string, unknown>, keys: readonly string[]) {
  const out: Record<string, unknown> = {};
  for (const key of keys) {
    if (key in body) out[key] = body[key];
  }
  return out;
}

export default async (req: Request, context: { params: Record<string, string | undefined> }) => {
  const user = await getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const name = context.params.resource as ResourceName;
  const resource = RESOURCES[name];
  if (!resource) return Response.json({ error: 'Not found' }, { status: 404 });

  const id = context.params.id;
  const table = resource.table;
  const owned = id ? and(eq(table.id, id), eq(table.user_id, user.id)) : eq(table.user_id, user.id);

  try {
    if (req.method === 'GET' && !id) {
      const url = new URL(req.url);
      switch (name) {
        case 'kanban':
          return Response.json(await db.select().from(kanban_cards).where(owned).orderBy(asc(kanban_cards.position)));
        case 'pomodoro':
          return Response.json(
            await db.select().from(pomodoro_sessions).where(owned).orderBy(desc(pomodoro_sessions.completed_at)).limit(50)
          );
        case 'timeblocks': {
          const date = url.searchParams.get('date');
          const where = date ? and(owned, eq(timeblocks.block_date, date)) : owned;
          return Response.json(await db.select().from(timeblocks).where(where).orderBy(asc(timeblocks.start_time)));
        }
        case 'notes':
          return Response.json(await db.select().from(notes).where(owned).orderBy(desc(notes.updated_at)));
        case 'todos':
          return Response.json(await db.select().from(todos).where(owned).orderBy(desc(todos.created_at)));
        case 'goals':
          return Response.json(await db.select().from(goals).where(owned).orderBy(desc(goals.created_at)));
      }
    }

    if (req.method === 'POST' && !id) {
      const values: Record<string, unknown> = { ...pick(await req.json(), resource.writable), user_id: user.id };
      if (name === 'kanban') {
        const [{ value }] = await db
          .select({ value: count() })
          .from(kanban_cards)
          .where(and(eq(kanban_cards.user_id, user.id), eq(kanban_cards.status, values.status as 'todo')));
        values.position = value;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const [row] = await db.insert(table).values(values as any).returning();
      return Response.json(row, { status: 201 });
    }

    if (req.method === 'PATCH' && id) {
      const patch: Record<string, unknown> = pick(await req.json(), resource.writable);
      if (name === 'notes') patch.updated_at = new Date();
      if (Object.keys(patch).length === 0) return Response.json({ error: 'Nothing to update' }, { status: 400 });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const [row] = await db.update(table).set(patch as any).where(owned).returning();
      if (!row) return Response.json({ error: 'Not found' }, { status: 404 });
      return Response.json(row);
    }

    if (req.method === 'DELETE' && id) {
      await db.delete(table).where(owned);
      return new Response(null, { status: 204 });
    }

    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  } catch (error) {
    console.error(`API error on ${req.method} ${name}`, error);
    return Response.json({ error: 'Something went wrong' }, { status: 500 });
  }
};

export const config: Config = {
  path: ['/api/:resource', '/api/:resource/:id'],
};
