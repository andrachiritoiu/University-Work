n = int(input())

for i in range(n):
    xp, yp, xq, yq, xr, yr = map(int,input().split())

    delta = xq * yr + xr * yp + xp * yq - xq * yp - xr * yq - xp * yr

    if delta == 0:
        print("TOUCH")
    elif delta < 0:
        print("RIGHT")
    elif delta > 0:
        print("LEFT")