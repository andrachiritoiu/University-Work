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


xa, ya = map(int, input().split())
xb, yb = map(int, input().split())
xc, yc = map(int, input().split())
xd, yd = map(int, input().split())


delta1 = determinant_cerc((xb, yb), (xc, yc), (xd, yd), (xa, ya))
delta2 = determinant_cerc((xa, ya), (xb, yb), (xc, yc), (xd, yd))

print("AC: ", end=" ")
if delta1 > 0:
    print("LEGAL")
elif delta1 < 0:
    print("ILLEGAL")
else:
    print("LEGAL")

print("BD: ", end=" ")
if delta2 > 0:
    print("LEGAL")
elif delta2 < 0:
    print("ILLEGAL")
else:
    print("LEGAL")





