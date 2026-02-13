
## 2026-02-12 (Update 27)
- Fix: Resolved sidebar layout issue where profile card was pushed off-screen.
  - Added `overflow-y-auto` and `custom-scrollbar` to the sidebar navigation in `components/Sidebar.tsx`.
  - Added custom scrollbar styles to `app/globals.css`.
- Feature: Implemented dynamic "overtaking" logic in Leaderboard.
  - Updated `app/leaderboard/page.tsx` to correctly calculate pages needed to overtake the user directly above.
  - Added specific messaging for 1st place ("leading the pack") vs others.

## 2026-02-12 (Update 28)
- Feature: Implemented Russian language support.
  - Created `LanguageContext` for global language state management.
  - Added `translations.ts` with English and Russian translations.
  - Integrated language switching in `app/settings/page.tsx`.
  - Localized `components/Sidebar.tsx` and `app/leaderboard/page.tsx`.
- Fix: Resolved build error in `LanguageContext.tsx`.
  - Added missing keys (`email_address`, `read_only`, `min`) to Russian translations in `lib/translations.ts` to match the English type definition.
