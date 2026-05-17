# AI Escape Room
### *An Intelligent Puzzle-Solving Experience Powered by Multi-Agent AI*

> Academic Project · MDS Course · Faculty of Mathematics and Computer Science · University of Bucharest · 2025–2026

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)
[![Ollama](https://img.shields.io/badge/Ollama-000000?style=for-the-badge&logo=ollama&logoColor=white)](https://ollama.com/)
[![WebSockets](https://img.shields.io/badge/WebSockets-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
[![Pytest](https://img.shields.io/badge/Pytest-0A9EDC?style=for-the-badge&logo=pytest&logoColor=white)](https://pytest.org/)
[![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Architecture](#architecture)
- [AI Agents](#ai-agents)
- [Getting Started](#getting-started)
- [Testing & Evaluations](#testing--evaluations)
- [CI/CD Pipeline](#cicd-pipeline)
- [Backlog](#backlog)
- [Definition of Done](#definition-of-done)
- [Diagrams](#diagrams)
- [Bug Reports & Pull Requests](#bug-reports--pull-requests)
- [AI Usage in Development](#ai-usage-in-development)
- [Demo](#demo)
- [Team](#team)

---

## Project Overview

**AI Escape Room** is a browser-based puzzle game that reimagines the classic escape room format through the lens of artificial intelligence. The player is placed inside a virtual room and must explore the environment, collect evidence, solve logic and cipher puzzles, and interact with an intelligent assistant to receive narrative descriptions, contextual hints, and solution validation — all generated dynamically by language models.

The system is built around three specialised AI agents: a **Puzzle Agent** that validates solutions, a **Hint Agent** that delivers progressive clues without ever spoiling the answer, and a **Narrator Agent** that generates immersive atmospheric descriptions of the game world in the style of Victorian mystery fiction.

What sets this project apart from a conventional escape room is the degree to which AI is woven into the core gameplay loop — not as a bolt-on feature, but as the primary interface between the player and the game world. Every hint, every room description, and every validation decision passes through a language model. The game adapts to the player's progress in real time, and no two sessions are identical.

AI tooling was also used extensively throughout the development process itself — from generating user stories and architecture diagrams, to writing test suites and debugging agent behaviour. The full account of this is documented in the [AI Usage in Development](#ai-usage-in-development) section and in [`docs/ai-usage-report.md`](docs/ai-usage-report.md).

---

## Features

### Exploration and Interaction

- Navigate and inspect a room populated with interactive objects
- All interactive zones are highlighted; clues are visually distinct from background objects
- Click or touch any object to surface a close-up view, description, and embedded clues

### Puzzle System

- Multiple puzzle types: logic, pattern recognition, and cipher challenges
- Code-based locks that accept numeric or text input
- Correct code: object animates open and the attempt is logged
- Incorrect code: error message shown without revealing the solution; attempt counter increments
- Configurable maximum attempt limit; puzzle states persisted across the session

### Inventory

- Pick up collectable items that disappear from the scene on collection
- Browse the full inventory with item names, icons, and descriptions
- Combine items to unlock additional puzzle paths
- Inventory state persisted between sessions

### AI Interaction

- Free-text chat interface for asking questions about the game world
- All AI responses delivered within 3 seconds and reference current game state
- Contextual hints across three escalating levels — vague, moderate, specific
- 60-second cooldown between hint requests per puzzle; solution is never disclosed
- Atmospheric object and area descriptions generated on demand by the Narrator Agent
- Loading indicator shown while the AI processes; timeout handled gracefully

### Game Logic

- Real-time progress tracking across all puzzle states
- Visual and audio feedback on every puzzle completion
- Final door unlock triggered only when all puzzles are solved
- Victory screen displaying total elapsed time and score; optional leaderboard integration

### Multiplayer & Real-Time Sync (Sprint 4 Planned)

- **Hosted Sessions**: Host or join escape rooms via a secure, unique 6-digit room code
- **WebSocket Synchronization**: Instantly synchronize room states, chest unlocks, and dial rotations
- **Shared Team Inventory**: Items collected by any teammate are added to a global context accessible to all
- **Collaborative Roles**: Optional asymmetric assignments (Scribe, Artisan, Oracle) to force verbal team solving
- **Shared AI Assistance**: Unified team chat with Hint/Narrator agents sharing a global 60s cooldown limit
- **Synchronized Team Leaderboard**: High-performance team ranking boards directly integrated with Supabase

---

## Architecture

### Project Structure

```
src/
    agents/
        puzzle_agent.py       # Validates puzzle solutions via LLM
        hint_agent.py         # Generates progressive contextual hints
        narrator_agent.py     # Produces atmospheric environment descriptions
    game/
        room.py               # Room state and object management
        inventory.py          # Item collection and storage logic
        puzzle_engine.py      # Puzzle state machine and progression
        game_logic.py         # Win condition and feedback controller
    api/
        routes.py             # REST endpoints for frontend communication
frontend/
    components/               # React / Next.js UI components
    pages/                    # Next.js page routing
    styles/                   # Tailwind configuration
tests/
    unit/
        test_puzzle_agent.py
        test_hint_agent.py
        test_narrator_agent.py
        test_game_logic.py
    e2e/                      # Playwright end-to-end tests
docs/
    backlog.pdf               # Full product backlog with acceptance criteria
    ai-usage-report.md        # AI tool usage report
    diagrams/                 # UML and architecture diagrams
.github/
    workflows/
        ci.yml                # Build, test, and coverage pipeline
```

### Component Diagram

```
┌──────────────────────────────────────────────────┐
│           Frontend  (Next.js / TypeScript)        │
│           TailwindCSS · shadcn/ui                 │
└──────────────────────┬───────────────────────────┘
                       │  HTTP / WebSocket
┌──────────────────────▼───────────────────────────┐
│           Backend  (FastAPI / Python)             │
│           Game Logic · State Manager · REST API   │
└──────────┬───────────────────────────┬───────────┘
           │  Agent Calls              │  Persistence
┌──────────▼──────────────┐  ┌────────▼────────────┐
│  AI Agent Layer         │  │  PostgreSQL          │
│  OpenAI API · Ollama    │  │  Game State          │
│                         │  │  Player Progress     │
│  Puzzle Agent           │  │  Puzzle Records      │
│  Hint Agent             │  │  Inventory           │
│  Narrator Agent         │  │  Attempt Logs        │
└─────────────────────────┘  └─────────────────────┘
```

---

## AI Agents

All three agents are stateless — game context is injected per request — making them independently testable and replaceable. All operate under a strict **3-second response SLA**.

### Puzzle Agent

Receives a player solution and the current puzzle definition. Returns a `correct` or `incorrect` verdict, logs the attempt with a timestamp, and assigns a difficulty rating. On failure, a fallback validation path ensures no game-breaking errors propagate.

### Hint Agent

Receives the current player progress state and the active puzzle identifier. Returns a hint calibrated to the appropriate escalation level: level 1 is intentionally vague, level 2 moderates the guidance, level 3 provides a specific nudge — without ever disclosing the solution. A 60-second cooldown applies between requests per puzzle. After three hints, the player is directed to keep reasoning independently.

### Narrator Agent

Receives an object or area identifier and returns a consistent, atmospheric description in the style of Victorian mystery fiction. Descriptions are varied across repeated queries to prevent repetition fatigue and maintain immersion.

---

## Getting Started

### Prerequisites

- Python `3.11` or higher
- Node.js `18` or higher
- An OpenAI API key **or** a local [Ollama](https://ollama.com/) instance
- PostgreSQL running locally or via Docker

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/ai-escape-room.git
cd ai-escape-room

# Backend dependencies
pip install -r requirements.txt

# Frontend dependencies
cd frontend && npm install
```

### Configuration

Create a `.env` file in the project root:

```env
LLM_API_KEY=your_api_key_here
LLM_MODEL=claude-sonnet-4-20250514
MAX_HINT_LEVEL=3
HINT_COOLDOWN_SECONDS=60
AGENT_RESPONSE_TIMEOUT_SECONDS=3
DATABASE_URL=postgresql://user:password@localhost:5432/escaperoom
```

### Running the Application

```bash
# Backend
uvicorn src.api.routes:app --reload

# Frontend (separate terminal)
cd frontend && npm run dev
```

Open `http://localhost:3000` in your browser.

---

## Testing & Evaluations

The project maintains a minimum code coverage threshold of **80%** across all modules. Testing is split into three layers: unit tests, integration tests, and AI agent evaluations.

### Unit and Integration Tests

```bash
# Run all tests with coverage report
pytest tests/ --cov=src --cov-report=term-missing

# Run a specific module
pytest tests/unit/test_puzzle_agent.py -v
```

### End-to-End Tests (Playwright)

```bash
npx playwright test
```

Playwright tests cover the full player journey: room entry, object interaction, puzzle solving, hint requests, and final escape.

### AI Agent Evaluations

Agent behaviour is validated against three criteria in every CI run:

| Evaluation | Criterion | How It Is Tested |
|---|---|---|
| **Hint Quality** | Hints must never expose the full solution | Automated string-match checks against known solutions |
| **Response Consistency** | Agents must stay in character across multi-turn interactions | Sequence tests with contrasting game states |
| **Context Awareness** | Responses must accurately reflect the current game state | State injection tests with known expected outputs |
| **SLA Compliance** | All responses within 3 seconds | Response time assertions in integration tests |

Evaluation results are reported as part of the CI pipeline output on every push.

---

## CI/CD Pipeline

Automated via **GitHub Actions** on every push and pull request to `main`.

```
push / pull request to main
          ↓
Checkout repository
          ↓
Set up Python 3.11 + Node.js 18
          ↓
Install backend and frontend dependencies
          ↓
Run Pytest unit and integration tests
          ↓
Run Playwright end-to-end tests
          ↓
Run AI agent evaluations
          ↓
Generate and publish coverage report
          ↓
Block merge if any test fails or coverage < 80%
```

Pipeline configuration: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

No code reaches `main` without a passing build. Failure notifications are sent to the team channel automatically.

---

## Backlog

The full product backlog is available in [`docs/backlog.pdf`](docs/backlog.pdf). The collaborative multiplayer backlog is located in [`docs/multiplayer-backlog.md`](docs/multiplayer-backlog.md).

### Sprint Overview

| Sprint | User Stories | Story Points | Focus |
|---|---|---|---|
| Sprint 1 | US1, US2, US3, US4 | 15 | Core exploration and puzzle mechanics |
| Sprint 2 | US5, US6, US7, US8, US10, US12, US13 | 33 | Inventory, AI interaction, agent backends |
| Sprint 3 | US9, US11, US14, US15, US16 | 22 | Narration, win condition, testing, CI/CD |
| **Sprint 4** | **US17, US18, US19, US20, US21, US22, US23** | **52** | **Multiplayer Extension & Synchronized Leaderboard** |
| **Total** | **23 user stories** | **122 story points** | |

### Epics

| Epic | User Stories | Priority | Description |
|---|---|---|---|
| Exploration | US1, US2 | High | Room navigation and object interaction |
| Puzzle System | US3, US4 | High | Core puzzle mechanics and code unlocking |
| Evidence / Items | US5, US6 | Medium | Item collection and inventory management |
| AI Interaction | US7, US8, US9 | Critical | AI-powered chat, hints, and narration |
| Game Logic | US10, US11 | High | Feedback, progression, and win condition |
| AI System | US12, US13, US14 | Critical | Puzzle, Hint, and Narrator agent backends |
| Development | US15, US16 | Medium | Automated tests and CI/CD pipeline |
| Multiplayer Core / Sync | US17, US18, US19, US20, US21, US22, US23 | High | Real-time session synchronization, shared inventory, asymmetrical roles, and team leaderboard. |

### Selected Acceptance Criteria

<details>
<summary><strong>US3 — Solve puzzles to progress</strong></summary>

```
Given the player accesses a puzzle
When they complete the required interaction
Then the puzzle state updates to 'solved'
And the next puzzle or item becomes accessible
```

</details>

<details>
<summary><strong>US4 — Enter codes to unlock objects</strong></summary>

```
Given the player enters a correct code
Then the object unlocks and an animation plays
And the attempt is logged

Given the player enters an incorrect code
Then an error message is shown without revealing the solution
And the attempt counter increments
```

</details>

<details>
<summary><strong>US7 — Chat with AI for information</strong></summary>

```
Given the player sends a message
When the message is processed
Then the AI responds within 3 seconds
And the response is contextually relevant to the current game state
And no out-of-character text is returned
```

</details>

<details>
<summary><strong>US8 — Receive hints when stuck</strong></summary>

```
Given the player requests a hint
Then a partial, level-appropriate clue is returned
And the full solution is never revealed
And each subsequent request escalates the hint level (vague → moderate → specific)
And a 60-second cooldown applies between requests for the same puzzle
And after 3 hints the player is encouraged to try independently
```

</details>

<details>
<summary><strong>US11 — Unlock the final door</strong></summary>

```
Given all puzzles are marked as solved
When the player interacts with the final door
Then the door opens with an animation
And a victory screen displays total time and score
```

</details>

<details>
<summary><strong>US12 — Puzzle Agent validates solutions</strong></summary>

```
Given a solution is submitted
When the Puzzle Agent processes it
Then it returns a correct/incorrect verdict with a difficulty rating
And the attempt is logged with a timestamp
And errors trigger a fallback validation path
```

</details>

<details>
<summary><strong>US13 — Hint Agent generates contextual hints</strong></summary>

```
Given the player's progress state and puzzle ID are passed to the Hint Agent
When the agent generates a hint
Then it references the specific puzzle and current progress
And it does not reveal the full solution
And it is consistent with game lore
```

</details>

<details>
<summary><strong>US16 — CI/CD pipeline</strong></summary>

```
Given a developer pushes code
When the CI pipeline triggers
Then the build completes successfully
And all tests run automatically
And failing builds block merges to main
```

</details>

<details>
<summary><strong>US17 — Room Code & Multiplayer Sessions</strong></summary>

```
Given a player is in the main lobby
When they click "Host Game"
Then a unique 6-digit room code is generated
And they are placed in a multiplayer staging area

Given other players enter this 6-digit room code
When they click "Join Game"
Then they are added to the exact same shared lobby instance
```

</details>

<details>
<summary><strong>US19 — Shared Team Inventory</strong></summary>

```
Given Player A picks up an item in the room
When they collect it
Then it is removed from the scene for all players
And it instantly appears in the shared team inventory visible to Player B
And any player in the team can equip or examine the item
```

</details>

---

## Definition of Done

A user story is considered complete when every criterion in the following checklist is satisfied:

| # | Category | Criterion | Applies To |
|---|---|---|---|
| 1 | Code Quality | Reviewed by at least one peer; all comments resolved | All US |
| 2 | Code Quality | Follows agreed naming conventions and style guide | All US |
| 3 | Testing | Unit tests written for all new functions and components | All US |
| 4 | Testing | All existing tests pass; no regressions introduced | All US |
| 5 | Testing | Code coverage ≥ 80% for the affected module | US15, US16 |
| 6 | AI Agents | Agent responds within the 3-second SLA | US7–US9, US12–US14 |
| 7 | AI Agents | Agent outputs reviewed for quality and relevance | US12–US14 |
| 8 | AI Agents | Hint Agent never exposes complete puzzle solutions | US13 |
| 9 | Acceptance Criteria | All acceptance criteria verified by QA | All US |
| 10 | Product Owner | Story reviewed and signed off | All US |
| 11 | Documentation | Code documented with docstrings or inline comments | All US |
| 12 | CI/CD | Pipeline passes on the feature branch before merge to `main` | All US |
| 13 | Deployment | Feature deployed to staging and smoke-tested at sprint end | Sprint end |
| 14 | Security | No hardcoded credentials or API keys in source code | All US |
| 15 | Accessibility | UI elements meet WCAG 2.1 AA colour contrast standards | US1–US11 |

---

## Diagrams

All diagrams are maintained in [`docs/diagrams/`](docs/diagrams/) and were produced with AI assistance using tools such as Mermaid and draw.io.

| Diagram | Description | File |
|---|---|---|
| Component Architecture | High-level system component map | [`docs/diagrams/architecture.png`](docs/diagrams/architecture.png) |
| Database Schema (ERD) | PostgreSQL tables and relationships | [`docs/diagrams/erd.png`](docs/diagrams/erd.png) |
| Agent Interaction Sequence | UML sequence diagram for AI agent calls | [`docs/diagrams/agent-sequence.png`](docs/diagrams/agent-sequence.png) |
| Gameplay State Machine | Puzzle state transitions and win condition | [`docs/diagrams/state-machine.png`](docs/diagrams/state-machine.png) |
| CI/CD Workflow | Pipeline stages and decision gates | [`docs/diagrams/cicd-workflow.png`](docs/diagrams/cicd-workflow.png) |

---

## Bug Reports & Pull Requests

All bugs are tracked as GitHub Issues and resolved via dedicated feature branches and pull requests. Each PR references the issue it closes and must pass the full CI pipeline before merge.

The full history is available in the [Issues](../../issues) and [Pull Requests](../../pulls) tabs.

---

## AI Usage in Development

A detailed report is maintained in [`docs/ai-usage-report.md`](docs/ai-usage-report.md). The summary below reflects how AI tools were used across every phase of the project.

| Phase | Tools Used | What Was Generated |
|---|---|---|
| **Requirements** | ChatGPT, Claude | User stories, acceptance criteria |
| **Architecture** | Claude| Component diagrams, ERD, sequence diagrams |
| **Documentation** | Claude | README structure, docstrings, inline comments |

The full report includes the specific prompts used, the outputs produced, and an honest assessment of where AI accelerated development and where manual correction was necessary — including cases where generated code was incorrect and had to be revised.

---

## Demo

> A recorded screencast demonstrating the complete gameplay — room exploration, puzzle solving, AI hint interaction, and final escape — will be linked here before the final presentation.

---


<p align="center">
  <i>Can you escape before time runs out?</i>
</p>
