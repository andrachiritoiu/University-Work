#!/usr/bin/env python3
"""Game of Life pe grila infinită. O mulțime finită reprezintă celulele vii."""
from collections import Counter
import argparse
import json

GLIDER = {(1, 0), (2, 1), (0, 2), (1, 2), (2, 2)}


def step(alive):
    neighbors = Counter((x + dx, y + dy)
                        for x, y in alive
                        for dx in (-1, 0, 1) for dy in (-1, 0, 1)
                        if dx or dy)
    return {cell for cell, count in neighbors.items()
            if count == 3 or (count == 2 and cell in alive)}


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--steps", type=int, default=4)
    a = p.parse_args()
    if not 0 <= a.steps <= 1000:
        p.error("0 <= steps <= 1000")
    cells = set(GLIDER)
    for _ in range(a.steps):
        cells = step(cells)
    print(json.dumps(sorted(cells)))


if __name__ == "__main__":
    main()
