## Laborator 7
# https://docs.google.com/document/d/1fRHKC3FIxMhKwYFF7TdcjmFs46-YHIzz/edit?usp=sharing&ouid=103396152483260729031&rtpof=true&sd=true
## Problema 1
# ## a)
#
# def citire():
#     n=int(input("n= "))
#     L=[]
#     for i in range(n):
#         L.append(int(input(f"L[{i}]= ")))
#     return n,L
#
# ##b)
#
# def cautare(s,x,i=0,j=None):
#     if j is None:
#         j = len(s)
#     for k in range(i,j):
#         if s[k]>x:
#             return k
#     return -1
#
# ##c)
#
# n,L=citire()
# for poz in range(n-1):
# #    if cautare(L,L[poz],poz+1) != -1: #j = varianta default
#     if cautare(L, L[poz], poz + 1, poz + 2) != -1:
#         print("NU")
#         break
# else:
#     print("DA")


# ## Problema 2
# ## a)
# def cifmaxim(*numere):
#     return int("".join([max(str(x)) for x in numere]))
#
# ## b)
# def baza2(a, b, c):
#     return cifmaxim(a, b, c) == 111
#
# print(baza2(1001, 11, 100))
# print(baza2(1001, 17, 100))
# print(baza2(1001, 0, 100))


# ## Problema 3
# def cautare_cuvant(cuv,nume_fis_out,*nume_fis_in):
#     cuv = cuv.lower()
#     with open(nume_fis_out,"w") as g:
#         for nume in nume_fis_in:
#             L=[] #indecsii liniilor
#             with open(nume,"r") as f:
#                 for i,linie in enumerate(f):
#                     L_cuvinte = [c.strip("!.:,;?")
#                                  for c in linie.lower().replace("-", " ").split()]
#                     if cuv in L_cuvinte:
#                         L.append(i+1)
#             g.write(f"{nume} {"Cuvantul nu a fost gasit" if L==[]
#             else " ".join([str(x) for x in L]) }\n")
#
# #cautare_cuvant("FloAre","rez.txt", "eminescu.txt", "paunescu.txt")
# cautare_cuvant("AlBaStrA","rez.txt", "eminescu.txt", "paunescu.txt")


## Problema 4
# def citire():
#     with open('cinema.in', 'r') as f:
#         d = {}
#         for line in f:
#             cinema, film, ore = line.split(' % ')
#             L_ore = ore.strip().split()
#             if cinema not in d:
#                 d[cinema] = {}
#             d[cinema][film] = L_ore
#         return d
#
#
# d = citire()


# print(d)
# b)

# def sterge_ore(d, cinema, film, multime_ore):
#     if cinema in d and film in d[cinema]:
#         for poz in range(len(d[cinema][film]) - 1, -1, -1):
#             if d[cinema][film][poz] in multime_ore:
#                 d[cinema][film].pop(poz)
#         if len(d[cinema][film]) == 0:
#             del d[cinema][film]
#         return list(d[cinema].keys())
#
#
# # film = input('film= ')
# # cinema = input('cinema= ')
# # ora = input('hh:mm= ')
#
# # print(sterge_ore(d, cinema, film, {ora}))
# # print(d)
#
# def cinema_film(d, *cinematografe, ora_min, ora_max):
#     rez = []
#     for cinema in cinematografe:
#         if cinema in d:
#             for film in d[cinema]:
#                 aux_ore = []
#                 for ora in d[cinema][film]:
#                     if ora_min <= ora <= ora_max:
#                         aux_ore.append(ora)
#                 if aux_ore != []:
#                     rez.append((film, cinema, aux_ore))
#     rez.sort(key=lambda t: (t[0], -len(t[2])))
#     return rez

# print(cinema_film(d, 'Cinema 1', 'Cinema 2', ora_min= '14:00', ora_max = '22:00'))

