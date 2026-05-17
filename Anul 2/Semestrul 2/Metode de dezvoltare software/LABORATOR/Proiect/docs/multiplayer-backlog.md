# Multiplayer Backlog Extension

This document outlines the User Stories (US) added to support collaborative, real-time multiplayer functionality in the **MDS Escape Room** project. All stories are allocated to **Sprint 4** and strictly adhere to the project's quality metrics.

---

## 🛠️ Sprint 4 User Stories (Multiplayer Epic)

### US17: Room Code & Multiplayer Sessions
*   **Epic:** Multiplayer Core
*   **Role:** As an Explorer
*   **Action:** I want to create a private multiplayer session, obtain a unique 6-digit room code, and share it with my team members
*   **Business Value:** So that we can join the exact same escape room instance and enjoy a coordinated team experience.
*   **Story Points:** 8 SP
*   **Priority:** High
*   **MoSCoW:** Must Have
*   **Sprint:** Sprint 4
*   **Dependencies:** Project Setup (US1)
*   **Acceptance Criteria:**
    1.  Players can click "Host Game" from the main Lobby to initialize a multiplayer session.
    2.  The system generates a secure, unique, and easy-to-read 6-letter/digit room code (e.g., `AEF39D`).
    3.  Players can enter this code in a "Join Game" input field in the Lobby to enter the shared session.
    4.  The host sees a real-time list of connected players before starting the game.
    5.  Maximum team size is capped (e.g., 5 players) with clear feedback if a room is full.
*   **Definition of Done:**
    *   Code reviewed by another developer.
    *   ≥80% unit/integration test coverage on room state logic.
    *   WCAG 2.1 AA compliant UI.
    *   No hardcoded configuration secrets (e.g. Supabase keys are fully externalized).
    *   Room creation and joining actions resolve in < 2 seconds.

---

### US18: Real-Time Interaction Synchronization
*   **Epic:** Real-time Sync
*   **Role:** As an Explorer
*   **Action:** I want any environmental interaction—such as uncovering a zone, turning a tumbler, or unlocking an intermediate mechanism—to be instantly synchronized across all players' screens in the room
*   **Business Value:** So that duplicate puzzle-solving efforts are eliminated and all players share the identical visual state of the labyrinth.
*   **Story Points:** 13 SP
*   **Priority:** High
*   **MoSCoW:** Must Have
*   **Sprint:** Sprint 4
*   **Dependencies:** US17, US3, US4
*   **Acceptance Criteria:**
    1.  When Player A solves a puzzle (e.g., enters the correct code on the Level 1 chest), the chest transitions to the "open" state on Player B's screen within 500ms.
    2.  Puzzle interactive elements (e.g., dial positions, lock tumblers) reflect the real-time inputs of whoever is currently rotating them.
    3.  A robust conflict resolution mechanism prevents system locks if two players interact with the same puzzle component simultaneously (first-write-wins).
    4.  Instant visual indicators show when an object is being "inspected" or "manipulated" by another teammate.
*   **Definition of Done:**
    *   Multi-user concurrency testing completed successfully.
    *   ≥80% test coverage on WebSocket/real-time state transitions.
    *   Zero polling fallback mechanisms unless WebSockets fail.
    *   WCAG 2.1 AA keyboard navigation maintained for interactive states.

---

### US19: Shared Team Inventory
*   **Epic:** Evidence/Items
*   **Role:** As a Team Member
*   **Action:** I want a unified inventory panel where any item collected by any player in the team is instantly stored and visible/usable by all other teammates
*   **Business Value:** So that we can coordinate item combinations and puzzle solutions in real-time, simulating a physical escape room.
*   **Story Points:** 5 SP
*   **Priority:** High
*   **MoSCoW:** Must Have
*   **Sprint:** Sprint 4
*   **Dependencies:** US17, US18, US5, US6
*   **Acceptance Criteria:**
    1.  When Player A picks up an item (e.g., the *Math Book* in Level 1), the item is added to the global inventory and becomes instantly visible to Player B.
    2.  Teammates can click on any shared item to view its details, zoom in, or read its lore.
    3.  When an item is equipped or consumed by a player to solve a puzzle, it is removed from the inventory for all players, accompanied by a dynamic notification.
    4.  Real-time toast notifications indicate who collected/used which item (e.g., *"Otilia picked up the Rusty Key"*).
*   **Definition of Done:**
    *   Code reviewed and approved.
    *   Component test coverage ≥80%.
    *   Fully accessible to screen readers (WCAG 2.1 AA).
    *   Zero state desynchronization under high-latency network simulation.

---

### US20: Collaborative Role Assignment
*   **Epic:** Multiplayer Core
*   **Role:** As a Team Leader
*   **Action:** I want players to be assigned unique roles (e.g., *Scribe* who sees the cipher, *Artisan* who has the interactive keypads, *Oracle* who receives narrative hints)
*   **Business Value:** So that solve attempts require verbal or text collaboration, preventing a single "alpha player" from completing the game alone.
*   **Story Points:** 8 SP
*   **Priority:** Medium
*   **MoSCoW:** Should Have
*   **Sprint:** Sprint 4
*   **Dependencies:** US17, US18
*   **Acceptance Criteria:**
    1.  During the lobby staging phase or room entry, the game assigns distinct roles to each team member automatically or by player choice.
    2.  Role-specific visual cues and UI elements are rendered exclusively for that role (e.g., only the *Scribe* can see the glowing ancient text on the wall).
    3.  Puzzles must require combined actions from different roles to unlock (e.g., Scribe decodes, Artisan enters, Oracle times).
    4.  Role distribution adapts dynamically if players disconnect (auto-balancing remaining roles).
*   **Definition of Done:**
    *   ≥80% test coverage for role state logic.
    *   WCAG 2.1 AA keyboard/visual accessibility compliance.
    *   Component code reviewed for high modularity.

---

### US21: Shared AI Chat & Dynamic Assistance
*   **Epic:** AI Interaction
*   **Role:** As an Explorer
*   **Action:** I want the AI Hint and Narrator agents to participate in a shared team chat so that all players can view the AI's progressive hints and atmospheric narrations simultaneously
*   **Business Value:** So that the entire team remains aligned on hints and narrative progression without redundant queries.
*   **Story Points:** 8 SP
*   **Priority:** High
*   **MoSCoW:** Must Have
*   **Sprint:** Sprint 4
*   **Dependencies:** US17, US7, US8, US9, US13, US14
*   **Acceptance Criteria:**
    1.  Any player can submit a query to the AI Hint Agent, and both the query and the progressive hint response are rendered in the shared chat log for all connected players.
    2.  Dynamic atmospheric narrations triggered by room discoveries are broadcast in real-time to the team chat.
    3.  The team shares a global, unified AI hint cooldown (60s) to prevent spamming.
    4.  AI agent response SLA must remain under 3 seconds to preserve the real-time gameplay experience.
*   **Definition of Done:**
    *   End-to-end integration verified.
    *   AI response SLA ≤ 3 seconds verified under high concurrent load.
    *   ≥80% test coverage on chat synchronization.
    *   Strict prompt guidelines enforced against password leakage.

---

### US22: Global Team Win Condition
*   **Epic:** Game Logic
*   **Role:** As a Team Member
*   **Action:** I want the final gate to unlock only when all team-wide milestones are collectively reached and verified, culminating in a shared victory screen for the entire lobby
*   **Business Value:** So that the escape room concludes with a cohesive, shared team triumph.
*   **Story Points:** 5 SP
*   **Priority:** High
*   **MoSCoW:** Must Have
*   **Sprint:** Sprint 4
*   **Dependencies:** US17, US18, US11
*   **Acceptance Criteria:**
    1.  The final escape door remains firmly sealed until all 5 sequential chambers are unlocked by the team.
    2.  When the final trigger is solved, the victory state is broadcast, transitioning all players to a unified end-game cinematic.
    3.  The end screen lists all participating players, their respective roles, individual contribution stats (e.g., puzzles solved, items picked up), total time elapsed, and final cumulative score.
*   **Definition of Done:**
    *   Clean state tear-down upon victory.
    *   ≥80% test coverage for win state synchronization.
    *   WCAG 2.1 AA visual contrast on the victory interface.

---

### US23: Synchronized Team Leaderboard
*   **Epic:** AI System / Development
*   **Role:** As a Competitive Player
*   **Action:** I want our team's completion time, total mistakes, and final calculated score to be saved to a global Leaderboard under our Team Name
*   **Business Value:** So that we can compare our performance with other teams, driving healthy competition and engagement.
*   **Story Points:** 5 SP
*   **Priority:** Medium
*   **MoSCoW:** Should Have
*   **Sprint:** Sprint 4
*   **Dependencies:** US17, US22
*   **Acceptance Criteria:**
    1.  Upon successful escape, the team is prompted to enter a "Team Name".
    2.  The team's score, completion time, date, and player roster are persisted in the Supabase database.
    3.  A global, high-performance Leaderboard page displays the top 50 escape team records.
    4.  Real-time updates occur if another team pushes a better record.
    5.  The interface provides search and filter options by Team Name or player names.
*   **Definition of Done:**
    *   Query performance optimized with proper database indexes.
    *   Code reviewed by senior contributor.
    *   ≥80% database interaction test coverage.
    *   Fully accessible WCAG 2.1 AA leaderboard UI.
