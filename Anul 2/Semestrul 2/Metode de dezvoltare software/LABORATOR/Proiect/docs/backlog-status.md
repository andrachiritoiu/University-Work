# Backlog Implementation Status

This document summarizes the current implementation status against the 16 user
stories from `docs/backlog.pdf`.

| ID | Status | Notes |
|---|---|---|
| US1 | Done | Room exploration exists through level scenes and clickable zones. |
| US2 | Done | Interactive objects, object inspection and item collection are implemented across levels. |
| US3 | Done | Multiple puzzles are implemented across Level 1 through Level 5. |
| US4 | Done | Code and answer validation flows exist, including correct and incorrect feedback. |
| US5 | Done | Collectible items can be picked up and stored in global inventory. |
| US6 | Done | Inventory panel lists items, supports inspection and equip behavior. |
| US7 | Partial | Floating AI chat exists and calls `/api/hint`; it behaves more like an oracle/hint chat than a full free-form world chat. |
| US8 | Done | Hint endpoint supports progressive hints, cooldown and fallback behavior. |
| US9 | Partial | Narrator endpoint exists through `/api/narrate`; it still needs direct UI integration on object inspection. |
| US10 | Done | Puzzle success feedback and level progression are implemented. |
| US11 | Done | Final chamber now opens the exit and displays a victory screen with time and score. |
| US12 | Partial | Python `PuzzleAgent` and Next.js validation endpoint exist; full LLM-powered integration into all puzzles is still partial. |
| US13 | Done | Hint agent behavior exists in both Python backend and Next.js runtime route. |
| US14 | Partial | Python and Next.js narrator agents exist; UI integration remains incomplete. |
| US15 | Partial | Python unit tests exist and pass; frontend/e2e coverage and formal 80% coverage reporting are not complete yet. |
| US16 | Done | GitHub Actions CI runs Python tests and frontend build. |
| US17 | Planned | Private multiplayer sessions, hosted and joined via unique 6-digit room codes. |
| US18 | Planned | Real-time state synchronization for room exploration, puzzle progress, and item interactions. |
| US19 | Planned | Global shared inventory syncing collected items and equipping/consuming logic for the team. |
| US20 | Planned | Dynamic role assignment (Scribe, Artisan, Oracle) to drive communication-based puzzle solving. |
| US21 | Planned | Shared AI chat rendering Narrator/Hint updates and enforcement of team hint cooldowns. |
| US22 | Planned | Team win condition requiring all sequential gates to be cleared to trigger joint victory screen. |
| US23 | Planned | Global synchronized team leaderboard with real-time score updates and filters. |

## Completed Since Backlog Review

- Implemented backend Python agents and game coordination modules.
- Improved runtime AI routes for hints, validation and narration.
- Added final Level 5 victory flow.
- Added Python unit tests for backend systems.
- Added GitHub Actions CI.
- Added persistent state support for the final level.

## Remaining Recommended Work

1. Integrate `/api/narrate` into object inspection UI.
2. Extend persistent state to Levels 1-4 where refresh still resets puzzle-local progress.
3. Add frontend tests or Playwright end-to-end tests for the full escape flow.
4. Add coverage reporting if the 80% threshold must be demonstrated formally.
5. Review and update `README.md` so setup instructions match the actual current stack.
