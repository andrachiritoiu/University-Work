import unittest

from src.agents.puzzle_agent import PuzzleAgent, PuzzleDefinition, build_default_puzzle_agent


class PuzzleAgentTest(unittest.TestCase):
    def test_validates_exact_answer_and_logs_attempt(self):
        agent = PuzzleAgent([
            PuzzleDefinition("lock", "7391", difficulty=4),
        ])

        result = agent.validate_solution("lock", "7391")

        self.assertTrue(result.correct)
        self.assertEqual(result.puzzle_id, "lock")
        self.assertEqual(result.difficulty_score, 4)
        self.assertEqual(result.attempt_number, 1)
        self.assertEqual(len(agent.attempts), 1)
        self.assertTrue(agent.attempts[0].correct)

    def test_accepts_aliases_and_normalises_case(self):
        agent = PuzzleAgent([
            PuzzleDefinition("element", "au", aliases=("gold",), fuzzy_match=True),
        ])

        result = agent.validate_solution("element", "  GOLD  ")

        self.assertTrue(result.correct)

    def test_rejects_wrong_answer_without_revealing_solution(self):
        agent = PuzzleAgent([
            PuzzleDefinition("lock", "7391"),
        ])

        result = agent.validate_solution("lock", "0000")

        self.assertFalse(result.correct)
        self.assertNotIn("7391", result.feedback)

    def test_default_agent_contains_level_puzzles(self):
        agent = build_default_puzzle_agent()

        self.assertTrue(agent.validate_solution("level2_gold", "gold").correct)
        self.assertTrue(agent.validate_solution("level4_open", "OPEN").correct)


if __name__ == "__main__":
    unittest.main()
