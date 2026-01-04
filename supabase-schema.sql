-- ============================================
-- Supabase Database Schema for Leaderboard App
-- Run this in Supabase SQL Editor
-- ============================================

-- Departments table
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo TEXT NOT NULL,
  color TEXT DEFAULT '#39ff14',
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  support_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Games/Matches table
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  department_a_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  department_b_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  score_a INTEGER DEFAULT 0,
  score_b INTEGER DEFAULT 0,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed')),
  start_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public read access" ON departments FOR SELECT USING (true);
CREATE POLICY "Public read access" ON games FOR SELECT USING (true);

-- Public write access (for demo - restrict in production)
CREATE POLICY "Public insert" ON departments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update" ON departments FOR UPDATE USING (true);
CREATE POLICY "Public delete" ON departments FOR DELETE USING (true);
CREATE POLICY "Public insert" ON games FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update" ON games FOR UPDATE USING (true);
CREATE POLICY "Public delete" ON games FOR DELETE USING (true);

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE departments;
ALTER PUBLICATION supabase_realtime ADD TABLE games;

-- ============================================
-- SEED DATA (Optional)
-- ============================================

-- Insert sample departments
INSERT INTO departments (name, logo, color, wins, losses, points, support_count) VALUES
  ('Engineering Eagles', '🦅', '#FFD700', 5, 2, 15, 120),
  ('Business Bulls', '🐂', '#C0C0C0', 4, 3, 12, 95),
  ('Arts Artists', '🎨', '#FF69B4', 3, 4, 9, 150),
  ('Science Scorpions', '🦂', '#00CED1', 6, 1, 18, 80),
  ('Tech Titans', '🤖', '#8A2BE2', 2, 5, 6, 200);

-- Insert sample games (using subqueries to get department IDs)
INSERT INTO games (type, department_a_id, department_b_id, score_a, score_b, status, start_time) VALUES
  ('Basketball', 
   (SELECT id FROM departments WHERE name = 'Engineering Eagles'),
   (SELECT id FROM departments WHERE name = 'Business Bulls'),
   85, 82, 'completed', '2024-03-01T10:00:00Z'),
  ('Volleyball', 
   (SELECT id FROM departments WHERE name = 'Arts Artists'),
   (SELECT id FROM departments WHERE name = 'Science Scorpions'),
   1, 3, 'completed', '2024-03-01T14:00:00Z'),
  ('Esports (Valorant)', 
   (SELECT id FROM departments WHERE name = 'Tech Titans'),
   (SELECT id FROM departments WHERE name = 'Engineering Eagles'),
   12, 10, 'live', '2024-03-02T09:00:00Z'),
  ('Soccer', 
   (SELECT id FROM departments WHERE name = 'Business Bulls'),
   (SELECT id FROM departments WHERE name = 'Arts Artists'),
   0, 0, 'upcoming', '2024-03-03T16:00:00Z');
