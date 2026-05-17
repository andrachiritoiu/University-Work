"""Atmospheric narrator agent for room and object descriptions."""

from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass


@dataclass(frozen=True)
class NarrationResult:
    target_id: str
    description: str
    style: str = "victorian mystery"


class NarratorAgent:
    """Produces consistent, varied descriptions for game targets."""

    def __init__(self) -> None:
        self._calls: defaultdict[str, int] = defaultdict(int)

    def describe(self, target_id: str, game_state: dict | None = None) -> NarrationResult:
        state = game_state or {}
        variants = DESCRIPTION_BANK.get(target_id, DESCRIPTION_BANK["default"])
        index = self._calls[target_id] % len(variants)
        self._calls[target_id] += 1

        description = variants[index]
        if state.get("solved"):
            description += " Whatever secret it guarded has already been disturbed."

        return NarrationResult(target_id=target_id, description=description)


DESCRIPTION_BANK: dict[str, tuple[str, ...]] = {
    "library": (
        "The library breathes dust and candle smoke, its shelves leaning like witnesses afraid to speak.",
        "Between the desks and blackboard, the room feels arranged by a mind that trusted numbers more than people.",
    ),
    "alchemy_lab": (
        "Glass vessels crowd the laboratory, each one stained by experiments that ended before dawn.",
        "A bitter mineral scent hangs over the lab, as if the stones themselves remember the formula.",
    ),
    "observatory": (
        "The tower opens toward a sky pricked with cold stars, every constellation waiting to be accused.",
        "Brass instruments sleep beneath moonlight, their needles trembling at patterns older than the room.",
    ),
    "crypt": (
        "The crypt answers each footstep with a hollow delay, then swallows the sound completely.",
        "Carved stone and old wax surround you, stern as judges in a forgotten trial.",
    ),
    "final_chamber": (
        "The final chamber is quiet in the way locked doors are quiet: patient, certain, almost amused.",
        "Ancient dust softens every edge, but the mechanisms beneath it still feel awake.",
    ),
    "default": (
        "The object seems ordinary until the light catches it, and then it becomes impossible to ignore.",
        "There is a deliberate quality to its placement, as though someone expected you to notice.",
    ),
}
