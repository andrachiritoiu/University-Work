# #1
# with open("date.in", "r") as f:
#     A = [int(x) for x in f.readline().split()]
#     B = [int(x) for x in f.readline().split()]
#
# A.sort()
# B.sort()
#
# suma = 0
# i = 0
# m = len(A)
# perechi = []
#
# while A[i] < 0:
#     suma += A[i] * B[i]
#     perechi.append((A[i], B[i]))
#     i += 1
#
# elemRamase = len(A) - i
# j = -elemRamase
# while i < m:
#     suma += A[i] * B[j]
#     perechi.append((A[i], B[j]))
#     i += 1
#     j += 1
#
# print(f"{suma} = ", end = "")
# for pereche in perechi[: len(perechi) - 1]:
#     print(f"({str(pereche[0])}) * ", end = "") if pereche[0] < 0 else print(f"{str(pereche[0])} * ", end = "")
#     print(f"({str(pereche[1])}) + ", end = "") if pereche[1] < 0 else print(f"{str(pereche[1])} + ", end = "")
#
# print(f"({str(perechi[-1][0])}) * ", end = "") if perechi[-1][0] < 0 else print(f"{str(perechi[-1][0])} * ", end = "")
# print(f"({str(perechi[-1][1])})") if perechi[-1][1] < 0 else print(str(perechi[-1][1]))

#2
with open("galeti.in") as f:
    n = int(f.readline())
    t = [int(x) for x in f.readline().split()[:n]]
    C = int(f.readline())

t.sort(reverse = True)
sol = []

for galeata in t:
    if C - galeata >= 0:
        C -= galeata
        sol.append(galeata)

if C == 0:
    for galeata in sol:
        print(galeata, end = " ")
else:
    print("Imposibil")