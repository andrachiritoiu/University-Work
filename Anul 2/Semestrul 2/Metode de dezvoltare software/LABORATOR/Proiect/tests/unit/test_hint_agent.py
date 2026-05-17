import unittest

from src.agents.hint_agent import HintAgent


class HintAgentTest(unittest.TestCase):
    def test_returns_first_level_hint(self):
        agent = HintAgent(cooldown_seconds=60)

        result = agent.request_hint("level1_lock", player_id="player-a")

        self.assertEqual(result.level, 1)
        self.assertEqual(result.cooldown_remaining, 0)
        self.assertIn("board", result.hint)

    def test_enforces_cooldown_per_player_and_puzzle(self):
        agent = HintAgent(cooldown_seconds=60)

        first = agent.request_hint("level1_lock", player_id="player-a")
        second = agent.request_hint("level1_lock", player_id="player-a")

        self.assertEqual(first.cooldown_remaining, 0)
        self.assertGreater(second.cooldown_remaining, 0)
        self.assertIn("Try again", second.hint)

    def test_progresses_hint_level_after_cooldown_reset(self):
        agent = HintAgent(cooldown_seconds=60)

        first = agent.request_hint("level1_lock", player_id="player-a")
        agent.reset_cooldown("level1_lock", player_id="player-a")
        second = agent.request_hint("level1_lock", player_id="player-a")

        self.assertEqual(first.level, 1)
        self.assertEqual(second.level, 2)
        self.assertIn("central square", second.hint)

    def test_removes_solution_from_hint_text(self):
        agent = HintAgent(cooldown_seconds=0)

        result = agent.request_hint(
            "default",
            player_id="player-a",
            solution="smallest answer",
        )

        self.assertNotIn("smallest answer", result.hint.lower())


if __name__ == "__main__":
    unittest.main()
