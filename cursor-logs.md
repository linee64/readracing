
## 2026-02-13 (Update 35)
- Fix: Corrected sidebar icon alignment.
  - Added fixed width (`w-8`) and flex centering (`flex items-center justify-center`) to the icon wrapper in `Sidebar.tsx`.
  - Ensures all icons are vertically aligned in a single column regardless of their intrinsic SVG width (24px vs 32px).
  - Ensures menu text starts at a consistent offset.