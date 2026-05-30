def determinant_cerc(a, b, c, d):
    xa, ya = a
    xb, yb = b
    xc, yc = c
    xd, yd = d

    ax, ay = xa - xd, ya - yd
    bx, by = xb - xd, yb - yd
    cx, cy = xc - xd, yc - yd

    a_p = ax * ax + ay * ay
    b_p = bx * bx + by * by
    c_p = cx * cx + cy * cy

    return a_p * (bx * cy - by * cx) - b_p * (ax * cy - ay * cx) + c_p * (ax * by - ay * bx)



xa, ya = map(int,input().split())
xb, yb = map(int,input().split())
xc,yc = map(int,input().split())

m = int(input())

for i in range(m):
    xp, yp = map(int, input().split())
    delta = determinant_cerc((xa, ya), (xb, yb), (xc, yc), (xp, yp))

    if delta > 0:
        print("INSIDE")
    elif delta < 0:
        print("OUTSIDE")
    else:
        print("BOUNDARY")


