"""Room and object state for the escape room backend."""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class RoomObject:
    id: str
    name: str
    description: str
    interactive: bool = True
    collected: bool = False
    metadata: dict = field(default_factory=dict)


class Room:
    def __init__(self, room_id: str, name: str, objects: list[RoomObject] | None = None) -> None:
        self.room_id = room_id
        self.name = name
        self._objects = {item.id: item for item in objects or []}

    @property
    def objects(self) -> tuple[RoomObject, ...]:
        return tuple(self._objects.values())

    def add_object(self, item: RoomObject) -> None:
        self._objects[item.id] = item

    def inspect_object(self, object_id: str) -> RoomObject:
        obj = self._get(object_id)
        if not obj.interactive:
            raise ValueError(f"Object is not interactive: {object_id}")
        return obj

    def collect_object(self, object_id: str) -> RoomObject:
        obj = self.inspect_object(object_id)
        obj.collected = True
        return obj

    def _get(self, object_id: str) -> RoomObject:
        if object_id not in self._objects:
            raise KeyError(f"Unknown object: {object_id}")
        return self._objects[object_id]
