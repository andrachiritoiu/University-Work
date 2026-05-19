def determinant(a, b, c):
    xa, ya = a
    xb, yb = b
    xc, yc = c

    return (xb - xa) * (yc - ya) - (yb - ya) * (xc - xa)


def pe_segment(a, b, p):
    if determinant(a, b, p) != 0:
        return False

    xa, ya = a
    xb, yb = b
    xp, yp = p

    return min(xa, xb) <= xp <= max(xa, xb) and min(ya, yb) <= yp <= max(ya, yb)


def intersecteaza_raza(a, b, p):
    xa, ya = a
    xb, yb = b
    xp, yp = p

    if (ya > yp and yb > yp) or (ya <= yp and yb <= yp):
        return False

    den = yb - ya
    val = (xa - xp) * den + (yp - ya) * (xb - xa)

    if den > 0:
        return val > 0
    else:
        return val < 0


def pozitie_punct(poligon, punct):
    n = len(poligon)

    cnt = 0  # numarul de intersectii cu raza spre dreapta

    for i in range(n):
        a = poligon[i]
        b = poligon[(i + 1) % n]

        if pe_segment(a, b, punct):
            return "BOUNDARY"

        if intersecteaza_raza(a, b, punct):
            cnt += 1

    if cnt % 2 == 1:
        return "INSIDE"
    else:
        return "OUTSIDE"


n = int(input())
poligon = []

for i in range(n):
    xi, yi = map(int, input().split())
    poligon.append((xi, yi))

m = int(input())

for i in range(m):
    xi, yi = map(int, input().split())
    punct = (xi, yi)

    print(pozitie_punct(poligon, punct))