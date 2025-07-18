## Laborator 11
# https://docs.google.com/document/d/1jI2H0iO0l0sMuOgZ2cip-Uzw2GBmh2dYZQfleTjtlKw/edit?usp=sharing

# ## Problema 1
# def munte(L, st, dr):
#     if dr-st+1<3:
#         return False
#     mij=(st+dr)//2
#     if L[mij-1]<L[mij]>L[mij+1]:
#         return L[mij], mij
#     if L[mij-1]>L[mij]:
#         return munte(L,st,mij)
#     return munte(L,mij,dr)
#
# f=open("pb1_date.in")
# n=int(f.readline())
# L=[int(x) for x in f.readline().split()]
# f.close()
#
# print(n)
# print(L)
#
# print(munte(L,0,len(L)-1))


# ## Problema 2
#
# def nrAparitii(L, x):
#     def primaAp(L, x, st, dr):
#         if L[0] == x:
#             return 0
#         if st > dr:
#             return -1
#         mij = (st + dr) // 2
#         if L[mij] == x and L[mij - 1] != x:
#             return mij
#         if x <= L[mij]:
#             return primaAp(L, x, st, mij - 1)
#         return primaAp(L, x, mij + 1, dr)
#
#     def ultimaAp(L, x, st, dr):
#         if L[-1] == x:
#             return len(L) - 1
#         if st > dr:
#             return -1
#         mij = (st + dr) // 2
#         if L[mij] == x and L[mij + 1] != x:
#             return mij
#         if x < L[mij]:
#             return ultimaAp(L, x, st, mij - 1)
#         return ultimaAp(L, x, mij + 1, dr)
#
#     s = primaAp(L, x, 0, len(L) - 1)
#     f = ultimaAp(L, x, 0, len(L) - 1)
#     print(s, f)
#     if s == -1 or f == -1:
#         return -1
#     return f - s + 1
#
#
# L = [1, 1, 2, 2, 2, 2, 6, 9, 9, 20]
# print(nrAparitii(L, 2))


## Problema 3

# n = 5
# 1 12 15 16 38
# 2 13 17 30 45
#
# 15 16 38
# 2 13 17
#
# 15 16
# 13 17
#
# 13 15 16 17 => mediana = (15+16)/2=15.5
#
#
# # 1 2 12 13 15 16 17 30 38 45
# # mediana = (15+16)/2 = 15.5


# def mediana(L1, st1, dr1, L2, st2, dr2):
#     print(L1[st1:dr1+1],L2[st2:dr2+1])
#
#     if dr1 - st1 == 1 and dr2 - st2 == 1:
#         R = sorted([L1[st1], L1[dr1], L2[st2], L2[dr2]])
#         return (R[1] + R[2]) / 2
#
#     if (dr1 - st1 + 1) % 2 == 1:
#         mij1_st = mij1_dr = (st1 + dr1) // 2
#     else:
#         mij1_st=(st1 + dr1) // 2
#         mij1_dr=mij1_st+1
#
#     if (dr2 - st2 + 1) % 2 == 1:
#         mij2_st = mij2_dr = (st2 + dr2) // 2
#     else:
#         mij2_st=(st2 + dr2) // 2
#         mij2_dr=mij2_st+1
#
#     med1=(L1[mij1_st]+L1[mij1_dr])/2
#     med2=(L2[mij2_st]+L2[mij2_dr])/2
#
#     if med1==med2:
#         return med1
#     if med1<med2:
#         return mediana(L1,mij1_st,dr1,L2,st2,mij2_dr)
#     return mediana(L1,st1,mij1_dr,L2,mij2_st,dr2)
#
# L1 = [1, 12, 15, 16, 38]
# L2 = [2, 13, 17, 30, 45]
#
# print(mediana(L1,0,len(L1)-1,L2,0,len(L2)-1))

