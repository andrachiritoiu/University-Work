# OBSERVATIE
#L = [1, 2, 3, 4, 5, 6]
# for x in L:
#     if x % 2 == 0:
#         x = -x  # NU se modifica lista
# print(L)

# for i in range(len(L)):
#     if L[i] %2 == 0:
#         L[i] = -L[i] # se modifica lista
# print(L)


## Laborator 6
# https://docs.google.com/document/d/1bU5Srecwv9WjE3aD7TnxATIauHr582qZ/edit?usp=sharing&ouid=103396152483260729031&rtpof=true&sd=true

# L = [4,6,13,173,2,142, 189, 2222]

# L.sort()
# print(L)
#
# L2 = sorted(L, reverse = True)
# print(L2)

# ## Problema 1
#
# L = [4,6,13,173,2,142, 189, 2222]
#
# ## a)
# print(sorted(L, key = str))
#
# ## b)
# print(sorted(L, key = lambda x: str(x)[::-1]))
#
# ## c)
# print(sorted(L, key = lambda x: len(str(x)), reverse=True ))
# print(sorted(L, key = lambda x: -len(str(x)) ))
#
# ## d)
# print(sorted(L, key = lambda x: len(set(str(x))) ))
#
# ## e)
# print(sorted(L, key = lambda x: (len(str(x)), -x) ))


# d = {} ## dictionarul vid
# m = set() ## multimea vida


## Problema 3
# f = open("pb2_elevi.in", "r")
# D = {}
# for linie in f:
#     # cnp, nume, prenume, *note = linie.split() #note este lista de str-uri
#     # print(cnp, nume, prenume, note, sep = '\n')
#     # cnp, nume, prenume, note = linie.split(' ', 3) #note este str
#     cnp, nume, prenume, note = linie.split(maxsplit=3)  # note este str
#
#     cnp = int(cnp)
#     L_note = [int(x) for x in note.split()]
#     D[cnp] = [nume, prenume, L_note]
#
# f.close()
# # print(D)
#
#
# ## b)
# """
# b) Scrieți o funcție care primește ca parametri un cnp și structura
# de date în care s-au memorat datele despre elevi la punctul a) și
# crește cu 1 prima notă a elevului cu cnp-ul primit ca parametru.
# Funcția returnează nota după modificare sau None dacă cnp-ul nu există.
#  Apelați funcția pentru un cnp citit de la tastatură.
# """
#
#
# def creste_nota(cnp, d):
#     if cnp not in d:
#         return None
#     d[cnp][2][0] += 1
#     return d[cnp][2][0]
#
#
# # cnp = int(input("CNP: "))
# # print(creste_nota(cnp,D))
# # print(D)
#
#
# ## c)
# """
# Scrieți o funcție care primește ca parametri un cnp, o listă de note
# și structura de date în care s-au memorat datele despre elevi la
# punctul a) și adaugă lista de note la notele elevului  cu cnp-ul
#  primit ca parametru. Funcția returnează lista de note după
#  modificare sau None dacă cnp-ul nu există. Apelați funcția pentru
#  un cnp citit de la tastatură si lista l_note=[10,8].
# """
#
#
# def adauga_note(cnp, L, d):
#     if cnp in d.keys():
#         # d[cnp][2]+=L
#         # sau
#         d[cnp][2].extend(L)
#         return d[cnp][2]
#
#
# # cnp = int(input("CNP: "))
# # print(adauga_note(cnp,[10,8],D))
# # print(D)
#
#
# ## d)
# """
# Scrieți o funcție care primește ca parametri un cnp și structura
#  de date în care s-au memorat datele despre elevi la punctul a)
#   și șterge informațiile despre elevul cu acest cnp. Apelați
#   funcția pentru un cnp citit de la tastatură (dacă cnp-ul nu
#   este în listă funcția nu va modifica nimic și nu va da eroare)
# """
#
#
# def sterge_elev(cnp, d):
#     if cnp in d:
#         del d[cnp]
#

# cnp = int(input("CNP: "))
# print(sterge_elev(cnp, D))
# print(D)


## e)
"""
Folosind structura de date în care s-au memorat datele despre 
elevi la punctul a) (nu citind din nou datele) construiți în 
memorie o lista de liste cu elevii din fișier, un element din 
lista fiind de forma [nume, prenume, lista de note] ordonată 
descrescător după medie și, în caz de egalitate, după nume și
 afișați elementele listei în fișierul „elevi.out”.
 """
from logging import addLevelName

# Lrez = sorted(D.values(),
#               key=lambda L: (-sum(L[2])/len(L[2]), L[0]))
# print(Lrez)
#
# g=open("pb2_elevi.out", "w")
# for elev in Lrez:
#     g.write(str(elev)+"\n")
# g.close()


## f)
# """
# Scrieți o funcție care primește ca parametru structura de
#  date în care s-au memorat datele despre elevi la punctul a)
#  și adaugă la informațiile asociate unui student un
#   cod de lungime 6 generat aleator care conține 3 litere urmate
#    de 3 cifre. Exemplu de apel:
# genereaza_coduri(d)
# print(d)
# """

# import random
# import string
#
#
# #print(random.choices(string.ascii_letters , k=3))
#
# def genereaza_coduri(d):
#     for cnp in d:
#         cod = ''.join(random.choices(string.ascii_letters , k=3)
#                       +
#                       random.choices('0123456789' , k=3))
#         d[cnp].append(cod)
#         #sau
#         #d[cnp] += [cod]
#         #sau
#         #d[cnp].extend([cod])
#
#
# genereaza_coduri(D)
# print(D)


# # Problema 3
#
# f = open("pb3.in", "r")
# L_cuv = f.read().split()
# f.close()
# print(L_cuv)
#
# p = int(input("nr litere sufix = "))
# d = {}
# for cuv in L_cuv:
#     sufix = cuv[-p:]
#     if sufix not in d.keys():
#         d[sufix] = [cuv]
#     else:
#         d[sufix].append(cuv)
# print(d)
#
# L_rez = sorted(d.values(), key = lambda L_cuv : -len(L_cuv))
# print(L_rez)
#
# g = open("pb3_rime.txt", "w")
# for L_cuv in L_rez:
#     g.write(" ".join(sorted(L_cuv, reverse = True)) + '\n')
# g.close()
#
# # Problema 4
# f = open("pb4.in", "r")
# L_cuv = f.read().split()
# f.close()
# print(L_cuv)
#
# d = {}
# for cuv in L_cuv:
#     litere = frozenset(cuv)
#     if litere not in d.keys():
#         d[litere] = [cuv]
#     else:
#         d[litere].append(cuv)
# print(d)
#
# L_rez = [sorted(L_cuv, reverse = True)
#     for litere, L_cuv in sorted(d.items(),
#                                      key = lambda t : -len(t[0]))
#          if len(L_cuv) >= 2]
# print(*L_rez, sep = '\n')





#REZOLVARE
#sorted(L)-functie
#L.sort()-metoda,nu se poate in print

#1
#a
#L=[4,1,8,9,12,4,6,124,56,2,91,11,494]
# L.sort(key=str)
# print(L)

#b
#print(sorted(L,key=lambda x:str(x)[::-1]))

#c
#print(sorted(L,key=lambda x:-len(str(x))))

#d
#print(sorted(L,key=lambda x:len(set(int(c) for c in str(x)))))
# print(sorted(L, key = lambda x: len(set(str(x))) ))

# a="ana"
# print(set(a)) =>{'a', 'n'}

#e
#print(sorted(L,key=lambda x:(len(str(x)),-x)))

#f
#print(sorted(L, key=lambda x:(x%2==0,x if x%2 else -x)))

#f
# s="ana a are mere si b pere"
# L=[cuv for cuv in s.split() if len(cuv)>=2]
# #sa modifice L,folsim sort
# L.sort(key=len, reverse=True )
# s=" ".join(L)
# print(s)

#h
# v = [11, 45, 20, 810, 179, 81, 1000]
# v.sort(key=lambda x:(sum(int(cif) for cif in str(x)),-x))
# print(v)

# a=27
# L=[int(cif) for cif in str(a)]
# print(L)

#2
#a
# f=open("date.in","r")
# d={}
# for linie in f:
#     cnp,nume,prenume,*note=linie.split()
#     cnp=int(cnp)
#     note=[int(n) for n in note]
#     d[cnp]=[nume,prenume,note]
# print(d)

#b
# def modifnote(cnpd,d):
#     if cnpd not in d:
#         return None
#     else:
#         d[cnpd][2][0]+=1
#         return d[cnpd][2][0]
#
# cnpd=int(input("cnpd="))
# print(modifnote(cnpd,d))
# print(d)

#c
# def modiflist(cnpd,l_note,d):
#     if cnpd not in d:
#         return None
#     else:
#         d[cnpd][2].extend(l_note)
#         return d[cnpd][2]
#
# cnpd=int(input("cnpd="))
# l_note=[10,8]
# print(modiflist(cnpd,l_note,d))

#d
# def delete(cnpd,d):
#     if cnpd in d:
#         del d[cnpd]
#         return d
# cnpd=int(input("cnpd="))
# print(delete(cnpd,d))

#e
#var1
# L=[]
# for cnp in d.keys():
#     Ls = [0]*3
#     Ls[0] = d[cnp][0]
#     Ls[1] = d[cnp][1]
#     Ls[2] = d[cnp][2]
#     L.append(Ls)
# L.sort(key=lambda x:(-(sum(x[2])/len(x[2])),x[0]))
# print(L)

#var2
# Lrez = sorted(d.values(),
#               key=lambda L: (-sum(L[2])/len(L[2]), L[0]))
# print(Lrez)

#f
# import random
# import string
#
# def functie(d):
#     for cnp in d.keys():
#         cod="".join(random.choices(string.ascii_letters,k=3)+random.choices('0123456789',k=3))
#         d[cnp]+=[cod]
# functie(d)
# print(d)
#f.close()

#3
# f=open("date.in","r")
# g=open("date.out","w")
# p=int(input("p="))
# d={}
# for linie in f:
#     L=linie.split()
#     for cuv in L:
#         if cuv[-p:] in d.keys():
#             d[cuv[-p:]].append(cuv)
#         else:
#             d[cuv[-p:]] = [cuv]
# L=sorted(d.values(),key=lambda x:-len(x))
# print(L)
# for list in L:
#     list.sort(key=str, reverse=True)
#     g.write(" ".join(list))
#     g.write('\n')
# f.close()
# g.close()

#4
# f=open("date.in","r")
# g=open("date.out","w")
# d={}
# for linie in f:
#     l=linie.split()
#     for cuv in l:
#         s="".join(sorted(set(cuv)))
#         if s not in d:
#             d[s]=[cuv]
#         else:
#             d[s].append(cuv)
# d={cheie: d[cheie] for cheie in sorted(d.keys(),key=len,reverse=True)}
# print(d)
# R=[]
# for list in d.values():
#     if len(list)>=2:
#         list.sort(key=lambda x:(len(x),str(x)))
#         R+=[list]
# for list in R:
#     for cuv in list:
#         g.write(cuv+" ")
#     g.write('\n')

#sau
# L_rez = [sorted(L_cuv, reverse = True)
#     for litere, L_cuv in sorted(d.items(),key = lambda t : -len(t[0]))
#     if len(L_cuv) >= 2]
#
# print(*L_rez, sep = '\n')
# f.close()
# g.close()

#5
#a
# def functie(*numefisiere):
#     d={}
#     for numefisier in numefisiere:
#         try:
#             with open(numefisier,"r") as f:
#                 for linie in f:
#                     L=linie.split()
#                     for cuv in L:
#                         cuv = cuv.strip().lower()
#                         if cuv not in d:
#                             d[cuv]=1
#                         else:
#                             d[cuv]+=1
#
#         except FileNotFoundError:
#             print("eroare")
#     return d
#
# d={}
# d=functie("date.in","date.out")
# print(d)

#b
# d={cheie:d[cheie] for cheie in sorted(d,key=str)}
# for cheie in d:
#     print(cheie,end=" ")

#c
# d=functie("date.in")
# L=[tuplu for tuplu in d.items()]
# print(sorted(L,key=lambda x:-x[1]))

#d
# d=functie("date.out")
# d={cheie : valoare for cheie, valoare in sorted(d.items(),key=lambda x:(x[1],str(x)))}
# print(d)
# print(max(d.items(),key=lambda x:(x[1],str(x[0])))[0])

#6
prenume='ana'
nume='ion'
email = f"{prenume.lower()}.{nume.lower()}@s.unibuc.ro"
print(email)