"""Progressive hint agent for escape room puzzles."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
import re


@dataclass(frozen=True)
class HintResult:
    puzzle_id: str
    hint: str
    level: int
    cooldown_remaining: int


class HintAgent:
    """Returns progressive hints without exposing full puzzle solutions."""

    def __init__(self, cooldown_seconds: int = 60, max_level: int = 3) -> None:
        self.cooldown_seconds = cooldown_seconds
        self.max_level = max_level
        self._last_request: dict[tuple[str, str], datetime] = {}
        self._hint_levels: dict[tuple[str, str], int] = {}

    def request_hint(
        self,
        puzzle_id: str,
        player_id: str = "anonymous",
        progress: dict | None = None,
        solution: str | None = None,
    ) -> HintResult:
        key = (player_id, puzzle_id)
        now = datetime.now(timezone.utc)
        previous = self._last_request.get(key)

        if previous is not None:
            remaining = self.cooldown_seconds - int((now - previous).total_seconds())
            if remaining > 0:
                return HintResult(
                    puzzle_id=puzzle_id,
                    hint=f"The spirits are still gathering their thoughts. Try again in {remaining}s.",
                    level=self._hint_levels.get(key, 1),
                    cooldown_remaining=remaining,
                )

        next_level = min(self._hint_levels.get(key, 0) + 1, self.max_level)
        self._hint_levels[key] = next_level
        self._last_request[key] = now

        hint = self._build_hint(puzzle_id, next_level, progress or {})
        if solution:
            hint = self._remove_solution_leaks(hint, solution)

        return HintResult(
            puzzle_id=puzzle_id,
            hint=hint,
            level=next_level,
            cooldown_remaining=0,
        )

    def reset_cooldown(self, puzzle_id: str, player_id: str = "anonymous") -> None:
        key = (player_id, puzzle_id)
        self._last_request.pop(key, None)

    def _build_hint(self, puzzle_id: str, level: int, progress: dict) -> str:
        known = HINT_BANK.get(puzzle_id, HINT_BANK["default"])
        hint = known[min(level, len(known)) - 1]

        if progress.get("attempts", 0) >= 3 and level >= self.max_level:
            return f"{hint} You have enough evidence now; test one careful idea."
        return hint

    @staticmethod
    def _remove_solution_leaks(hint: str, solution: str) -> str:
        if not solution.strip():
            return hint
        pattern = re.compile(re.escape(solution.strip()), re.IGNORECASE)
        return pattern.sub("[the answer]", hint)


HINT_BANK: dict[str, tuple[str, str, str]] = {
    "level1_lock": (
        "The board is not only solved; it hides a smaller shape inside itself.",
        "Look at the corners of the central square after the grid is complete.",
        "Read the four central-corner digits in a stable order before touching the lock.",
    ),
    "level2_journal": (
        "The alchemist repeats numbers because the elements are doing arithmetic.",
        "Match each gate with the verb that describes its alchemical action.",
        "The Roman numerals and element symbols narrow each blank to one exact ritual step.",
    ),
    "level3_constellation": (
        "Not every bright pattern is ancient enough to open the tower.",
        "The correct shape has a belt and two shoulders.",
        "Connect the hunter, not the queen or the northern guide.",
    ),
    "level4_morse": (
        "Short and long marks behave like an alphabet, not decoration.",
        "Decode words as letters, and encode answers letter by letter.",
        "Keep spaces between Morse letters and slashes only between words.",
    ),
    "level5_relics": (
        "The final room cares about order as much as possession.",
        "Dust hides the rule, and the chest holds the pieces.",
        "Read the altar clue before placing the four relics from left to right.",
    ),
    "default": (
        "Start from the object that changed most recently.",
        "Separate clues that describe order from clues that describe content.",
        "Try the smallest answer that satisfies every visible clue.",
    ),
}
