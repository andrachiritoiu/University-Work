## Laborator 9
# https://docs.google.com/document/d/1ClbsRyvcAL_FH_TiJVihunV3-QpSYA3CDW1xyB7QXJE/edit?usp=sharing

## GREEDY

## Problema 1 - minimizare timp mediu de asteptare
# def citire():
#     f = open("tis.txt")
#     L = [(i + 1, int(x))
#          for i, x in enumerate(f.read().split())]
#     f.close()
#     return L
#
#
# def greedy(L):
#     L2 = sorted(L, key=lambda t: t[1])
#     G = []
#     sum_t_serv = 0
#     sum_t_asteptare = 0
#     for poz, tserv in L2:
#         sum_t_serv += tserv
#         sum_t_asteptare += sum_t_serv
#         G.append((poz, tserv, sum_t_serv))
#     tma = sum_t_asteptare / len(L2)
#     return G, tma
#
# def afis(G, tma):
#     print(f"{'Nr.persoana'.ljust(11)}"
#           f"\t{'T_servire'.center(9)}"
#           f"\t{'T_asteptare'.rjust(11)}")
#
#     for poz,t_serv,t_ast in G:
#         print(f"{poz:<11}\t{t_serv:^9}\t{t_ast:>11}")
#     print(f"Timpul mediu de asteptare este {tma:.2f}")
#
#
# L = citire()
# # print(L)
# G,tma=greedy(L)
# afis(G,tma)


# ## Problema 2 - nr maxim spectacole intr-o sala
#
# def citire():
#     f = open("spectacole.txt")
#     L = []
#     for linie in f:
#         ore, nume = linie.strip().split(" ", 1)
#         inceput, sfarsit = ore.split('-')
#         L.append((inceput, sfarsit, nume))
#     f.close()
#     return L
#
#
# def greedy(L):
#     L.sort(key=lambda t: t[1])
#     G = [L[0]]
#     for poz in range(1, len(L)):
#         if L[poz][0] >= G[-1][1]:
#             G.append(L[poz])
#     return G
#
#
# def afisare(G):
#     g = open("programare.txt", "w")
#     for inceput, sfarsit, nume in G:
#         g.write(f"{inceput}-{sfarsit} {nume}\n")
#     g.close()
#
#
# L = citire()
# print(L)
# G = greedy(L)
# afisare(G)


# L = sorted([172, 162, 190, 183, 170, 188, 165, 210])
# dif = [L[i+1]-L[i] for i in range(len(L)-1)]
# print(L)
# print(dif)


#########################################

# ## Grupa 132, pb 3 din seminar 4 (cea cu csv)
#
# def citire():
#     L = []
#     with open("studenti.csv") as f:
#         for linie in f:
#             aux = linie.split(",")
#             L.append((aux[0], int(aux[1]),
#                       tuple(int(x) for x in aux[2:])))
#     return L
#
#
# def promovat(L, nr_minim_credite=15):
#     for i in range(len(L)):
#         if 0 not in L[i][2] and sum(L[i][2]) >= nr_minim_credite:
#             L[i] = L[i] + (True,)
#         else:
#             L[i] = L[i] + (False,)
#
#
# def criteriu_1(t):
#     return t[1], t[0]
#
#
# def criteriu_2(t):
#     return -t[3], t[0]
#
#
# def criteriu_3(t):
#     return -sum(t[2]), t[1], t[0]
#
#
# def criteriu_4(t):
#     return t[1], -t[3], -sum(t[2]), t[0]
#
#
# L = citire()
# print(L)
#
# # promovat(L,14)
# promovat(L)
# print(L)
#
# print(sorted(L, key=criteriu_1), "\n")
# print(sorted(L, key=criteriu_2), "\n")
# print(sorted(L, key=criteriu_3), "\n")
# print(sorted(L, key=criteriu_4), "\n")

