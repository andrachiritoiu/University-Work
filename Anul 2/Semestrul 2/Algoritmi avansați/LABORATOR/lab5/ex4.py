from math import sqrt

n = int(input())
points = []

for i in range(n):
    xi, yi = map(int, input().split())
    points.append((xi, yi))

points.sort(key=lambda p: (p[0], p[1]))

Li = [points[0], points[1]]

for i in range(2, n):
   Li.append(points[i])
   ok = 1

   while len(Li) > 2 and ok != 0:
       xr, yr = Li[-1][0], Li[-1][1]
       xp, yp = Li[-2][0], Li[-2][1]
       xq, yq = Li[-3][0], Li[-3][1]

       delta = xq * yr + xr * yp + xp * yq - xq * yp - xr * yq - xp * yr

       if delta > 0:
           ok = 0
       else:
           Li.pop(-2)

Ls = [points[n - 1], points[n - 2]]

for i in range(n - 3, -1, -1):
   Ls.append(points[i])
   ok = 1

   while len(Ls) > 2 and ok != 0:
       xr, yr = Ls[-1][0], Ls[-1][1]
       xp, yp = Ls[-2][0], Ls[-2][1]
       xq, yq = Ls[-3][0], Ls[-3][1]

       delta = xq * yr + xr * yp + xp * yq - xq * yp - xr * yq - xp * yr

       if delta > 0:
           ok = 0
       else:
            Ls.pop(-2)

L = Li[:-1] + Ls[:-1]


def dist(a, b):
    return sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)

hull_points = set(L)

interior = []
for p in points:
    if p not in hull_points:
        interior.append(p)

for p in interior:
    poz = 0
    cost_minim = float("inf")

    for i in range(len(L)):
        a = L[i]
        b = L[(i + 1) % len(L)]

        cost = dist(a, p) + dist(p, b) - dist(a, b)

        if cost < cost_minim:
            cost_minim = cost
            poz = i + 1

    L.insert(poz, p)

poz_start = 0
for i in range(len(L)):
    if L[i][0] < L[poz_start][0] or (L[i][0] == L[poz_start][0] and L[i][1] < L[poz_start][1]):
        poz_start = i

L = L[poz_start:] + L[:poz_start]

if L[1][1] > L[-1][1]:
    L = [L[0]] + L[:0:-1]

for x, y in L:
    print(x, y)

print(L[0][0], L[0][1])




