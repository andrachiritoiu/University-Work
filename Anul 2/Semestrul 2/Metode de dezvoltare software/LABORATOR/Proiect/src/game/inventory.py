"""Inventory model shared by backend game logic."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class InventoryItem:
    id: str
    name: str
    description: str
    icon_src: str | None = None


class Inventory:
    def __init__(self) -> None:
        self._items: dict[str, InventoryItem] = {}
        self.equipped_item_id: str | None = None

    @property
    def items(self) -> tuple[InventoryItem, ...]:
        return tuple(self._items.values())

    def add(self, item: InventoryItem) -> bool:
        if item.id in self._items:
            return False
        self._items[item.id] = item
        return True

    def remove(self, item_id: str) -> bool:
        existed = item_id in self._items
        self._items.pop(item_id, None)
        if self.equipped_item_id == item_id:
            self.equipped_item_id = None
        return existed

    def has(self, item_id: str) -> bool:
        return item_id in self._items

    def equip(self, item_id: str | None) -> None:
        if item_id is not None and item_id not in self._items:
            raise KeyError(f"Cannot equip missing item: {item_id}")
        self.equipped_item_id = item_id

    def clear(self) -> None:
        self._items.clear()
        self.equipped_item_id = None
