-- Add sport-specific game state columns
ALTER TABLE games 
ADD COLUMN IF NOT EXISTS current_period TEXT,
ADD COLUMN IF NOT EXISTS game_clock TEXT;

-- Update RLS policies if necessary (usually existing policies cover new columns if using SELECT *)
-- Verify existing policies allow update on these columns
