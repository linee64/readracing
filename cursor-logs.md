
## 2026-02-12 (Update 12)
- Implemented Cloud Synchronization:
  - **Library (`dashboard/app/library/page.tsx`)**:
    - Added sync logic to `useEffect`: Fetches user's books from Supabase `books` table, merges them with local IndexedDB data (prioritizing newer `lastReadAt`), and downloads missing book files from Supabase Storage.
    - Updated `handleFileUpload`: Now uploads the `.epub` file to Supabase Storage (`books` bucket) and inserts a record into the `books` table with metadata and file URL.
  - **Reader (`dashboard/app/reader/[id]/page.tsx`)**:
    - Updated `updateLibraryProgress`: Now syncs reading progress (`current_page`, `current_page_cfi`, `last_read_at`) to the Supabase `books` table in addition to updating the local state and user profile stats.
  - **Goal**: Enable cross-device synchronization so books uploaded/read on mobile appear on desktop and vice-versa.