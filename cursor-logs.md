
## 2026-02-12 (Update 14)
- Database Setup Fix:
  - Created `supabase_fix.sql` to handle "policy already exists" errors.
  - The script now uses `DROP POLICY IF EXISTS` before creating policies, ensuring it can be run multiple times safely.
  - This is critical for setting up the Storage policies required for file synchronization.