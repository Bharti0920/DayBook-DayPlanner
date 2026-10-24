import { pgTable, uuid, text, boolean, integer, date, time, timestamp, index } from 'drizzle-orm/pg-core';

// Property names are snake_case so rows serialize to the same shape the frontend types expect.
// user_id holds the Netlify Identity user id; every query is scoped by it.

export const todos = pgTable(
  'todos',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: text('user_id').notNull(),
    title: text('title').notNull(),
    completed: boolean('completed').notNull().default(false),
    priority: text('priority', { enum: ['low', 'medium', 'high'] }).notNull().default('medium'),
    due_date: date('due_date', { mode: 'string' }),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('todos_user_id_idx').on(t.user_id)]
);

export const kanban_cards = pgTable(
  'kanban_cards',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: text('user_id').notNull(),
    title: text('title').notNull(),
    description: text('description').notNull().default(''),
    status: text('status', { enum: ['todo', 'in_progress', 'done'] }).notNull().default('todo'),
    position: integer('position').notNull().default(0),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('kanban_cards_user_id_idx').on(t.user_id)]
);

export const pomodoro_sessions = pgTable(
  'pomodoro_sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: text('user_id').notNull(),
    type: text('type', { enum: ['focus', 'short_break', 'long_break'] }).notNull().default('focus'),
    duration_minutes: integer('duration_minutes').notNull().default(25),
    completed_at: timestamp('completed_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('pomodoro_sessions_user_id_idx').on(t.user_id)]
);

export const timeblocks = pgTable(
  'timeblocks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: text('user_id').notNull(),
    block_date: date('block_date', { mode: 'string' }).notNull().defaultNow(),
    title: text('title').notNull(),
    start_time: time('start_time').notNull(),
    end_time: time('end_time').notNull(),
    category: text('category', { enum: ['work', 'study', 'personal', 'break'] }).notNull().default('work'),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('timeblocks_user_date_idx').on(t.user_id, t.block_date)]
);

export const goals = pgTable(
  'goals',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: text('user_id').notNull(),
    title: text('title').notNull(),
    description: text('description').notNull().default(''),
    target: integer('target').notNull().default(1),
    progress: integer('progress').notNull().default(0),
    completed: boolean('completed').notNull().default(false),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('goals_user_id_idx').on(t.user_id)]
);

export const notes = pgTable(
  'notes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: text('user_id').notNull(),
    title: text('title').notNull().default('Untitled'),
    content: text('content').notNull().default(''),
    color: text('color').notNull().default('amber'),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('notes_user_id_idx').on(t.user_id)]
);
