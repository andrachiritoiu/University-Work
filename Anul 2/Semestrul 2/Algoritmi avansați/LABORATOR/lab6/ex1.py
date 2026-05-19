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


def curata_poligon(poligon):
    n = len(poligon)
    nou = []

    for i in range(n):
        anterior = poligon[(i - 1) % n]
        curent = poligon[i]
        urmator = poligon[(i + 1) % n]

        # daca curent si urmator sunt coliniare
        if determinant(anterior, curent, urmator) != 0:
            nou.append(curent)

    return nou


def pozitie_punct(poligon, punct):
    n = len(poligon)

    p0 = poligon[0]

    if pe_segment(p0, poligon[1], punct) or pe_segment(p0, poligon[n - 1], punct):
        return "BOUNDARY"

    if determinant(p0, poligon[1], punct) < 0 or determinant(p0, poligon[n - 1], punct) > 0:
        return "OUTSIDE"

    left = 1
    right = n - 1

    while right - left > 1:
        mid = (left + right) // 2

        if determinant(p0, poligon[mid], punct) >= 0:
            left = mid
        else:
            right = mid

    d = determinant(poligon[left], poligon[left + 1], punct)

    if d < 0:
        return "OUTSIDE"

    if d == 0:
        if pe_segment(poligon[left], poligon[left + 1], punct):
            return "BOUNDARY"
        else:
            return "OUTSIDE"

    return "INSIDE"


n = int(input())
poligon = []

for i in range(n):
    xi, yi = map(int, input().split())
    poligon.append((xi, yi))

poligon = curata_poligon(poligon)

m = int(input())

for i in range(m):
    xi, yi = map(int, input().split())
    punct = (xi, yi)

    print(pozitie_punct(poligon, punct))