"""Evaluator pentru descrieri PR, codificate numeric prin Cantor.

Semantica matematica este totala. Limitele optionale protejeaza demonstratia.
Descriere: Z(k), S, P(k,i), C(f, [g1,...,gm]), R(base, step).
R foloseste argumentele (n, parametri); step primeste (i, precedent, parametri).
"""
from dataclasses import dataclass
from functools import lru_cache
import argparse
from cantor_fibonacci import pair, unpair


class BadCode(ValueError):
    pass


class BudgetExceeded(RuntimeError):
    pass


@dataclass(frozen=True)
class Term:
    kind: str
    arity: int
    parts: tuple = ()
    index: int = 0


def Z(k): return Term("zero", k)
S = Term("succ", 1)
def P(k, i): return Term("proj", k, index=i)


def C(f, gs):
    gs = tuple(gs)
    if len(gs) != f.arity or (gs and len({g.arity for g in gs}) != 1):
        raise BadCode("Compozitie cu aritati incompatibile.")
    return Term("comp", gs[0].arity if gs else 0, (f,) + gs)


def R(base, step):
    if step.arity != base.arity + 2:
        raise BadCode("Aritati incompatibile pentru recursie.")
    return Term("rec", base.arity + 1, (base, step))


def list_code(values):
    z = 0
    for v in reversed(values):
        z = 1 + pair(v, z)
    return z


def split_list(z):
    values = []
    while z:
        head, z = unpair(z - 1)
        values.append(head)
    return values


def encode(t):
    if t.kind == "zero": return pair(0, t.arity)
    if t.kind == "succ": return pair(1, 0)
    if t.kind == "proj": return pair(2, pair(t.arity, t.index))
    if t.kind == "comp": return pair(3, pair(encode(t.parts[0]), list_code([encode(g) for g in t.parts[1:]])))
    if t.kind == "rec": return pair(4, pair(encode(t.parts[0]), encode(t.parts[1])))
    raise BadCode("Constructor necunoscut.")


@lru_cache(maxsize=2000)
def decode(z):
    if z < 0: raise BadCode("Cod negativ.")
    tag, payload = unpair(z)
    if tag == 0: return Z(payload)
    if tag == 1 and payload == 0: return S
    if tag == 2:
        k, i = unpair(payload)
        if k > 0 and i < k: return P(k, i)
    if tag == 3:
        f, gs = unpair(payload)
        return C(decode(f), [decode(g) for g in split_list(gs)])
    if tag == 4:
        base, step = unpair(payload)
        return R(decode(base), decode(step))
    raise BadCode("Codul nu descrie o functie PR.")


@dataclass
class Budget:
    limit: int | None = 50000
    bit_limit: int | None = 4096
    calls: int = 0

    def tick(self):
        self.calls += 1
        if self.limit is not None and self.calls > self.limit:
            raise BudgetExceeded("Buget de evaluare epuizat. Descrierea PR ramane totala.")

    def check(self, value):
        if self.bit_limit is not None and value.bit_length() > self.bit_limit:
            raise BudgetExceeded("Buget de memorie epuizat.")
        return value


def evaluate(t, args, budget=None):
    budget = budget if budget is not None else Budget()
    if len(args) != t.arity or any(v < 0 for v in args):
        raise BadCode("Numar incorect de argumente naturale.")

    def ev(term, xs):
        budget.tick()
        if term.kind == "zero": result = 0
        elif term.kind == "succ": result = xs[0] + 1
        elif term.kind == "proj": result = xs[term.index]
        elif term.kind == "comp": result = ev(term.parts[0], tuple(ev(g, xs) for g in term.parts[1:]))
        else:
            base, step = term.parts
            n, *params = xs
            result = ev(base, tuple(params))
            for i in range(n):
                result = ev(step, (i, result, *params))
        return budget.check(result)

    return ev(t, tuple(args))


def universal_pr(e, x, budget=None):
    """Orice cod nevalid sau de alta aritate reprezinta aici functia zero."""
    try:
        term = decode(e)
    except BadCode:
        return 0
    return evaluate(term, (x,), budget) if term.arity == 1 else 0


ADD = R(P(1, 0), C(S, [P(3, 1)]))
MUL = R(Z(1), C(ADD, [P(3, 1), P(3, 2)]))
ONE0 = C(S, [Z(0)])
POW2 = R(ONE0, C(ADD, [P(2, 1), P(2, 1)]))
FACTORIAL = R(ONE0, C(MUL, [C(S, [P(2, 0)]), P(2, 1)]))
CATALOG = {
    "zero": ("Zero", Z(1)), "succ": ("Succesor", S),
    "identity": ("Identitate", P(1, 0)),
    "double": ("Dublare", C(ADD, [P(1, 0), P(1, 0)])),
    "square": ("Patrat", C(MUL, [P(1, 0), P(1, 0)])),
    "power2": ("2 la n", POW2), "factorial": ("Factorial", FACTORIAL),
}


def code_label(e):
    if e.bit_length() <= 512:
        return str(e)
    h = hex(e)
    return h[:24] + "..." + h[-12:] + f" ({e.bit_length()} biti, scriere hexazecimala)"


if __name__ == "__main__":
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("function", choices=CATALOG, nargs="?", default="square")
    p.add_argument("x", type=int, nargs="?", default=5)
    a = p.parse_args()
    name, term = CATALOG[a.function]
    e = encode(term)
    b = Budget()
    print("Descriere:", name)
    print("Cod Cantor:", code_label(e))
    print("U_PR(e,x) =", universal_pr(e, a.x, b))
    print("Apeluri in evaluator:", b.calls)
