n = int(input())

x_min = None
x_max = None
y_min = None
y_max = None

for _ in range(n):
    a, b, c = map(int, input().split())

    if b == 0:
        # a * x + c <= 0
        val = -c/a

        if a > 0:
            # x <= val
            if x_max is None or val < x_max:
                x_max = val
        else:
            # x >= val
            if x_min is None or val > x_min:
                x_min = val

    else:
        # b * y + c <= 0
        val = -c/b

        if b > 0:
            # y <= val
            if y_max is None or val < y_max:
                y_max = val
        else:
            # y >= val
            if y_min is None or val > y_min:
                y_min = val

if x_min is not None and x_max is not None and x_min > x_max:
    print("VOID")
elif y_min is not None and y_max is not None and y_min > y_max:
    print("VOID")
elif x_min is not None and x_max is not None and y_min is not None and y_max is not None:
    print("BOUNDED")
else:
    print("UNBOUNDED")