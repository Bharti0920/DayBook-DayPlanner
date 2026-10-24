/*
# Create productivity dashboard tables (Zenith)

1. Overview
This migration creates the full data model for Zenith, a personal productivity
dashboard. Every table is owner-scoped to the signed-in user (multi-tenant via
auth.users). Each user can only see and modify their own rows.

2. New Tables
- `todos` — personal task list items.
  - id (uuid PK), user_id (owner), title, completed, priority (low/medium/high),
    due_date (date, optional), created_at.
- `kanban_cards` — cards on the Kanban board, organized by status column.
  - id (uuid PK), user_id, title, description, status (todo/in_progress/done),
    position (int ordering within column), created_at.
- `pomodoro_sessions` — completed focus/break session history.
  - id (uuid PK), user_id, type (focus/short_break/long_break),
    duration_minutes, completed_at.
- `timeblocks` — time-blocked schedule entries for a given day.
  - id (uuid PK), user_id, block_date (date), title, start_time, end_time,
    category (work/study/personal/break), created_at.
- `goals` — daily/weekly goals with a target and progress.
  - id (uuid PK), user_id, title, description, target (int), progress (int),
    completed (bool), created_at.
- `notes` — freeform notes with a color tag.
  - id (uuid PK), user_id, title, content (text), color, created_at, updated_at.

3. Security
- Enable RLS on every table.
- Grant CRUD to `authenticated` only (the app requires sign-in).
- Owner-scoped CRUD policies on every table using auth.uid() = user_id.
- All owner columns default to auth.uid() so inserts omitting user_id succeed.
4. Indexes
- Indexes on user_id for fast per-user queries on every table.
*/

-- todos
CREATE TABLE IF NOT EXISTS todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high')),
  due_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON todos TO authenticated;
CREATE INDEX IF NOT EXISTS todos_user_id_idx ON todos(user_id);

DROP POLICY IF EXISTS "select_own_todos" ON todos;
CREATE POLICY "select_own_todos" ON todos FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_todos" ON todos;
CREATE POLICY "insert_own_todos" ON todos FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_todos" ON todos;
CREATE POLICY "update_own_todos" ON todos FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_todos" ON todos;
CREATE POLICY "delete_own_todos" ON todos FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- kanban_cards
CREATE TABLE IF NOT EXISTS kanban_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  status text NOT NULL DEFAULT 'todo' CHECK (status IN ('todo','in_progress','done')),
  position int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE kanban_cards ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON kanban_cards TO authenticated;
CREATE INDEX IF NOT EXISTS kanban_cards_user_id_idx ON kanban_cards(user_id);

DROP POLICY IF EXISTS "select_own_kanban" ON kanban_cards;
CREATE POLICY "select_own_kanban" ON kanban_cards FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_kanban" ON kanban_cards;
CREATE POLICY "insert_own_kanban" ON kanban_cards FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_kanban" ON kanban_cards;
CREATE POLICY "update_own_kanban" ON kanban_cards FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_kanban" ON kanban_cards;
CREATE POLICY "delete_own_kanban" ON kanban_cards FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- pomodoro_sessions
CREATE TABLE IF NOT EXISTS pomodoro_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'focus' CHECK (type IN ('focus','short_break','long_break')),
  duration_minutes int NOT NULL DEFAULT 25,
  completed_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE pomodoro_sessions ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON pomodoro_sessions TO authenticated;
CREATE INDEX IF NOT EXISTS pomodoro_sessions_user_id_idx ON pomodoro_sessions(user_id);

DROP POLICY IF EXISTS "select_own_pomodoro" ON pomodoro_sessions;
CREATE POLICY "select_own_pomodoro" ON pomodoro_sessions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_pomodoro" ON pomodoro_sessions;
CREATE POLICY "insert_own_pomodoro" ON pomodoro_sessions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_pomodoro" ON pomodoro_sessions;
CREATE POLICY "update_own_pomodoro" ON pomodoro_sessions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_pomodoro" ON pomodoro_sessions;
CREATE POLICY "delete_own_pomodoro" ON pomodoro_sessions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- timeblocks
CREATE TABLE IF NOT EXISTS timeblocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  block_date date NOT NULL DEFAULT CURRENT_DATE,
  title text NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  category text NOT NULL DEFAULT 'work' CHECK (category IN ('work','study','personal','break')),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE timeblocks ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON timeblocks TO authenticated;
CREATE INDEX IF NOT EXISTS timeblocks_user_date_idx ON timeblocks(user_id, block_date);

DROP POLICY IF EXISTS "select_own_timeblocks" ON timeblocks;
CREATE POLICY "select_own_timeblocks" ON timeblocks FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_timeblocks" ON timeblocks;
CREATE POLICY "insert_own_timeblocks" ON timeblocks FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_timeblocks" ON timeblocks;
CREATE POLICY "update_own_timeblocks" ON timeblocks FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_timeblocks" ON timeblocks;
CREATE POLICY "delete_own_timeblocks" ON timeblocks FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- goals
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  target int NOT NULL DEFAULT 1,
  progress int NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON goals TO authenticated;
CREATE INDEX IF NOT EXISTS goals_user_id_idx ON goals(user_id);

DROP POLICY IF EXISTS "select_own_goals" ON goals;
CREATE POLICY "select_own_goals" ON goals FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_goals" ON goals;
CREATE POLICY "insert_own_goals" ON goals FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_goals" ON goals;
CREATE POLICY "update_own_goals" ON goals FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_goals" ON goals;
CREATE POLICY "delete_own_goals" ON goals FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- notes
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Untitled',
  content text DEFAULT '',
  color text NOT NULL DEFAULT 'amber',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON notes TO authenticated;
CREATE INDEX IF NOT EXISTS notes_user_id_idx ON notes(user_id);

DROP POLICY IF EXISTS "select_own_notes" ON notes;
CREATE POLICY "select_own_notes" ON notes FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_notes" ON notes;
CREATE POLICY "insert_own_notes" ON notes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_notes" ON notes;
CREATE POLICY "update_own_notes" ON notes FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_notes" ON notes;
CREATE POLICY "delete_own_notes" ON notes FOR DELETE
  TO authenticated USING (auth.uid() = user_id);