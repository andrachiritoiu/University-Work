#!/usr/bin/env python3
"""Un pas Collatz este calculabil. Terminarea tuturor orbitelor rămâne deschisă."""
import argparse
import json


def step(n):
    return n // 2 if n % 2 == 0 else 3 * n + 1


def experiment(start, max_steps=10_000, bit_limit=4096):
    if start < 1 or max_steps < 0 or bit_limit < 1:
        raise ValueError("start >= 1, max_steps >= 0, bit_limit >= 1.")
    n, peak, values = start, start, [start]
    status = "reached_one" if n == 1 else "step_limit"
    steps = 0
    if n.bit_length() > bit_limit:
        status = "bit_limit"
    else:
        for steps in range(1, max_steps + 1):
            if n == 1:
                steps -= 1
                status = "reached_one"
                break
            n = step(n)
            peak = max(peak, n)
            values.append(n)
            if n.bit_length() > bit_limit:
                status = "bit_limit"
                break
            if n == 1:
                status = "reached_one"
                break
        else:
            steps = max_steps
    return {"start": str(start), "steps": steps, "peak": str(peak),
            "values": [str(v) for v in values], "status": status,
            "message": "Am ajuns la 1." if status == "reached_one" else
                       "Buget epuizat. Experimentul nu decide conjectura."}


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("start", type=int, nargs="?", default=27)
    p.add_argument("--steps", type=int, default=10_000)
    p.add_argument("--json", action="store_true")
    a = p.parse_args()
    try:
        r = experiment(a.start, a.steps)
    except ValueError as e:
        p.exit(2, f"{e}\n")
    if a.json:
        print(json.dumps(r, ensure_ascii=False, indent=2))
    else:
        print(", ".join(r["values"]))
        print(f"Pași: {r['steps']}; maxim: {r['peak']}; {r['message']}")


if __name__ == "__main__":
    main()
