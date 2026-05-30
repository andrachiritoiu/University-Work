from bisect import bisect_left, bisect_right

def add(poz, valoare):
    poz += 1
    while poz <= len(toate_y):
        bit[poz] += valoare
        poz += poz & -poz

def suma(poz):
    s = 0
    while poz > 0:
        s += bit[poz]
        poz -= poz & -poz
    return s


n = int(input())

evenimente = []
toate_y = []

for _ in range(n):
    x1, y1, x2, y2 = map(int, input().split())

    if y1 == y2:
        if x1 > x2:
            x1, x2 = x2, x1

        y = y1
        toate_y.append(y)

        evenimente.append((x1, 2, y))  # incepe orizontala
        evenimente.append((x2, 0, y))  # se termina orizontala

    else:
        if y1 > y2:
            y1, y2 = y2, y1

        x = x1
        evenimente.append((x, 1, y1, y2))  # verticala


toate_y = sorted(set(toate_y))

poz_y = {}
for i in range(len(toate_y)):
    poz_y[toate_y[i]] = i

bit = [0] * (len(toate_y) + 1)

evenimente.sort()

nr = 0

for ev in evenimente:
    tip = ev[1]

    if tip == 0:
        y = ev[2]
        add(poz_y[y], -1)

    elif tip == 2:
        y = ev[2]
        add(poz_y[y], 1)

    else:
        y_jos = ev[2]
        y_sus = ev[3]

        st = bisect_right(toate_y, y_jos)
        dr = bisect_left(toate_y, y_sus)

        nr += suma(dr) - suma(st)

print(nr)