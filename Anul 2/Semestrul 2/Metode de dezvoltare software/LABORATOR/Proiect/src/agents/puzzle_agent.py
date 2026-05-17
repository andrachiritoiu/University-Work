"""Puzzle validation agent for the escape room backend.

The agent keeps the validation contract small and deterministic so it can be
used in tests or as a fallback when an LLM provider is unavailable.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from difflib import SequenceMatcher
import re
from typing import Iterable


def _normalise(value: str) -> str:
    return re.sub(r"\s+", " ", value.strip().lower())


@dataclass(frozen=True)
class PuzzleDefinition:
    """Static data needed to validate a puzzle answer."""

    puzzle_id: str
    answer: str
    aliases: tuple[str, ...] = ()
    difficulty: int = 1
    fuzzy_match: bool = False


@dataclass(frozen=True)
class PuzzleValidationResult:
    """Result returned after validating a submitted solution."""

    puzzle_id: str
    correct: bool
    feedback: str
    difficulty_score: int
    timestamp: str
    attempt_number: int


@dataclass(frozen=True)
class AttemptLogEntry:
    puzzle_id: str
    answer: str
    correct: bool
    timestamp: str


class PuzzleAgent:
    """Validates puzzle answers and records attempts.

    This class is intentionally provider-agnostic. A future LLM adapter can call
    into it as the deterministic fallback path.
    """

    def __init__(self, puzzles: Iterable[PuzzleDefinition] | None = None) -> None:
        self._puzzles: dict[str, PuzzleDefinition] = {}
        self._attempts: list[AttemptLogEntry] = []
        for puzzle in puzzles or ():
            self.register_puzzle(puzzle)

    @property
    def attempts(self) -> tuple[AttemptLogEntry, ...]:
        return tuple(self._attempts)

    def register_puzzle(self, puzzle: PuzzleDefinition) -> None:
        if not puzzle.puzzle_id:
            raise ValueError("puzzle_id is required")
        self._puzzles[puzzle.puzzle_id] = puzzle

    def validate_solution(self, puzzle_id: str, answer: str) -> PuzzleValidationResult:
        if puzzle_id not in self._puzzles:
            raise KeyError(f"Unknown puzzle: {puzzle_id}")

        puzzle = self._puzzles[puzzle_id]
        correct = self._is_correct(answer, puzzle)
        timestamp = datetime.now(timezone.utc).isoformat()
        self._attempts.append(
            AttemptLogEntry(
                puzzle_id=puzzle_id,
                answer=answer,
                correct=correct,
                timestamp=timestamp,
            )
        )

        return PuzzleValidationResult(
            puzzle_id=puzzle_id,
            correct=correct,
            feedback=self._feedback(correct),
            difficulty_score=max(1, min(10, puzzle.difficulty)),
            timestamp=timestamp,
            attempt_number=sum(1 for item in self._attempts if item.puzzle_id == puzzle_id),
        )

    def _is_correct(self, answer: str, puzzle: PuzzleDefinition) -> bool:
        submitted = _normalise(answer)
        accepted = {_normalise(puzzle.answer), *(_normalise(alias) for alias in puzzle.aliases)}
        if submitted in accepted:
            return True

        if not puzzle.fuzzy_match:
            return False

        return any(SequenceMatcher(None, submitted, option).ratio() >= 0.86 for option in accepted)

    @staticmethod
    def _feedback(correct: bool) -> str:
        if correct:
            return "Correct. The mechanism yields and the path ahead changes."
        return "Incorrect. The room remains still, but the clue is not far away."


DEFAULT_PUZZLES = (
    PuzzleDefinition("level1_lock", "7391", difficulty=4),
    PuzzleDefinition("level2_gold", "au", aliases=("gold",), difficulty=5, fuzzy_match=True),
    PuzzleDefinition("level2_silver", "silver", aliases=("ag",), difficulty=4, fuzzy_match=True),
    PuzzleDefinition("level2_caesar", "distill", difficulty=6, fuzzy_match=True),
    PuzzleDefinition("level4_candle_morse", "-.-. .- -. -.. .-.. .", difficulty=6),
    PuzzleDefinition("level4_open", "open", difficulty=3, fuzzy_match=True),
    PuzzleDefinition("level4_cipher", "cipher", difficulty=4, fuzzy_match=True),
)


def build_default_puzzle_agent() -> PuzzleAgent:
    return PuzzleAgent(DEFAULT_PUZZLES)
