## Laborator 4
# https://docs.google.com/document/d/1SwCmGlHJVJSRsm3SgpxEQht2g5JhNQDXoEeR-F-6gpU/edit?usp=sharing
# from bisect import bisect
# from enum import verify
# from itertools import count

# L[start:stop:pas]
#
# L = [5,7,9,2,3,0,1,6]
# L[2:4] = [7,4,5,2,3,0]
# L[2:4] = []
# L[3:3] [6,7,8,3,5]

## COMPREHENSIUNE

# L = [k for k in range(5) if k % 2 == 1]
#
# L = []
# for ...:
#     if ...:
#         L.append(k)


# ## Problema 1
#
# prop = "ana   are mere ananas alune  banane ".lower()
# L = [cuv for cuv in prop.split() if cuv[0] in "aeiou"]
# print(L)
#
# print(prop.split())
# print(prop.split(" "))


# ## Problema 2
# prop = "ana are 3 mere!".lower()
# k = int(input('k = '))
# lung = ord('z') - ord('a') + 1
# L = [(chr((ord(c) - ord('a') + k) % lung + ord('a')) if c.isalpha() else c)
#      for c in prop]
# prop2 = "".join(L)
# print(prop2)


# ## Problema 3
# prop = "ana are 3 mere, 5 pere!".lower()
# prop2 = "".join([(c + 'p' + c if c in "aeiou" else c) for c in prop])
# print(prop2)
#
# prop3 = "".join([(f"{c}p{c}" if c in "aeiou" else c) for c in prop])
# print(prop3)


# ## Problema 4
# L = [chr(x) for x in range(ord('a'), ord('z')+1)]
# print(L)


# ## Problema 5
# n = int(input("n= "))
# L = [(x if x%2==1 else -x) for x in range(1, n+1)]
# print(L)
#
# L = [(-1)**(x+1) * x for x in range(1, n+1)]
# print(L)

# ## Problema 8
# L = [2, 4, 1, 7, 5, 1, 8, 10]
# L2 = [L[i] for i in range(len(L)) if L[i] % 2 == i % 2]
# print(L2)
#
# L3 = [nr for poz, nr in enumerate(L) if poz % 2 == nr % 2]
# print(L3)

# ## Problema 9
# L = [1, 2, 3, 4, 5, 6, 7]
# # L2 = [(L[i], L[i+1]) for i in range(len(L)-1)]
# # print(L2)
#
# L2 = [(L[i], L[i+1]) for i in range(0, len(L)-1, 2)]
# print(L2)


# ## Problema 10
# sir = "abcde"
# L = [sir[i:] + sir[:i] for i in range(len(sir))]
# print(L)


## OPERATII CU LISTE

# ## Problema 11
# L1 = list(range(0, 11))
# L2 = list(range(10, 21))
# L1[::2] = L2[::2]
# print(L1)
# print(L2)


## Problema 12
# L = list(range(20))
# k = int(input("k= "))
#
# # L[:k]=[]
# # print(L)
#
# # del L[:k]
# # print(L)
#
# # for _ in range(k):
# #     L.pop(0)
# # print(L)
#
# # for i in range(k-1,-1,-1):
# #     L.pop(i)
# # print(L)
#
# # i=k-1
# # while i>=0:
# #     L.pop(i)
# #     i-=1
# # print(L)
#
# # i=0
# # while i<k:
# #     L.pop(0)
# #     i+=1
# # print(L)


# ## Problema 13
# L = [5,8,0,3,4,0,7,9,0,4,5,0,2]
# if L.count(0) >= 2:
#     p1 = L.index(0)
#     p2 = L.index(0, p1 + 1)
#     L[p1:p2 + 1] = []
# print(L)


# ## Problema 14
# L = [5,8,0,3,4,0,7,9,0,4,5,0,2]
# # for _ in range(L.count(0)):
# # #     L.remove(0)
# # # print(L)
#
# while 0 in L:
#     L.remove(0)
# print(L)


# L_nr = [int(nr) for nr in input("Introduceti numerele: ").split()]
# print(L_nr)


## Problema 2 decriptarea => TEMA
## Pb 6 si 7 => TEMA
## probleme 15 - final => TEMA

#REZOLVARE
#1
# prop = "ana   are mere ananas alune  banane ".lower()
# L=[x for x in prop.split() if x[0] in "aeiou"]
# print(L)


#2
# s="O zi frumoasa".lower()
# dif=ord('z')-ord('a')+1
# k=9
# L=[chr((ord(c)-ord('a')+k)%dif+ord('a')) if c.isalpha() else c
#    for c in s]
# print("".join(L))

#3
# s="Ana are mere"
# L=[c+'p'+c.lower() if c in "aeoiuAEIOU" else c for c in s]
# print("".join(L))


#4
# L=[chr(i+ord('a')) for i in range(ord('z')-ord('a')+1)]
# print(L)

#5
# n=int(input("n="))
# L=[i if i%2==1 else -i for i in range(1,n+1)]
# print(L)

#6
# L=[1,2,3,4,5,6,7,8,11,21,24,17,29]
# M=[i for i in L if i%2==1]
# print(M)

#7
# L=[1,2,3,4,5,6,7,8,11,21,24,17,29]
# M=[L[i] for i in range(len(L)) if i%2==1]
# print(M)

#8
# L=[2,4,1,7,5,1,8,10]
# P=[L[i] for i in range(len(L)) if L[i]%2==i%2]
# print(P)

#9
# L=[1,2,3,4]
# P=[(L[i],L[i+1]) for i in range(len(L)-1)]
# print(P)

#10
# s="abcde"
# L=[s[i:]+s[:i] for i in range(len(s))]
# print(L)

#11
# L1=[1,5,7,2,6,3,9]
# L2=[2,4,7,9,1,5,8]
# n=7

#var 1
# for i in range(0,n,2):
#     L1[i]=L2[i]

#var 2 cu slice
# L1[::2]=L2[::2]
# print(L1)

#12 stergere
# L=[1,5,2,7,8,9,2,5]
# k=2
#  #v1
# L=L[k:]
#  #v2
# L[:k]=[]
# #v3
# del L[:k]
# #v4
# i=0
# while i<k:
#     L.pop(0)
#     i+=1
#
# print(L)

#13
# L=[1,3,0,7,8,0,8,9,0,0]
# p=-1
# d=-1
# for i in range(len(L)):
#     if L[i]==0:
#         if p==-1:
#             p=i
#         elif d==-1:
#             d=i
# L=L[:p]+L[d+1:]
# print(L)

#14
# L=[1,3,0,7,8,0,8,9,0,0]
#
# # L=[i for i in L if i!=0]
#
# i=0
# while i<len(L):
#     if L[i]==0:
#         L.remove(0)
#     else:
#         i+=1
# print(L)

#15
# L=[3,5,0,1,8,9,3,4,0]
# k=3
# sum=0
# p=0
# for i in range(k):
#     sum+=L[i]
# min=sum
# for i in range(len(L)-k):
#     sum=0
#     for j in range(i,i+k):
#         sum+=L[j]
#     if sum<min:
#         min=sum
#         p=i
# L=L[:p]+L[p+k:]
# print(L)

#16
# L=[1,1,4,5,5,6,7,7,8,8,9]
# L=list(set(L))
# print(L)

#17
# L=[float(x) for x in input("numerele sunt:").split()]
# i=0
# while i<len(L):
#     if L[i]<0:
#         L.insert(i+1,0)
#         i+=2
#     else:
#         i+=1
# print(L)

#18 eratostene
# n=int(input("n="))
# L=[]
# for i in range(2,n):
#     ok=1
#     for j in range(2,i//2+1):
#         if i%j==0:
#             ok=0
#     if ok==1:
#         L+=[i]
#
# print(L)

#19
# n=int(input("n="))
# v=[0]*n
# ap=[0]*100
# for i in range(n):
#     v[i]=int(input(f'v[{i}]='))
#     ap[v[i]]+=1
# nr=0
# for i in range(100):
#     if ap[i]!=0:
#         nr+=ap[i]//2
# print(nr)

#20
# L=[int(x) for x in input("numerele sunt:").split()]
# M=[int(x) for x in input("numerele sunt:").split()]
# R=L+M
# R.sort()
# I=[x for x in M if x in L]
# I.sort()
# print(R)
# print(I)

#21
n=int(input("n="))
M=[[0]*n for _ in range(n)]
for i in range(n):
    for j in range(i+1):
        if j==0 or j==i:
            M[i][j]=1
        else:
            M[i][j]=M[i-1][j-1]+M[i-1][j]

for i in range(n):
    for j in range(i+1):
        print(M[i][j],end=" ")
    print()

