"""Puzzle state machine for escape room progression."""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import StrEnum

from src.agents.puzzle_agent import PuzzleAgent, PuzzleDefinition, PuzzleValidationResult


class PuzzleState(StrEnum):
    LOCKED = "locked"
    AVAILABLE = "available"
    SOLVED = "solved"
    FAILED = "failed"


@dataclass
class Puzzle:
    definition: PuzzleDefinition
    state: PuzzleState = PuzzleState.AVAILABLE
    max_attempts: int | None = None
    attempts: int = 0
    unlocks: tuple[str, ...] = field(default_factory=tuple)


class PuzzleEngine:
    def __init__(self, agent: PuzzleAgent | None = None) -> None:
        self.agent = agent or PuzzleAgent()
        self._puzzles: dict[str, Puzzle] = {}

    @property
    def puzzles(self) -> dict[str, Puzzle]:
        return dict(self._puzzles)

    def add_puzzle(self, puzzle: Puzzle) -> None:
        self._puzzles[puzzle.definition.puzzle_id] = puzzle
        self.agent.register_puzzle(puzzle.definition)

    def unlock(self, puzzle_id: str) -> None:
        puzzle = self._get(puzzle_id)
        if puzzle.state == PuzzleState.LOCKED:
            puzzle.state = PuzzleState.AVAILABLE

    def submit(self, puzzle_id: str, answer: str) -> PuzzleValidationResult:
        puzzle = self._get(puzzle_id)
        if puzzle.state == PuzzleState.LOCKED:
            raise ValueError(f"Puzzle is locked: {puzzle_id}")
        if puzzle.state == PuzzleState.SOLVED:
            raise ValueError(f"Puzzle is already solved: {puzzle_id}")

        result = self.agent.validate_solution(puzzle_id, answer)
        puzzle.attempts += 1

        if result.correct:
            puzzle.state = PuzzleState.SOLVED
            for unlocked_id in puzzle.unlocks:
                self.unlock(unlocked_id)
        elif puzzle.max_attempts is not None and puzzle.attempts >= puzzle.max_attempts:
            puzzle.state = PuzzleState.FAILED

        return result

    def all_solved(self) -> bool:
        return bool(self._puzzles) and all(
            puzzle.state == PuzzleState.SOLVED for puzzle in self._puzzles.values()
        )

    def _get(self, puzzle_id: str) -> Puzzle:
        if puzzle_id not in self._puzzles:
            raise KeyError(f"Unknown puzzle: {puzzle_id}")
        return self._puzzles[puzzle_id]
