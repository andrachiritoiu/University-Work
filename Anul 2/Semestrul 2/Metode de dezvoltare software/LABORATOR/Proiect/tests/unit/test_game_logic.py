import unittest

from src.agents.puzzle_agent import PuzzleDefinition
from src.game.game_logic import EscapeRoomGame
from src.game.inventory import Inventory, InventoryItem
from src.game.puzzle_engine import Puzzle, PuzzleEngine, PuzzleState


class GameLogicTest(unittest.TestCase):
    def test_escape_room_validates_solution_through_engine(self):
        game = EscapeRoomGame()

        result = game.submit_solution("level2_silver", "Ag")

        self.assertTrue(result.correct)
        snapshot = game.snapshot()
        self.assertEqual(snapshot["puzzles"]["level2_silver"]["state"], "solved")

    def test_inventory_add_equip_remove_cycle(self):
        inventory = Inventory()
        item = InventoryItem("key", "Golden Key", "A small key.")

        self.assertTrue(inventory.add(item))
        self.assertFalse(inventory.add(item))
        inventory.equip("key")
        self.assertEqual(inventory.equipped_item_id, "key")
        self.assertTrue(inventory.remove("key"))
        self.assertIsNone(inventory.equipped_item_id)

    def test_puzzle_engine_unlocks_dependent_puzzle(self):
        engine = PuzzleEngine()
        engine.add_puzzle(Puzzle(
            definition=PuzzleDefinition("first", "open"),
            unlocks=("second",),
        ))
        engine.add_puzzle(Puzzle(
            definition=PuzzleDefinition("second", "next"),
            state=PuzzleState.LOCKED,
        ))

        result = engine.submit("first", "open")

        self.assertTrue(result.correct)
        self.assertEqual(engine.puzzles["first"].state, PuzzleState.SOLVED)
        self.assertEqual(engine.puzzles["second"].state, PuzzleState.AVAILABLE)

    def test_failed_puzzle_after_max_attempts(self):
        engine = PuzzleEngine()
        engine.add_puzzle(Puzzle(
            definition=PuzzleDefinition("lock", "1234"),
            max_attempts=2,
        ))

        engine.submit("lock", "0000")
        engine.submit("lock", "1111")

        self.assertEqual(engine.puzzles["lock"].state, PuzzleState.FAILED)

    def test_game_snapshot_reports_completion(self):
        game = EscapeRoomGame()

        self.assertFalse(game.snapshot()["complete"])
        game.force_complete_for_demo()

        self.assertTrue(game.snapshot()["complete"])


if __name__ == "__main__":
    unittest.main()
