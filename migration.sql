-- Run this to sync Season 1 with All-Time progress
-- This effectively "imports" the total pages read into the current season (Season 1)

UPDATE profiles
SET season_id = 1,
    season_start_pages = 0,
    season_pages_read = pages_read
WHERE season_id IS NULL OR season_id <= 1;