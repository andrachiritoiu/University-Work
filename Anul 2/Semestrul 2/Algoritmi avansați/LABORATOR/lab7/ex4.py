n = int(input())

stanga = []
dreapta = []
jos = []
sus = []

for _ in range(n):
    a, b, c = map(int, input().split())

    if b == 0:
        # a * x + c <= 0
        val = -c / a

        if a > 0:
            # x <= val, margine din dreapta
            dreapta.append(val)
        else:
            # x >= val, margine din stanga
            stanga.append(val)

    else:
        # b * y + c <= 0
        val = -c / b

        if b > 0:
            # y <= val, margine de sus
            sus.append(val)
        else:
            # y >= val, margine de jos
            jos.append(val)


m = int(input())

for _ in range(m):
    xp, yp = map(float, input().split())

    x_stanga = None
    x_dreapta = None
    y_jos = None
    y_sus = None

    # cea mai mare limita din stanga strict mai mica decat xp
    for val in stanga:
        if val < xp:
            if x_stanga is None or val > x_stanga:
                x_stanga = val

    # cea mai mica limita din dreapta strict mai mare decat xp
    for val in dreapta:
        if val > xp:
            if x_dreapta is None or val < x_dreapta:
                x_dreapta = val

    # cea mai mare limita de jos strict mai mica decat yp
    for val in jos:
        if val < yp:
            if y_jos is None or val > y_jos:
                y_jos = val

    # cea mai mica limita de sus strict mai mare decat yp
    for val in sus:
        if val > yp:
            if y_sus is None or val < y_sus:
                y_sus = val

    if x_stanga is None or x_dreapta is None or y_jos is None or y_sus is None:
        print("NO")
    else:
        aria = (x_dreapta - x_stanga) * (y_sus - y_jos)
        print("YES")
        print(f"{aria:.6f}")