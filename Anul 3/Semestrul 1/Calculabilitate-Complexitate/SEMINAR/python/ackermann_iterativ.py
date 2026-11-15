"""Ackermann-Peter cu o stiva explicita, fara autoapeluri."""
import argparse


def ackermann(m, n, budget=100000):
    if m < 0 or n < 0:
        raise ValueError("Argumente naturale.")
    stack = [m]
    steps = 0
    while stack:
        if steps >= budget:
            raise RuntimeError("Buget epuizat. Nu rezulta neterminarea functiei.")
        steps += 1
        m = stack.pop()
        if m == 0:
            n += 1
        elif n == 0:
            n = 1
            stack.append(m - 1)
        else:
            n -= 1
            stack.extend((m - 1, m))
    return n, steps


if __name__ == "__main__":
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("m", type=int, nargs="?", default=3)
    p.add_argument("n", type=int, nargs="?", default=4)
    a = p.parse_args()
    value, steps = ackermann(a.m, a.n)
    print(f"A({a.m},{a.n}) = {value}; pasi de stiva: {steps}")
