"""LOOP didactic: zero, copiere, incrementare, secventa si iteratie finita.

Cost: 1 pentru o atribuire, intrarea in LOOP, inceputul fiecarei iteratii
si iesirea din LOOP. Limita unui LOOP se citeste o singura data, la intrare.
"""
import argparse
import json
import re
from dataclasses import dataclass


class LoopError(ValueError):
    pass


@dataclass(frozen=True)
class Statement:
    op: str
    target: str
    source: str = ""
    body: tuple = ()
    line: int = 0
    end_line: int = 0


NAME = r"[a-z][a-z0-9_]*"


def parse(source):
    root = []
    stack = [(root, None)]
    for number, raw in enumerate(source.splitlines(), 1):
        for part in raw.split("#", 1)[0].split(";"):
            line = part.strip()
            if not line:
                continue
            header = re.fullmatch(rf"LOOP\s+({NAME})\s+DO", line, re.I)
            if header:
                if len(stack) > 16:
                    raise LoopError("Demo: adancimea maxima este 16.")
                stack.append(([], (header[1].lower(), number)))
            elif line.upper() == "END":
                if len(stack) == 1:
                    raise LoopError(f"Linia {number}: END fara LOOP.")
                body, (var, start) = stack.pop()
                stack[-1][0].append(Statement("loop", var, body=tuple(body), line=start, end_line=number))
            else:
                inc = re.fullmatch(rf"({NAME})\s*:=\s*({NAME})\s*\+\s*1", line, re.I)
                zero = re.fullmatch(rf"({NAME})\s*:=\s*0", line, re.I)
                copy = re.fullmatch(rf"({NAME})\s*:=\s*({NAME})", line, re.I)
                if inc and inc[1].lower() == inc[2].lower():
                    stmt = Statement("inc", inc[1].lower(), line=number)
                elif zero:
                    stmt = Statement("zero", zero[1].lower(), line=number)
                elif copy:
                    stmt = Statement("copy", copy[1].lower(), copy[2].lower(), line=number)
                else:
                    raise LoopError(f"Linia {number}: instructiune nepermisa: {line}")
                stack[-1][0].append(stmt)
    if len(stack) != 1:
        raise LoopError("Lipseste END.")
    return tuple(root)


def variables(program):
    result = {"x0"}
    for s in program:
        result.add(s.target)
        if s.source:
            result.add(s.source)
        result.update(variables(s.body))
    return result


def depth(program):
    return max((1 + depth(s.body) if s.op == "loop" else 0 for s in program), default=0)


def pretty(program, indent=0):
    lines = []
    for s in program:
        prefix = "  " * indent
        if s.op == "loop":
            lines.append(prefix + f"LOOP {s.target} DO")
            lines.extend(pretty(s.body, indent + 1))
            lines.append(prefix + "END")
        else:
            rhs = "0" if s.op == "zero" else s.source if s.op == "copy" else s.target + "+1"
            lines.append(prefix + f"{s.target} := {rhs}")
    return lines


def instrument(program):
    """Executa P cu un contor; intoarce timpul originalului in x0."""
    used = variables(program)
    timer = "t"
    while timer in used:
        timer += "t"
    tick = Statement("inc", timer)

    def visit(block):
        result = []
        for s in block:
            if s.op == "loop":
                result += [tick, Statement("loop", s.target, body=(tick,) + visit(s.body)), tick]
            else:
                result += [s, tick]
        return tuple(result)

    return (Statement("zero", timer),) + visit(program) + (Statement("copy", "x0", timer),), timer


def run(program, inputs=(), max_steps=20000, trace_limit=2500, bit_limit=4096):
    if isinstance(program, str):
        program = parse(program)
    if any(not isinstance(v, int) or v < 0 for v in inputs):
        raise LoopError("Intrarile sunt numere naturale.")
    regs = {v: 0 for v in variables(program)}
    regs.update({f"x{i}": v for i, v in enumerate(inputs, 1)})
    cost = 0
    events = []

    def event(s, kind, **details):
        nonlocal cost
        if max_steps is not None and cost >= max_steps:
            raise LoopError("Buget de pasi epuizat. Programul LOOP ramane total in modelul matematic.")
        cost += 1
        if len(events) < trace_limit:
            events.append({"line": s.line, "kind": kind, "cost": cost,
                           "registers": {k: str(v) for k, v in sorted(regs.items())}, **details})

    def execute(block):
        for s in block:
            if s.op == "loop":
                bound = regs[s.target]
                event(s, "enter", bound=str(bound))
                for i in range(bound):
                    event(s, "iteration", iteration=i + 1, bound=str(bound))
                    execute(s.body)
                event(s, "exit", bound=str(bound), line=s.end_line or s.line)
            else:
                if s.op == "zero":
                    value = 0
                elif s.op == "copy":
                    value = regs[s.source]
                else:
                    value = regs[s.target] + 1
                if bit_limit is not None and value.bit_length() > bit_limit:
                    raise LoopError("Buget de memorie epuizat.")
                if max_steps is not None and cost >= max_steps:
                    raise LoopError("Buget de pasi epuizat. Programul LOOP ramane total in modelul matematic.")
                regs[s.target] = value
                event(s, "assignment", target=s.target)

    status, message = "complete", "Programul s-a incheiat."
    try:
        execute(program)
    except LoopError as exc:
        status, message = "budget", str(exc)
    return {"status": status, "message": message, "output": str(regs["x0"]),
            "registers": {k: str(v) for k, v in sorted(regs.items())}, "cost": cost,
            "depth": depth(program), "trace": events, "trace_truncated": cost > len(events)}


def translate(program, output="x0"):
    """Traducere LOOP -> Python SISO. range() fixeaza limita la intrare."""
    if isinstance(program, str):
        program = parse(program)
    lines = ["def program(inString):", "    values = [int(v) for v in inString.split()]",
             "    if any(v < 0 for v in values):", "        raise ValueError('natural numbers required')",
             "    r = " + repr({v: 0 for v in sorted(variables(program))}),
             "    for i, value in enumerate(values, 1):", "        r['x' + str(i)] = value"]
    serial = 0

    def emit(block, indent):
        nonlocal serial
        if not block:
            lines.append("    " * indent + "pass")
        for s in block:
            prefix = "    " * indent
            t = repr(s.target)
            if s.op == "loop":
                serial += 1
                lines.append(prefix + f"for _loop{serial} in range(r[{t}]):")
                emit(s.body, indent + 1)
            elif s.op == "zero":
                lines.append(prefix + f"r[{t}] = 0")
            elif s.op == "copy":
                lines.append(prefix + f"r[{t}] = r[{s.source!r}]")
            else:
                lines.append(prefix + f"r[{t}] += 1")

    emit(program, 1)
    lines.append(f"    return str(r.get({output!r}, 0))")
    return "\n".join(lines) + "\n"


EXAMPLES = {
    "addition": {"name": "Adunare", "inputs": "3 4", "source": "x0 := x1\nLOOP x2 DO\n  x0 := x0+1\nEND\n"},
    "multiply": {"name": "Inmultire", "inputs": "3 4", "source": "x0 := 0\nLOOP x1 DO\n  LOOP x2 DO\n    x0 := x0+1\n  END\nEND\n"},
    "power2": {"name": "Doua bucle: 2 la n", "inputs": "5", "source": "x0 := 0\nx0 := x0+1\nLOOP x1 DO\n  LOOP x0 DO\n    x0 := x0+1\n  END\nEND\n"},
    "frozen": {"name": "Limita ramane cea de la intrare", "inputs": "3", "source": "x0 := 0\nLOOP x1 DO\n  x0 := x0+1\n  x1 := x1+1\nEND\n"},
    "fibonacci": {"name": "Fibonacci", "inputs": "6", "source": "x0 := 0\nx2 := 0\nx2 := x2+1\nLOOP x1 DO\n  x3 := x0\n  x4 := x2\n  x0 := x2\n  x2 := x3\n  LOOP x4 DO\n    x2 := x2+1\n  END\nEND\n"},
}


def main():
    from pathlib import Path
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("file", type=Path)
    p.add_argument("inputs", nargs="*", type=int)
    p.add_argument("--steps", type=int, default=20000)
    p.add_argument("--python", action="store_true")
    p.add_argument("--instrument", action="store_true")
    a = p.parse_args()
    program = parse(a.file.read_text())
    if a.instrument:
        program, timer = instrument(program)
        print("# Timpul programului original este in", timer)
        print("\n".join(pretty(program)))
    elif a.python:
        print(translate(program), end="")
    else:
        print(json.dumps(run(program, a.inputs, a.steps, trace_limit=0), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
