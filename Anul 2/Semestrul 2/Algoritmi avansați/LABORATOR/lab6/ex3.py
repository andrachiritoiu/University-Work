n = int(input())
poligon = []

okx=1
oky=1

for i in range(n):
    xi, yi = map(int, input().split())
    poligon.append((xi, yi))

min = 0
max =0

for i in range(n):
    if poligon[i][0] < poligon[min][0] :
        min = i

    if poligon[i][0] > poligon[max][0] :
        max = i


i = min
while i != max:
    urmator = (i + 1) % n

    if poligon[urmator][0] < poligon[i][0]:
        okx = 0

    i = urmator

i = min
while i != max:
    urmator = (i - 1 + n) % n

    if poligon[urmator][0] < poligon[i][0]:
        okx = 0

    i = urmator

if okx:
    print("YES")
else:
    print("NO")




min = 0
max =0

for i in range(n):
    if poligon[i][1] < poligon[min][1] :
        min = i

    if poligon[i][1] > poligon[max][1] :
        max = i


i = min
while i != max:
    urmator = (i + 1) % n

    if poligon[urmator][1] < poligon[i][1]:
        oky = 0

    i = urmator

i = min
while i != max:
    urmator = (i - 1 + n) % n

    if poligon[urmator][1] < poligon[i][1]:
        oky = 0

    i = urmator

if oky:
    print("YES")
else:
    print("NO")