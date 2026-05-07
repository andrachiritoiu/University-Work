n = int(input())
points = []

for i in range(n):
    xi, yi= map(int,input().split())
    points.append((xi,yi))

L = [points[0], points[1]]

for i in range(2,n):
   L.append(points[i])
   ok=1

   while len(L)>2 and ok!=0:
       xr, yr = L[-1][0], L[-1][1]
       xp, yp = L[-2][0], L[-2][1]
       xq, yq = L[-3][0], L[-3][1]

       delta = xq * yr + xr * yp + xp * yq - xq * yp - xr * yq - xp * yr

       if delta >= 0 :
           L.pop(-2)
       else:
           ok = 0

# verif capete
schimbat = True
while schimbat and len(L) > 2:
    schimbat = False
    # Verif daca primul punct L[0] e concav între ultimul L[-1] și al doilea L[1]
    xr, yr = L[1][0], L[1][1]
    xp, yp = L[0][0], L[0][1]
    xq, yq = L[-1][0], L[-1][1]
    delta = xq * yr + xr * yp + xp * yq - xq * yp - xr * yq - xp * yr
    if delta >= 0:
        L.pop(0)
        schimbat = True

    # Verif daca ultimul punct L[-1] e concav între penultimul L[-2] și noul prim punct L[0]
    if len(L) > 2:
        xr, yr = L[0][0], L[0][1]
        xp, yp = L[-1][0], L[-1][1]
        xq, yq = L[-2][0], L[-2][1]
        delta = xq * yr + xr * yp + xp * yq - xq * yp - xr * yq - xp * yr
        if delta >= 0:
            L.pop(-1)
            schimbat = True

print(len(L))
for i in range(len(L)):
    print(L[i][0], L[i][1])