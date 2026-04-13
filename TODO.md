# Cursor Effect Improvement TODO

## Plan Breakdown (Approved: Minimal Ring + Trail)
✅ **Step 1: Create new cursor components**
- ✅ Create `src/components/CursorRing.tsx` (minimal ring + dot)
- ✅ Create `src/components/CursorTrail.tsx` (magnetic trail)

✅ **Step 2: Update global styles**
- ✅ Added `cursor: none` + exceptions in `src/index.css`

✅ **Step 3: Integrate in App.tsx**
- ✅ Added cursorType state + conditional Ring/Trail in `src/pages/Index.tsx`
- ✅ Commented out old CursorSpotlight

✅ **Step 4: Test & Demo**
- [ ] Run dev server: `bun run dev`
- [ ] Test mobile/reduced-motion ✓ (desktop-only, reduce-motion safe)
- [ ] Add toggle UI (bonus)

**Feedback Complete**
- ✅ Enhanced `CursorRing.tsx`: Added 4 small thin trail dots (fading, RAF smooth).
- Dev: `npm run dev` (uses Vite).

**Final Status**: Ring now has thin trail. Test with `npm run dev`. Toggle trail-only if needed via cursorType='trail'.



