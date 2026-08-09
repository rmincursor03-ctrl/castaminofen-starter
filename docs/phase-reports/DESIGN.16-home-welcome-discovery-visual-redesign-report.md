# DESIGN.16 - Home / Welcome / Discovery Visual Redesign Report

**Repository:** `PicoRmin/castaminofen-starter`  
**Date:** 2026-08-09  
**Status:** Implemented; browser validation deferred

## 1. Executive Summary

**Observed:** The root route renders `WelcomeScreen` for public visitors and `DiscoveryPage` for the resolved unauthenticated/session state. Authenticated users continue to redirect to Library. Welcome and Discovery combine real API-backed catalog data with static orientation and explicitly placeholder discovery sections.

**Implemented:** Reworked the live Welcome and Discovery compositions into a Persian-first editorial experience with a real-content hero, stronger artwork presentation, canonical media/state primitives, clearer action hierarchy, compact category treatments, and explicit partial/error/empty outcomes. Query ownership, routing, authentication, playback, and feature ownership were preserved.

**Validated:** Focused Home/Welcome/Discovery tests pass (4 files, 11 tests); the complete web suite passes (60 files, 216 tests); API tests pass (13/13); build passes; touched-file diagnostics are clean; final touched-slice lint and `git diff --check` pass.

**Deferred:** Browser viewport, screenshot, overflow, focus-runtime, reduced-motion, and screen-reader validation could not run because Chromium cannot load `libatk-1.0.so.0` in the container.

## 2. Baseline

**Observed:** The initial worktree was clean: `git status --short` returned no changes, `git diff --stat` was empty, and `git diff --check` passed. Existing reports identified the root Welcome/Discovery surface as REAL/PARTIAL/STATIC and identified the separate `features/home/components/HomePage.tsx` as a static/mock presentation surface not mounted by the root route.

**Observed:** Existing baseline issues documented by DESIGN.2-DESIGN.15 remained: two unrelated Player test type errors, the raw `<img>` warning in `WelcomeScreen.test.tsx`, and the non-fatal Vite config-loader warning.

## 3. Design Direction Applied

**Implemented:** Applied the established dark-first semantic surface hierarchy, Vazirmatn typography roles, violet accent and green playback conventions, canonical radius/spacing classes, restrained borders, logical RTL-safe flow, and existing motion/focus contracts. No new color system, spacing scale, typography system, breakpoint, global gradient, or page-specific design-system infrastructure was introduced.

## 4. Home Architecture

**Observed:** The root page remains responsible for session mode selection and redirect behavior. `WelcomeScreen` remains responsible for public orientation and public podcast presentation. `DiscoveryPage` remains responsible for podcast, episode, continue-listening, intro, and discovery section composition.

**Implemented:** Only the live Welcome/Discovery presentation surfaces changed. The static/mock `HomePage` was intentionally not used as a route replacement and no route semantics were changed.

## 5. Visual Hierarchy

**Implemented:** The page now establishes a single first-screen orientation block, one dominant real-content editorial feature when catalog data exists, high-priority continuation content, and lower-weight discovery collections. Categories are compact tags rather than another card grid. Placeholder sections retain distinct status treatment.

## 6. Hero / Featured

**Implemented:** Welcome uses the first real public podcast artwork when available and keeps the fallback honest when it is absent. Discovery elevates the first real podcast from the existing catalog query with artwork, title, description, provenance-relevant catalog context, and native links/buttons. No popularity, personalization, or editorial claim was fabricated.

## 7. Continue Listening

**Observed:** Continue listening is owned by Library data and Player dispatch through `ContinueListeningSection`.

**Implemented:** Discovery continues to render the feature-owned continuation section only when real continuation items exist. Progress and resume behavior were untouched; no fake progress was added.

## 8. Discovery Sections

**Implemented:** Podcast sections now use canonical `ContentArtwork` and `MediaCard` composition. Episode sections use canonical media composition with native links. Category sections use compact `Tag` treatments. Placeholder sections remain visually and semantically distinct from real catalog results.

## 9. Component Adoption

**Implemented:** Adopted existing `PageContainer`, `SectionHeader`, `Button`, `ContentArtwork`, `MediaCard`, `Tag`, `LoadingState`, `ErrorState`, `PartialState`, and `EmptyState` contracts. No new reusable primitive was required. Feature-specific continuation rows remain untouched because their actions are domain-owned.

## 10. State Handling

**Implemented:** Welcome uses canonical loading, error, and empty state presentation while preserving existing copy and retry/navigation actions. Discovery uses canonical loading and fatal error states for catalog failure and `PartialState` when one of its real data sources fails while usable content remains. Errors are not represented as empty content.

## 11. Data Provenance

**Observed:** Public podcasts and discovery podcast/episode queries are REAL when returned by the API. Orientation copy is STATIC. Continue-listening is REAL when returned by the Library query. Recommendations, categories, and unsupported discovery modes remain STATIC, PARTIAL, or MOCK/PREVIEW according to the existing discovery definitions.

**Implemented:** No fake personalization, popularity, progress, or live status was added. Existing placeholder copy and modes remain honest; no mechanical provenance label was added to ordinary static orientation copy.

## 12. Accessibility

**Implemented:** Native links and buttons remain the interaction model. Existing heading landmarks and accessible labels were preserved. Artwork receives meaningful titles where it is content-bearing; decorative icons remain hidden. Canonical state primitives provide status/alert semantics. No clickable `div`, nested interactive element, focus trap, or unnecessary ARIA was introduced.

**Validated:** Focused DOM tests and the full web suite pass. Browser keyboard, axe, focus order, target-size, and screen-reader behavior are deferred because the browser could not launch.

## 13. RTL

**Observed:** The document remains `lang="fa" dir="rtl"`, owned by the app layout.

**Implemented:** New composition uses flex/grid flow and existing logical-safe utilities. Directional icons are used only for actions whose meaning is directional; no global mirroring or new physical left/right positioning was added. Mixed-script and duration contracts remain owned by existing primitives.

**Deferred:** Rendered RTL checks for long Persian/Latin titles, links, artwork/action ordering, and focus behavior require a working browser.

## 14. Responsive

**Implemented:** Welcome and Discovery use mobile-first stacking, stable artwork ratios, constrained content width, wrapping action groups, and desktop editorial columns at existing Tailwind breakpoints. No new breakpoint was introduced. PlayerBar, bottom navigation, and shell safe-area ownership were untouched.

**Deferred:** The required 320, 375, 390, 768, 1024, 1280, and 1440px rendered matrix was not available because Chromium failed to load `libatk-1.0.so.0`.

## 15. Motion

**Implemented:** Existing transitions and reduced-motion contracts were preserved. No decorative animation was added. Canonical media/state primitives continue to supply existing motion behavior.

**Deferred:** Runtime reduced-motion verification requires browser execution.

## 16. Feature Ownership

**Validated:** React Query hooks, session/auth state, routing decisions, navigation, Library continuation mutations, Player runtime/store, queue behavior, API contracts, persistence, and backend behavior were not changed. The design system remains presentation-only.

## 17. Files Changed

- `apps/web/src/features/onboarding/components/WelcomeScreen.tsx`
- `apps/web/src/features/discovery/components/DiscoveryPage.tsx`
- `apps/web/src/features/discovery/components/DiscoverySection.tsx`
- `docs/phase-reports/DESIGN.16-home-welcome-discovery-visual-redesign-report.md`

## 18. Files Intentionally Untouched

**Validated:** `AppShell`, header/navigation, theme boundary, PlayerBar, Player runtime/store, queue, Library ownership, API/backend, auth, route semantics, persistence, playlist logic, and unrelated Library/Profile/Community/Creator/Admin surfaces were intentionally untouched.

**Observed:** `features/home/components/HomePage.tsx` remains a static/mock surface and was not made authoritative because the root route does not render it.

## 19. Tests

**Validated:** Focused slice: `WelcomeScreen.test.tsx`, `DiscoverySection.test.tsx`, `discovery-content.test.ts`, and `HomePage.test.tsx`; 4 files and 11 tests passed.  
**Validated:** Full web suite: 60 files and 216 tests passed.  
**Validated:** Root API suite: 13 tests passed.  
**Observed:** Vitest emits the existing non-fatal Vite config-loader warning.

## 20. Typecheck

**Validated:** Touched components report no diagnostics through the editor error check.  
**Observed:** `pnpm --filter @castaminofen/web exec tsc --noEmit` remains blocked by two pre-existing Player test errors: missing `onMove`/`onClear` props in `PlayerDataIntegration.test.tsx` and possibly undefined `read.queue` in `persistence.test.ts`. No DESIGN.16 file is implicated.

## 21. Lint

**Validated:** Workspace lint passed after the final cleanup, with no new DESIGN.16 warning.  
**Observed:** The existing `WelcomeScreen.test.tsx` raw `<img>` warning remains.

## 22. Build

**Validated:** `pnpm build` passed for shared types, web, and API. Next generated all 19 existing routes. The existing raw-image warning was emitted during web build.

## 23. Runtime / Browser Validation

**Attempted:** Playwright Chromium launch was attempted for browser validation.

**Deferred:** Chromium could not launch because the container lacks `libatk-1.0.so.0`. No screenshot, pixel, viewport, overflow, focus-runtime, or screen-reader claim is made. Browser validation remains the next environment-dependent verification step.

## 24. Pre-existing Issues

**Observed:** Two unrelated Player typecheck diagnostics, one existing Next raw-image lint/build warning, and the non-fatal Vite config-loader warning remain. Browser validation is blocked by the missing system library described above.

## 25. Deferred Design Debt

**Deferred:** Run the full route and viewport browser matrix; verify no horizontal overflow and PlayerBar/bottom-navigation clearance; test RTL mixed-script rendering; run keyboard, axe, focus, reduced-motion, and screen-reader checks; review remaining Discovery placeholder provenance in rendered context; and decide whether the static/mock `HomePage` should be retired or wired in a separate product/route task.

## 26. Architecture Safety Confirmation

**Validated:** DESIGN.16 changed presentation composition and reused existing canonical primitives only. No backend behavior, API contract, authentication, authorization, route semantics, React Query ownership, Zustand ownership, Player runtime, queue ownership, playback behavior, persistence architecture, playlist business logic, analytics, fake data, or fake personalization was introduced or changed.
