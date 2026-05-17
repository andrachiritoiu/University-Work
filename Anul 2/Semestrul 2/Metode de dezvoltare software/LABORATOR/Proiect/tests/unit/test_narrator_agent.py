import unittest

from src.agents.narrator_agent import NarratorAgent


class NarratorAgentTest(unittest.TestCase):
    def test_describes_known_room_in_victorian_style(self):
        agent = NarratorAgent()

        result = agent.describe("library")

        self.assertEqual(result.target_id, "library")
        self.assertEqual(result.style, "victorian mystery")
        self.assertIn("library", result.description.lower())

    def test_varies_repeated_descriptions(self):
        agent = NarratorAgent()

        first = agent.describe("crypt").description
        second = agent.describe("crypt").description

        self.assertNotEqual(first, second)

    def test_adds_solved_context_without_losing_target(self):
        agent = NarratorAgent()

        result = agent.describe("final_chamber", {"solved": True})

        self.assertEqual(result.target_id, "final_chamber")
        self.assertIn("already been disturbed", result.description)

    def test_unknown_target_uses_default_description(self):
        agent = NarratorAgent()

        result = agent.describe("unknown-object")

        self.assertEqual(result.target_id, "unknown-object")
        self.assertTrue(result.description)


if __name__ == "__main__":
    unittest.main()
