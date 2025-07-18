 #1
# #a)
# def divizori(*numere):
#     dict={}
#     for numar in numere:
#         div=[]
#         for d in range(2,numar//2+1):
#             if numar%d==0:
#                 #daca este si prim
#                 ok=1
#                 for i in range(2,d//2+1):
#                     if d%i==0:
#                         ok=0
#                 if ok==1:
#                     div.append(d)
#         dict[numar]=div
#     return dict
#
# d=divizori(50,21)
# print(d)
#
# #b)
# litere_10=[chr(ord('a')+i) for i in range(10)]
# print(litere_10)
#
# #c) log n

#2
# f=open("date.in")
# L=[]
# crt=1
# for linie in f:
#     spec=linie.strip().split("-")
#     L.append((crt,spec[0],spec[1]))
#     crt+=1
# L.sort(key=lambda t:t[2])
# f.close()
# print(L)
#
# sol=[]
# sol.append(L[0])
# p=0
# for i in range(1,len(L)):
#     if L[i][1]>=sol[p][2]:
#         sol.append(L[i])
#         p+=1
# print(len(sol))
# for i in range(len(sol)):
#     print(f'S{sol[i][0]}',end=" ")

#testare
S=[1,1,5,6,7,8,9,4]
d=4
k=7
L=[abs(S[k]-S[i])<=d for i in range(1,k)]
print(L)

