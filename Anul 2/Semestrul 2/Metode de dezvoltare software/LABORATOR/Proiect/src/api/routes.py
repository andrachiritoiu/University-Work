"""FastAPI routes for the escape room backend.

The module can still be imported in environments where FastAPI is not installed;
in that case ``app`` is left as ``None`` and the game service remains usable.
"""

from __future__ import annotations

from dataclasses import asdict
from typing import Any

from src.game.game_logic import game

try:
    from fastapi import FastAPI, HTTPException
    from pydantic import BaseModel
except ModuleNotFoundError:  # pragma: no cover - exercised only without deps
    FastAPI = None  # type: ignore[assignment]
    HTTPException = Exception  # type: ignore[assignment]
    BaseModel = object  # type: ignore[assignment]


if FastAPI is not None:

    class ValidateSolutionRequest(BaseModel):
        puzzle_id: str
        answer: str

    class HintRequest(BaseModel):
        puzzle_id: str
        player_id: str = "anonymous"
        progress: dict[str, Any] = {}
        solution: str | None = None

    class NarrationRequest(BaseModel):
        target_id: str
        state: dict[str, Any] = {}

    app = FastAPI(title="AI Escape Room API")

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    @app.get("/state")
    def state() -> dict:
        return game.snapshot()

    @app.post("/validate-solution")
    def validate_solution(payload: ValidateSolutionRequest) -> dict:
        try:
            return asdict(game.submit_solution(payload.puzzle_id, payload.answer))
        except (KeyError, ValueError) as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc

    @app.post("/hint")
    def hint(payload: HintRequest) -> dict:
        return asdict(
            game.request_hint(
                puzzle_id=payload.puzzle_id,
                player_id=payload.player_id,
                progress=payload.progress,
                solution=payload.solution,
            )
        )

    @app.post("/narrate")
    def narrate(payload: NarrationRequest) -> dict:
        return asdict(game.narrate(payload.target_id, payload.state))

else:
    app = None
