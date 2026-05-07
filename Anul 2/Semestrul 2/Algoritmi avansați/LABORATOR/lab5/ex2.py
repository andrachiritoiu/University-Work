n = int(input())
xa, ya = map(int,input().split())
xc,yc = map(int,input().split())

xfirst,yfirst = xa, ya

left = 0
right = 0
touch = 0

for i in range(2,n):
    xp, yp = map(int, input().split())
    delta = xc * yp + xp * ya + xa * yc - xc * ya - xp * yc - xa * yp

    if delta == 0:
        touch+=1
    elif delta < 0:
        right+=1
    elif delta > 0:
        left+=1

    xa, ya = xc, yc
    xc, yc =  xp, yp

xp, yp = xfirst,yfirst
delta = xc * yp + xp * ya + xa * yc - xc * ya - xp * yc - xa * yp

if delta == 0:
    touch+=1
elif delta < 0:
    right+=1
elif delta > 0:
    left+=1

print(left, right, touch)