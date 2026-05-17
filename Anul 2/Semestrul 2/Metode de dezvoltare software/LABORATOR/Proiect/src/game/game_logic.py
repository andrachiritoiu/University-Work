"""High-level game coordinator for backend routes and tests."""

from __future__ import annotations

from dataclasses import asdict
from time import monotonic

from src.agents.hint_agent import HintAgent, HintResult
from src.agents.narrator_agent import NarratorAgent, NarrationResult
from src.agents.puzzle_agent import DEFAULT_PUZZLES, PuzzleAgent, PuzzleValidationResult
from src.game.inventory import Inventory
from src.game.puzzle_engine import Puzzle, PuzzleEngine, PuzzleState


class EscapeRoomGame:
    """Coordinates puzzles, hints, narration, inventory and win condition."""

    def __init__(self) -> None:
        self.started_at = monotonic()
        self.inventory = Inventory()
        self.hint_agent = HintAgent()
        self.narrator_agent = NarratorAgent()
        self.puzzle_agent = PuzzleAgent()
        self.puzzle_engine = PuzzleEngine(self.puzzle_agent)
        for definition in DEFAULT_PUZZLES:
            self.puzzle_engine.add_puzzle(Puzzle(definition=definition))

    def submit_solution(self, puzzle_id: str, answer: str) -> PuzzleValidationResult:
        return self.puzzle_engine.submit(puzzle_id, answer)

    def request_hint(
        self,
        puzzle_id: str,
        player_id: str = "anonymous",
        progress: dict | None = None,
        solution: str | None = None,
    ) -> HintResult:
        return self.hint_agent.request_hint(
            puzzle_id=puzzle_id,
            player_id=player_id,
            progress=progress,
            solution=solution,
        )

    def narrate(self, target_id: str, state: dict | None = None) -> NarrationResult:
        return self.narrator_agent.describe(target_id, state)

    def is_complete(self) -> bool:
        return self.puzzle_engine.all_solved()

    def snapshot(self) -> dict:
        puzzles = {
            puzzle_id: {
                "state": puzzle.state.value,
                "attempts": puzzle.attempts,
                "max_attempts": puzzle.max_attempts,
            }
            for puzzle_id, puzzle in self.puzzle_engine.puzzles.items()
        }
        return {
            "complete": self.is_complete(),
            "elapsed_seconds": int(monotonic() - self.started_at),
            "inventory": [asdict(item) for item in self.inventory.items],
            "puzzles": puzzles,
        }

    def force_complete_for_demo(self) -> None:
        for puzzle in self.puzzle_engine._puzzles.values():
            puzzle.state = PuzzleState.SOLVED


game = EscapeRoomGame()
