"""Perechi Cantor si Fibonacci calculat cu o singura stare numerica."""
from math import isqrt
import argparse


def pair(a, b):
    if a < 0 or b < 0:
        raise ValueError("Componentele sunt naturale.")
    return (a + b) * (a + b + 1) // 2 + b


def unpair(z):
    if z < 0:
        raise ValueError("Codul este natural.")
    diagonal = (isqrt(8 * z + 1) - 1) // 2
    b = z - diagonal * (diagonal + 1) // 2
    return diagonal - b, b


def fibonacci_rows(n):
    if not 0 <= n <= 200:
        raise ValueError("Demo: n este intre 0 si 200.")
    z = pair(0, 1)
    rows = []
    for i in range(n + 1):
        a, b = unpair(z)
        rows.append({"n": i, "a": str(a), "b": str(b), "code": str(z)})
        z = pair(b, a + b)
    return rows


if __name__ == "__main__":
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("n", type=int, nargs="?", default=10)
    for row in fibonacci_rows(p.parse_args().n):
        print(f"n={row['n']:2}: stare=({row['a']}, {row['b']}), cod={row['code']}")
