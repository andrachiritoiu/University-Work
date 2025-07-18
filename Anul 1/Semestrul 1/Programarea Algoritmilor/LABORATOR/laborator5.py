## Laborator 5
# https://docs.google.com/document/d/1WM1XypigbW_tepXfieslSPZ2uM5FdRN9l-wJc5LWIWo/edit?usp=drive_link

## Problema 1

# ## varianta 1
# f = open("pb1.in", "r")
# text = f.read()
# f.close()
#
# g = open("pb1.out", "w")
# g.write(text)
# g.close()


##varianta 2
# f = open("pb1.in", "r")
# g = open("pb1.out", "w")
# while True:
#     linie = f.readline()
#     if linie == "":
#         f.close()
#         g.close()
#         break
#     g.write(linie)

###varianta 3
# f = open("pb1.in", "r")
# L_linii = f.readlines()
# f.close()
#
# with open("pb1.out", "w") as g:
#     # g.writelines(L_linii)
#     g.write("".join(L_linii))


# ## Problema 2
# f = open('pb2_test.in', 'r')
# g = open('pb2_test.out', 'w')
# nota = 1
# for linie in f:
#     aux, rez = linie.split('=')
#     x, y = aux.split('*')
#     x, y, rez = int(x), int(y), int(rez)
#     if x*y == rez:
#         nota += 1
#         g.write(f'{linie.strip()} Corect\n')
#     else:
#         g.write(f'{linie.strip()} Gresit {x*y}\n')
# g.write(f'Nota: {nota}')
# g.close()
# f.close()


## Problema 3
"""
Se citesc m, n și o matrice cu m linii și n coloane,
elementele unei linii fiind date pe o linie
(elementele unei linii date pe o linie separate cu spațiu).
Să se creeze o listă cu maximele de pe fiecare linie
(folosind și comprehensiune)
"""

# m, n=[int(x) for x in input("m, n= ").split()]
# matr=[[int(x) for x in input(f"Linia {i}: ").split()]
#       for i in range(m) ]
# # print(matr)
#
# # for linie in matr:
# #     print(linie)
#
# # for linie in matr:
# #     for x in linie:
# #         print(x, end=' ')
# #     print()
#
# for linie in matr:
#     print(*linie)
#
# L_maxime=[max(linie) for linie in matr]
# print(L_maxime)


## Problema 4
"""
Se citesc m, n și o matrice cu m linii și n coloane, 
elementele unei linii fiind date pe o linie 
(elementele unei linii date pe o linie separate cu spațiu). 
Se citește în plus un număr natural k. 
Să se insereze o linie nouă cu toate elementele 0 
între liniile k și k+1 ale matricei.
"""

# f = open("pb4.in","r")
# m,n = [int(x) for x in f.readline().split()]
# matr = [[int(x) for x in linie.split()] for linie in f]
#
# print(*matr,sep="\n")
# print()
#
# k = int(input('k = '))
#
# ## VAR 1
# #
# # # matr.insert(k+1,[0 for _ in range(n)])
# #
# #matr.insert(k+1,[0]*n)
#
# # # VAR 2
# #
# # matr[k+1:k+1] = [[0]*n]
#
# print(*matr,sep="\n")
# print()
#
# g = open("pb4.out","w")
# # g.writelines([' '.join([str(x) for x in linie]) + '\n'
# #               for linie in matr])
#
# g.write('\n'.join([' '.join([str(x) for x in linie])
#               for linie in matr]))
# g.close()


## Problema 5
"""
Se consideră tabloul bidimensional cu m linii şi n coloane, 
care conţine doar valorile {0,1,2}. Să se determine 
câte linii au produsul elementelor maxim (folosind și comprehensiune) 
"""

# f = open("pb5.in")
# matr = [[int(x) for x in linie.split()] for linie in f]
# print(*matr, sep="\n")
# f.close()
#
# # print(eval(f"{3}*{4}*{2}"))
#
# L_prod = [eval('*'.join([str(x) for x in linie]))
#           for linie in matr]
#
# print(L_prod)
#
# rez = L_prod.count(max(L_prod))
#
# print(rez)



## Problema 7
# f = open("pb7.in")
# matr = [[int(x) for x in linie.split()] for linie in f]
# print(*matr, sep="\n")
# print()
# f.close()
#
# nr_linii = len(matr)
# nr_coloane = len(matr[0])
#
# matr2 = [[matr[i][j] for i in range(nr_linii)]
#          for j in range(nr_coloane)]
#
# print(*matr2,sep='\n')



## Problema 6

# f = open("pb7.in")
# matr = [[int(x) for x in linie.split()] for linie in f]
# print(*matr, sep="\n")
# print()
# f.close()
#
# k = int(input("k = "))
#
# # L = [1,2,3,4,5,6,7]
# # k = 2 => [6,7,1,2,3,4,5]
#
# matr2 = [linie[-k:] + linie[:-k] for linie in matr]
#
# print(*matr2, sep="\n")
# print()

## Problema 8
## Să se determine numărul de valori pare din matrice

# f = open("pb7.in")
# matr = [[int(x) for x in linie.split()] for linie in f]
# print(*matr, sep="\n")
# print()
# f.close()
#
# lista_par = [x for linie in matr for x in linie if not x%2]
#
# print(lista_par)
# print(f'Matricea contine {len(lista_par)} numere pare ,iar suma lor este {sum(lista_par)}')


## Problema 9
## Să se determine pentru fiecare linie,
# cea mai mică valoare care se poate obține adunând
# elementele de pe linie, cu excepția unuia.

# f = open("pb7.in")
# matr = [[int(x) for x in linie.split()] for linie in f]
# print(*matr, sep="\n")
# print()
# f.close()
#
# L_sume = [sum(linie)-max(linie) for linie in matr]
#
# print(L_sume)


## Problema 10
"""
 Să se afişeze matricea citită astfel: prima linie de 
 la stânga spre dreapta, a doua linie de la dreapta spre 
 stânga, a treia linie de la stânga spre dreapta, a patra
  linie de la dreapta spre stânga etc.

"""
# f = open("pb7.in")
# matr = [[int(x) for x in linie.split()] for linie in f]
# print(*matr, sep="\n")
# print()
# f.close()
#
# matr2 = [(matr[i] if not i%2 else matr[i][::-1])
#           for i in range(len(matr))]
#
# print(matr2)



# # OBSERVATIE
# L = [1, 2, 3, 4, 5, 6]
# # for x in L:
# #     if x % 2 == 0:
# #         x = -x ## NU se modifica lista
# # print(L)
#
# for i in range(len(L)):
#     if L[i] % 2 == 0:
#         L[i] = -L[i] ## se modifica lista
# print(L)


#REZOLVARE
#1
# f=open("date.in","r")
# g=open("date.out","w")
# for linie in f:
#     g.write(linie)
#f.close()
#g.close()

#2
# f=open("date.in","r")
# g=open("date.out","w")
# sum=0
# for linie in f:
#     calcul,rez=linie.split("=")
#     a,b=calcul.split("*")
#     a,b=int(a),int(b)
#     rez=int(rez)
#     if (a*b==rez):
#         sum+=1
#         g.write(linie.strip()+" "+"Corect"+"\n")
#     else:
#         p=a*b
#         g.write(linie.strip() + " " + "Gresit" + "  " + str(p) + "\n")
# g.write("Nota"+" "+str(sum))
#f.close()
#g.close()



#3
# m=int(input("m="))
# n=int(input("n="))
# M=[[int(input(f'M[{i}][{j}]=')) for j in range(n)]for i in range(m)]
# print(M)
# L=[]
# for i in range(m):
#     max=0
#     for j in range(n):
#         if M[i][j]>max:
#             max=M[i][j]
#     L+=[max]
# print(L)

#4
# m=int(input("m="))
# n=int(input("n="))
# M=[[int(j) for j in input("numerle sunt").split()] for i in range(m)]
# k=int(input("k="))
# linie=[[0]*n]
# M=M[:k]+linie+M[k:]
# print(M)

#5
# m=int(input("m="))
# n=int(input("n="))
# M=[[int(input(f'M[{i}][{j}]=')) for j in range(n)]for i in range(m)]
# print(M)
# nr=0
# max=0
# for i in range(m):
#     prod=1
#     for j in range(n):
#         prod*=M[i][j]
#     if prod>max:
#         max=prod
#         nr=1
#     elif prod==max:
#         nr+=1
#
# print(nr)

#6
# m=int(input("m="))
# n=int(input("n="))
# M=[[int(j) for j in input("numerle sunt").split()] for i in range(m)]
# k=int(input("k="))
# k=k%n
# i=0
# for linie in M:
#     linie=linie[k:]+linie[:k]
#     M[i]=linie
#     i+=1
# print(M)

#7
#a
# m=int(input("m="))
# n=int(input("n="))
# M=[[int(j) for j in input("numerle sunt").split()] for i in range(m)]
# T=[[M[i][j]  for i in range(m)]for j in range(n)]
# print(T)

#b
# f=open("date.in")
# g=open("date.out","w")
# M=[]
# m=0
# for linie in f:
#     linie=linie.strip().split()
#     M+=[linie]
#     m+=1
# n=len(linie)
# T=[[M[i][j]  for i in range(m)]for j in range(n)]
# g.write(str(T))
# f.close()
# g.close()

#8
# m=int(input("m="))
# n=int(input("n="))
# M=[[int(j) for j in input("numerle sunt").split()] for i in range(m)]
# nr=0
# for i in range(m):
#     for j in range(n):
#         if M[i][j]%2==0:
#             nr+=1
# print(nr)

#9
# m=int(input("m="))
# n=int(input("n="))
# M=[[int(j) for j in input("numerle sunt").split()] for i in range(m)]
# max=0
# for i in range(m):
#     max=0
#     sum=0
#     for j in range(n):
#         sum =sum+ M[i][j]
#         if max < M[i][j]:
#             max = M[i][j]
#     sum-=max
#     print(sum)

#10
m=int(input("m="))
n=int(input("n="))
M=[[int(input(f'M[{i}][{j}]=')) for j in range(n)]for i in range(m)]
for i in range(m):
    if i%2==0:
        for j in range(n):
            print(M[i][j],end=" ")
        print()
    else:
        for j in range(n-1,-1,-1):
            print(M[i][j],end=" ")
        print()




