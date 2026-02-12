
## 2026-02-12 (Update 15)
- Sync Improvements:
  - Added manual "Sync" button to Library page to allow users to force synchronization.
  - Refactored `loadBooks` into reusable `syncLibrary` function with error handling and user feedback.
  - Improved `uploadMissingBooks` logic to ensure local books are uploaded to Supabase after policies are fixed.
  - This addresses the issue where books were not appearing across devices by providing a way to retry sync after database setup.