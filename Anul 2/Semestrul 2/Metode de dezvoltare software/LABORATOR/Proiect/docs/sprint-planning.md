# Sprint Planning & Task Allocation

This document outlines the balanced task allocation for the **MDS Escape Room** project. To ensure active full-stack participation across the entire codebase (UI, backend business logic, and AI integration), every team member is assigned ownership of one distinct **Escape Room Level**, along with the development of one overarching **Core Game System (Epic)**.

---

## 👥 Team Allocation

### 1. Ionel Otilia
- **Level Ownership:** Level 1 *(The Mathematical Library)*
- **Core System Ownership:** Project Setup, Core Game Engine & Win Condition
- **Backlog User Stories:**
  - **US1 & US2:** Implementation of room navigation, screen rendering, and state-based object interaction.
  - **US3 & US4:** Architectural foundation for mechanical puzzles (e.g., `SudokuGrid`, `CombinationLock`) and correct/incorrect flow handling.
  - **US11:** (*Unlock final door*) Integration of global game state logic to trigger the main victory condition, calculating total completion time and generating end-session metadata.

### 2. Chirițoiu Andra Florentina
- **Level Ownership:** Level 3 *(The Astronomer's Tower)*
- **Core System Ownership:** Global Evidence & Inventory System
- **Backlog User Stories:**
  - **US5:** Creation of the global state management system (React Context API) to securely track and persist collected items across different chambers.
  - **US6:** Development of the global Inventory Panel UI, including dynamic animations, item inspection utilities (zoom/read description on click), and base logic for future item combinations.

### 3. Vlad Ioana Gabriela
- **Level Ownership:** Level 4 *(The Crypt of Codes)*
- **Core System Ownership:** AI Hint & Assistance Engine
- **Backlog User Stories:**
  - **US8:** Front-end integration of the Hint System, managing dynamic anti-spam mechanisms (60-second cooldown limits) and current hint states.
  - **US13:** Serverless Endpoint Architecture for the **Hint Agent**. This involves strict prompt engineering via the OpenAI/Anthropic SDK: injecting current game progress context and forcing the LLM to return only vague, progressive clues without ever leaking the hardcoded passwords.

### 4. Pupăză Alexandra Maria
- **Level Ownership:** Level 5 *(The Final Chamber)*
- **Core System Ownership:** AI Narrator & Conversational Interface
- **Backlog User Stories:**
  - **US7:** Modular development of the floating conversational interface (*Chat Window*), featuring sanitized inputs, continuous scrolling, and UX elements such as typing indicators and loading spinners.
  - **US9 & US14:** Backend routing for the **Narrator Agent**. Taking room metadata ("The player is inspecting the fireplace") to invoke the LLM's *Victorian mystery storytelling* persona, enhancing the immersive RPG atmosphere of the escape room.

### 5. Dăianu Maria Iuliana
- **Level Ownership:** Level 2 *(The Alchemist's Lab)*
- **Core System Ownership:** AI Validation Logic, DevOps & QA
- **Backlog User Stories:**
  - **US12:** **Puzzle Validator Agent**. Upgrading from classic numeric validations to intelligent, LLM-powered endpoints capable of validating non-standard player inputs for textual puzzles or open-ended riddles (e.g., mixing reagents in Level 2).
  - **US15:** Establishing the automated testing environment (bundling Vitest/Jest libraries, integrating test suites, and writing formal AI SLA evaluations to verify the <3 seconds response threshold).
  - **US16:** CI/CD Pipeline engineering (`.github/workflows/ci.yml`), enforcing automated build and test checks on every Push and Pull Request.

---

## 🚀 Sprint 4: Multiplayer Extension (Team Collaboration)

To extend the escape room into a fully collaborative multiplayer experience, the core game systems are extended in Sprint 4 with balanced full-stack responsibility across the exact same ownership boundaries:

### 1. Ionel Otilia (Host/Join Staging & Unified Win Condition)
*   **Level/Core System Focus:** Room Session Orchestrator
*   **Sprint 4 Stories:**
    *   **US17 (Room Code & Sessions):** Implementation of multiplayer host/join corridor logic and staging lobby.
    *   **US22 (Global Team Win Condition):** Synchronization of victory triggers across all players and rendering of individual player contributions on the final team win screen.

### 2. Chirițoiu Andra Florentina (Shared Team Inventory & Sync)
*   **Level/Core System Focus:** Shared Inventory Engine
*   **Sprint 4 Stories:**
    *   **US19 (Shared Team Inventory):** Creation of a unified team inventory state context using WebSockets to synchronize collections, inspect events, and item consumption.

### 3. Vlad Ioana Gabriela (Shared Team AI Chat & Cooldowns)
*   **Level/Core System Focus:** Team Hint Synchronization
*   **Sprint 4 Stories:**
    *   **US21 (Shared AI Chat):** Development of the team-wide shared chat panel, coordinating progressive hints and managing global team-wide 60-second request cooldowns.

### 4. Pupăză Alexandra Maria (Role Assignment & Dynamic Views)
*   **Level/Core System Focus:** Cooperative Asymmetrical Gameplay
*   **Sprint 4 Stories:**
    *   **US20 (Collaborative Role Assignment):** Designing asymmetric UI layouts and role-based visibility checks (Scribe, Artisan, Oracle) to prevent solo-run behavior.

### 5. Dăianu Maria Iuliana (Real-time State Synchronization & Database Leaderboard)
*   **Level/Core System Focus:** WebSockets Concurrency & Leaderboard API
*   **Sprint 4 Stories:**
    *   **US18 (Real-Time Sync):** Socket connection management and optimistic state updates for locks, chests, and levers across player screens.
    *   **US23 (Synchronized Team Leaderboard):** Design and optimization of the multi-user team ranking board with database indexing and query filters.

---

## 🛠️ Process & Version Control Rules (MDS Requirements)

This section ensures adherence to professional software development principles in accordance with Agile methodology and grading criteria.

1. **Branching Strategy:** 
   The team will work entirely via branch isolation. Any modification must originate from a descriptively named branch mapped from main: `git checkout -b feature/<module_name>` (e.g., `feature/inventory-ui`, `fix/chat-overflow`).
   
2. **Commit Policy:** 
   To guarantee accurate tracking of individual contributions, a minimum of 5 clearly named commits (following conventional formatting) is required from every member (`feat: implement puzzle agent logic`).
   
3. **Pull Requests (PR) & Code Review:**
   Direct pushes into the protected `main` branch are strictly prohibited. Features will be merged exclusively through the GitHub **Pull Request** system, which requires at least one formal *Approve* from a different contributor.

4. **Bug Tracking via Issues:** 
   Any technical defect encountered must be formally reported as a **GitHub Issue**. The dedicated bug-fix branch resolving the defect must be linked to the Issue index (e.g., *"Fixes #14"*).

5. **AI Development Transparency:** 
   All contributors must maintain archives of conversations ("prompt snapshots") with the LLM assistants used for pair programming. This evidence will be centralized and evaluated within the standard project documentation: `docs/ai-usage-report.md`.
