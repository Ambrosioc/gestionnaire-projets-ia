/*
  # Create tasks table and related tables

  1. New Tables
    - `task_statuses`
      - `id` (text, primary key)
      - `name` (text)
      - `order` (integer)
    
    - `task_priorities`
      - `id` (text, primary key)
      - `name` (text)
      - `color` (text)
      - `order` (integer)

    - `tags`
      - `id` (uuid, primary key)
      - `name` (text)
      - `color` (text)
      - `user_id` (uuid, foreign key)

    - `tasks`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `status` (text, foreign key)
      - `priority` (text, foreign key)
      - `project_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `deadline` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `task_tags` (junction table)
      - `task_id` (uuid, foreign key)
      - `tag_id` (uuid, foreign key)

  2. Security
    - Enable RLS on all tables
    - Add policies for CRUD operations
*/

-- Task Statuses
CREATE TABLE IF NOT EXISTS task_statuses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  "order" INTEGER NOT NULL
);

INSERT INTO task_statuses (id, name, "order") VALUES
  ('todo', 'À faire', 1),
  ('in_progress', 'En cours', 2),
  ('review', 'En révision', 3),
  ('done', 'Terminé', 4);

-- Task Priorities
CREATE TABLE IF NOT EXISTS task_priorities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  "order" INTEGER NOT NULL
);

INSERT INTO task_priorities (id, name, color, "order") VALUES
  ('low', 'Basse', '#4CAF50', 1),
  ('medium', 'Moyenne', '#FF9800', 2),
  ('high', 'Haute', '#f44336', 3),
  ('urgent', 'Urgente', '#9C27B0', 4);

-- Tags
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(name, user_id)
);

-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL REFERENCES task_statuses(id) ON DELETE RESTRICT DEFAULT 'todo',
  priority TEXT NOT NULL REFERENCES task_priorities(id) ON DELETE RESTRICT DEFAULT 'medium',
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Task Tags (Junction Table)
CREATE TABLE IF NOT EXISTS task_tags (
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, tag_id)
);

-- Enable RLS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_tags ENABLE ROW LEVEL SECURITY;

-- Policies for tags
CREATE POLICY "Users can create their own tags"
  ON tags
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own tags"
  ON tags
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own tags"
  ON tags
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tags"
  ON tags
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for tasks
CREATE POLICY "Users can create tasks for their projects"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = project_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their tasks"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for task_tags
CREATE POLICY "Users can manage task tags for their tasks"
  ON task_tags
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE id = task_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE id = task_id AND user_id = auth.uid()
    )
  );

-- Triggers for updated_at
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to generate AI tasks
CREATE OR REPLACE FUNCTION generate_default_tasks(project_name TEXT)
RETURNS TEXT[] AS $$
DECLARE
  default_tasks TEXT[] := ARRAY[
    'Analyse des besoins',
    'Création du cahier des charges',
    'Conception de la solution',
    'Développement',
    'Tests et validation',
    'Déploiement',
    'Formation des utilisateurs',
    'Documentation'
  ];
BEGIN
  RETURN default_tasks;
END;
$$ LANGUAGE plpgsql;