
# AI Usage Report

## Scope

This document records how AI assistance was used during the development of the
AI Escape Room project. It focuses on implementation support, debugging,
documentation and quality checks. Human developers remained responsible for
reviewing, adapting and accepting all generated changes.

## Tools Used

| Tool | Usage |
|---|---|
| ChatGPT / Codex | Code generation, refactoring support, backlog analysis, documentation drafting and test design |
| Groq API | Runtime AI hint generation through the Next.js `/api/hint` route |
| Gemini API | Runtime answer validation fallback path through `/api/validate-answer` |
| Deterministic fallback logic | Local non-LLM behavior for hints, narration and validation when API keys are missing or requests timeout |

## Development Contributions

### Backend Agents

AI assistance was used to scaffold and refine the Python backend layer:

- `PuzzleAgent` for answer validation, aliases, fuzzy matching and attempt logs.
- `HintAgent` for progressive hints, cooldown handling and solution leak protection.
- `NarratorAgent` for Victorian mystery style descriptions.
- `PuzzleEngine`, `Inventory`, `Room` and `EscapeRoomGame` for backend game state coordination.
- FastAPI routes for health checks, state snapshots, answer validation, hints and narration.

The generated code was reviewed and verified locally with Python compilation and
unit tests.

### Frontend AI Routes

AI assistance was used to improve the Next.js serverless AI endpoints:

- `/api/hint` now supports progressive hint levels, per-player cooldown and local fallback behavior.
- `/api/validate-answer` now has deterministic validation when Gemini is unavailable.
- `/api/narrate` provides narrator descriptions with Groq integration and local fallback descriptions.
- `AIHintDialog` sends a stable `playerId` and `puzzleId` so hint progression is tracked consistently.

### Final Game Flow

AI assistance was used to implement the final escape flow in Level 5:

- final door completion state;
- victory screen;
- elapsed time and remaining time display;
- score calculation;
- final progress persistence with `escapeRoomCompletedLevel = "5"`;
- confetti feedback.

### Testing and CI

AI assistance was used to create a focused Python unit test suite:

- `test_puzzle_agent.py`
- `test_hint_agent.py`
- `test_narrator_agent.py`
- `test_game_logic.py`

The suite currently contains 17 tests and passes with:

```powershell
python -m unittest discover -s tests -p "test_*.py"
C:\tmp\mds-escape-room-venv\bin\python.exe -m pytest tests
```

AI assistance was also used to add GitHub Actions CI:

- Python unit tests with `pytest`;
- frontend dependency installation with `npm ci`;
- frontend production build with `npm run build`.

## Verification Performed

The following checks were run locally after the relevant changes:

```powershell
python -m compileall src
python -m unittest discover -s tests -p "test_*.py"
C:\tmp\mds-escape-room-venv\bin\python.exe -m pytest tests
npm.cmd run build
```

Results:

- Python source compiled successfully.
- Unit tests passed: 17 tests.
- Frontend build completed successfully.

## Human Review Notes

AI-generated code was not accepted blindly. The implementation was adjusted to:

- avoid depending on external API keys for the basic gameplay loop;
- keep fallback behavior deterministic and testable;
- preserve existing local frontend changes that were already present in the working tree;
- commit work in small logical chunks on the `andra` branch;
- keep commit messages in English.

## Limitations

The following items still require human/team follow-up:

- Review the exact wording of AI hints and narrator text for gameplay quality.
- Confirm the final score formula with the product owner.
- Decide whether all levels should use the new generic persistent state hook.
- Add frontend component tests or Playwright end-to-end tests if required by the grading rubric.
