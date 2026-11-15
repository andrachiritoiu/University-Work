#!/usr/bin/env python3
"""Funcția Ackermann–Péter. Python 3.10+, fără biblioteci externe."""
import argparse


def ackermann(m, n):
    """Definiția matematică directă; folosiți doar argumente mici."""
    if m == 0:
        return n + 1
    if n == 0:
        return ackermann(m - 1, 1)
    return ackermann(m - 1, ackermann(m, n - 1))


def experiment(m, n, max_calls=500_000):
    if not (0 <= m <= 3 and 0 <= n <= 6):
        raise ValueError("Demo recursiv: 0 <= m <= 3, 0 <= n <= 6.")
    calls = 0

    def a(i, j):
        nonlocal calls
        calls += 1
        if calls > max_calls:
            raise RuntimeError("Bugetul de apeluri s-a epuizat.")
        if i == 0:
            return j + 1
        if j == 0:
            return a(i - 1, 1)
        return a(i - 1, a(i, j - 1))

    return {"m": m, "n": n, "value": str(a(m, n)), "calls": calls}


def closed_form(m, n):
    """Formule exacte pentru primele rânduri, NU o metodă generală."""
    if m < 0 or n < 0:
        raise ValueError("Argumentele trebuie să fie naturale.")
    if m == 0:
        return n + 1
    if m == 1:
        return n + 2
    if m == 2:
        return 2 * n + 3
    if m == 3 and n <= 100_000:
        return 2 ** (n + 3) - 3
    if m == 4 and n == 0:
        return 13
    if m == 4 and n == 1:
        return 65533
    if m == 4 and n == 2:
        return 2 ** 65536 - 3
    raise ValueError("În acest demo nu construim acest rezultat enorm.")


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("m", type=int, nargs="?", default=3)
    p.add_argument("n", type=int, nargs="?", default=4)
    p.add_argument("--method", choices=["recursive", "closed"], default="recursive")
    args = p.parse_args()
    try:
        if args.method == "recursive":
            r = experiment(args.m, args.n)
            print(f"A({args.m}, {args.n}) = {r['value']}")
            print(f"Apeluri recursive: {r['calls']}")
        else:
            v = closed_form(args.m, args.n)
            if v.bit_length() > 12_000:
                # Evităm limita de conversie int->str a unor versiuni Python.
                import decimal
                with decimal.localcontext() as ctx:
                    ctx.prec = 50
                    digits = int(decimal.Decimal(v).log10()) + 1
                print(f"Rezultat exact calculat: {digits} cifre zecimale.")
            else:
                print(f"A({args.m}, {args.n}) = {v}")
    except (ValueError, RuntimeError, RecursionError) as e:
        p.exit(2, f"Demo oprit: {e}\nAceasta este o limită a experimentului.\n")


if __name__ == "__main__":
    main()
