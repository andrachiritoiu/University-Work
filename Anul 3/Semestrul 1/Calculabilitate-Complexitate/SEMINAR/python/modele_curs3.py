"""Modele mici pentru Cursul 3; Python 3.10+, numai biblioteca standard.

Exemple:
  python python/modele_curs3.py bf '++[>+<-]'
  python python/modele_curs3.py tm 1011
  python python/modele_curs3.py mu 9
  python python/modele_curs3.py mu 2 --limit 12
Un buget epuizat arata numai un prefix al calculului.
"""
import argparse
from collections import Counter
import json


def brainfuck_program(source):
    code = ''.join(c for c in source if c in '><+-.,[]')
    stack, jumps = [], {}
    for i, c in enumerate(code):
        if c == '[':
            stack.append(i)
        elif c == ']':
            if not stack:
                raise ValueError('Paranteza ] fara pereche.')
            j = stack.pop()
            jumps[i] = j
            jumps[j] = i
    if stack:
        raise ValueError('Paranteza [ fara pereche.')
    return code, jumps


def run_brainfuck(source, input_string='', max_steps=20000, trace_limit=1000):
    """Octeti modulo 256; banda extensibila in ambele sensuri; EOF=0.

    max_steps=None elimina bugetul algoritmic. trace_limit=0 evita salvarea
    starilor, fara sa schimbe semantica programului.
    """
    if any(ord(c) > 255 for c in input_string):
        raise ValueError('Intrarea contine caractere care nu sunt octeti.')
    code, jumps = brainfuck_program(source)
    cells, pc, pointer, read, steps = {}, 0, 0, 0, 0
    output, trace = [], []
    while pc < len(code) and (max_steps is None or steps < max_steps):
        c = code[pc]
        if len(trace) < trace_limit:
            trace.append({'step': steps, 'pc': pc, 'instruction': c,
                          'pointer': pointer, 'cells': dict(cells)})
        value = cells.get(pointer, 0)
        if c == '>':
            pointer += 1
        elif c == '<':
            pointer -= 1
        elif c == '+':
            cells[pointer] = (value + 1) % 256
        elif c == '-':
            cells[pointer] = (value - 1) % 256
        elif c == '.':
            output.append(chr(value))
        elif c == ',':
            cells[pointer] = ord(input_string[read]) if read < len(input_string) else 0
            read += 1
        elif c == '[' and value == 0:
            pc = jumps[pc]
        elif c == ']' and value != 0:
            pc = jumps[pc]  # pc += 1 revine la inceputul corpului
        pc += 1
        steps += 1
    return {'status': 'complete' if pc == len(code) else 'budget',
            'output': ''.join(output), 'steps': steps, 'pc': pc,
            'pointer': pointer, 'cells': cells, 'trace': trace}


TM_RULES = {
    ('scan', '0'): ('scan', '0', 1),
    ('scan', '1'): ('scan', '1', 1),
    ('scan', '_'): ('carry', '_', -1),
    ('carry', '1'): ('carry', '0', -1),
    ('carry', '0'): ('halt', '1', 1),
    ('carry', '_'): ('halt', '1', 1),
}


def turing_increment(bits, max_steps=10000):
    if any(c not in '01' for c in bits):
        raise ValueError('Intrarea trebuie sa fie un sir binar.')
    tape = dict(enumerate(bits))
    head, state, steps = 0, 'scan', 0
    trace = []
    while True:
        trace.append({'step': steps, 'state': state, 'head': head, 'tape': dict(tape)})
        if state == 'halt' or steps >= max_steps:
            break
        state, symbol, direction = TM_RULES[state, tape.get(head, '_')]
        if symbol == '_':
            tape.pop(head, None)
        else:
            tape[head] = symbol
        head += direction
        steps += 1
    output = ''.join(tape.get(i, '_') for i in range(min(tape), max(tape)+1)) if tape else ''
    return {'status': 'complete' if state == 'halt' else 'budget',
            'output': output if state == 'halt' else None, 'steps': steps, 'trace': trace}


def search_square(n, exact=True, limit=50):
    if not isinstance(n, int) or n < 0:
        raise ValueError('n trebuie sa fie natural.')
    rows = []
    for y in range(limit):
        g = abs(y*y-n) if exact else max(n-y*y, 0)
        rows.append({'y': y, 'square': y*y, 'test': g})
        if g == 0:
            return {'status': 'complete', 'output': y, 'rows': rows}
    return {'status': 'budget', 'output': None, 'rows': rows}


def while_trace(n, growing=False, limit=30):
    if not isinstance(n, int) or n < 0:
        raise ValueError('n trebuie sa fie natural.')
    x0, x1 = 0, n
    rows = [{'step': 0, 'x0': x0, 'x1': x1}]
    while x1 != 0 and len(rows) <= limit:
        x0 += 1
        x1 = x1+1 if growing else max(x1-1, 0)
        rows.append({'step': x0, 'x0': x0, 'x1': x1})
    return {'status': 'complete' if x1 == 0 else 'budget',
            'output': x0 if x1 == 0 else None, 'rows': rows}


def life_step(live):
    """Plan infinit rar; toate celulele sunt actualizate simultan."""
    count = Counter((x+dx, y+dy) for x,y in live
                    for dx in (-1,0,1) for dy in (-1,0,1) if dx or dy)
    return {p for p,c in count.items() if c == 3 or (c == 2 and p in live)}


GLIDER = {(1,0),(2,1),(0,2),(1,2),(2,2)}
GOSPER = {
    (24,0),(22,1),(24,1),(12,2),(13,2),(20,2),(21,2),(34,2),(35,2),
    (11,3),(15,3),(20,3),(21,3),(34,3),(35,3),(0,4),(1,4),(10,4),
    (16,4),(20,4),(21,4),(0,5),(1,5),(10,5),(14,5),(16,5),(17,5),
    (22,5),(24,5),(10,6),(16,6),(24,6),(11,7),(15,7),(12,8),(13,8)
}


def elementary_rows(rule=110, width=161, generations=90):
    if not 0 <= rule <= 255 or width < 1 or generations < 1:
        raise ValueError('Parametri de automat invalidi.')
    live = {0}
    rows, left = [], -(width//2)
    for _ in range(generations):
        rows.append([int(x in live) for x in range(left,left+width)])
        # Pentru regulile cu 000->0 (30,90,110), suportul ramane finit.
        if rule & 1:
            raise ValueError('Aceasta implementare rara cere regula(000)=0.')
        if not live:
            continue
        lo,hi = min(live)-1,max(live)+1
        live = {x for x in range(lo,hi+1)
                if (rule >> ((int(x-1 in live)<<2) | (int(x in live)<<1) |
                             int(x+1 in live))) & 1}
    return rows


def main():
    p = argparse.ArgumentParser(description=__doc__)
    sub = p.add_subparsers(dest='mode', required=True)
    b = sub.add_parser('bf'); b.add_argument('source'); b.add_argument('--input', default='')
    b.add_argument('--limit', type=int, default=20000)
    t = sub.add_parser('tm'); t.add_argument('bits')
    m = sub.add_parser('mu'); m.add_argument('n', type=int)
    m.add_argument('--threshold', action='store_true'); m.add_argument('--limit', type=int, default=50)
    a = p.parse_args()
    if a.mode == 'bf': result = run_brainfuck(a.source,a.input,a.limit)
    elif a.mode == 'tm': result = turing_increment(a.bits)
    else: result = search_square(a.n, not a.threshold, a.limit)
    print(json.dumps(result,ensure_ascii=False,indent=2))


if __name__ == '__main__': main()
