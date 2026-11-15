#!/usr/bin/env python3
"""Șiruri Goodstein standard: baza ereditară se schimbă și în exponenți."""
import argparse
import json


def decimal_string(n):
    """Conversie exactă, inclusiv peste limita int->str din Python 3.11+."""
    if n.bit_length() <= 12_000:
        return str(n)
    from decimal import Decimal
    return format(Decimal(n), "f")


class DemoLimit(RuntimeError):
    pass


def bounded_power(base, exponent, bit_limit):
    if bit_limit is None:
        return base ** exponent
    if exponent >= bit_limit:
        raise DemoLimit(f"Buget depășit: {bit_limit} biți.")
    result = 1
    while exponent:
        if exponent & 1:
            result *= base
            if result.bit_length() > bit_limit:
                raise DemoLimit(f"Buget depășit: {bit_limit} biți.")
        exponent >>= 1
        if exponent:
            base *= base
            if base.bit_length() > bit_limit:
                raise DemoLimit(f"Buget depășit: {bit_limit} biți.")
    return result


def bump(n, base, bit_limit=None):
    """Evaluează forma ereditară în baza base+1, fără scăderea lui 1."""
    if n < 0 or base < 2:
        raise ValueError("n >= 0 și baza >= 2.")
    if n < base:
        return n
    result, exponent = 0, 0
    while n:
        n, digit = divmod(n, base)
        if digit:
            new_exponent = bump(exponent, base, bit_limit)
            result += digit * bounded_power(base + 1, new_exponent, bit_limit)
            if bit_limit is not None and result.bit_length() > bit_limit:
                raise DemoLimit(f"Buget depășit: {bit_limit} biți.")
        exponent += 1
    return result


def hereditary(n, base, symbol="b"):
    if n < base:
        return str(n)
    terms, exponent = [], 0
    while n:
        n, digit = divmod(n, base)
        if digit:
            if exponent == 0:
                term = str(digit)
            else:
                power = symbol if exponent == 1 else f"{symbol}^({hereditary(exponent, base, symbol)})"
                term = power if digit == 1 else f"{digit}*{power}"
            terms.append(term)
        exponent += 1
    return " + ".join(reversed(terms))


def experiment(start, steps=15, bit_limit=4096):
    if start < 0 or not 0 <= steps <= 1000 or not 1 <= bit_limit <= 100_000:
        raise ValueError("start >= 0, 0 <= steps <= 1000, 1 <= bit_limit <= 100000.")
    if start.bit_length() > bit_limit:
        raise DemoLimit("Valoarea inițială depășește bugetul de biți.")
    n, base, rows = start, 2, []
    status = "step_limit"
    for k in range(steps + 1):
        rows.append({"step": k, "base": base, "value": decimal_string(n),
                     "hereditary": hereditary(n, base), "bits": n.bit_length()})
        if n == 0:
            status = "reached_zero"
            break
        if k == steps:
            break
        try:
            n = bump(n, base, bit_limit) - 1
        except DemoLimit:
            status = "bit_limit"
            break
        base += 1
    return {"start": decimal_string(start), "rows": rows, "status": status,
            "message": {"step_limit": "Buget de pași epuizat. Nu este un contraexemplu.",
                        "bit_limit": "Buget de memorie epuizat. Nu este un contraexemplu.",
                        "reached_zero": "Șirul a ajuns la zero."}[status]}


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("start", type=int, nargs="?", default=4)
    p.add_argument("--steps", type=int, default=15)
    p.add_argument("--bits", type=int, default=4096)
    p.add_argument("--json", action="store_true")
    args = p.parse_args()
    try:
        r = experiment(args.start, args.steps, args.bits)
    except (ValueError, DemoLimit) as e:
        p.exit(2, f"Demo oprit: {e}\n")
    if args.json:
        print(json.dumps(r, ensure_ascii=False, indent=2))
    else:
        for row in r["rows"]:
            print(f"pas {row['step']:2}, baza {row['base']:3}: {row['value']} = " f"\033[31m{row['hereditary']}\033[0m  [b={row['base']}]"
)
       


if __name__ == "__main__":
    main()
