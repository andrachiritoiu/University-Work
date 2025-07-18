# #1
# #a)
# def citire_matrice(numefisier):
#     M=[]
#     with open(numefisier)as f:
#         n=int(f.readline())
#         aux=[]
#         cnt=0
#         for i in range(n):
#             x=int(f.readline())
#             if cnt==n**(1/2):
#                 M.append(aux)
#                 aux=[x]
#                 cnt=0
#             else:
#                 aux.append(x)
#             cnt+=1
#     M.append(aux)
#     return M
#
# #M=citire_matrice("punctaje.in")
# #print(M)
#
# #b)
# def prelucrare_matrice(M):
#     n=len(M[0])
#     for i in range(n):
#         dp=M[i][i]
#         for j in range(n):
#             M[i][j]-=dp
#         del M[i][i]
#     return M
#
# #M=prelucrare_matrice(M)
# #print(M)
#
# #c)
# M=citire_matrice("punctaje.in")
# M=prelucrare_matrice(M)
# for i in range(len(M)):
#     for j in range(len(M[0])):
#         print(M[i][j], end=" ")
#     print()
#
# #d)
# M=citire_matrice("punctaje.in")
# k=int(input("k="))
# g=open("cinema.in","w")
# sol=[]
# for lista in M:
#     for el in lista:
#         if sum([int(c) for c in str(el)])==k:
#             sol.append(el)
# if sol==[]:
#     g.write("imposibil!")
# else:
#     sol=list(set(sol))
#     sol.sort()
#     for i in sol:
#         g.write(str(i)+" ")
# g.close()

#REZOLVARE
#a)
f=open("punctaje.in")
d={}
for linie in f:
    if "Echipa" in linie:
        echipa,nume=linie.strip().split(maxsplit=1)
        d[nume]={}
    else:
        numeconcurent,punctaje=linie.strip().split(" : ")
        punctaje=[int(x) for x in punctaje.split()]
        punctaje.sort()
        d[nume][numeconcurent]=punctaje
print(d)
f.close()

#b)
def premianti(d,*scoruri,k):
    sol=[]
    for echipa in d:
        for concurent in d[echipa]:
            cnt=0
            nr=0
            ma=0
            aux=[]
            for p in d[echipa][concurent]:
                if p in scoruri:
                    cnt+=1
                    aux.append(p)
                    ma += p
                    nr += 1
            if cnt>=k:
                ma /= nr
                ma=round(ma,2)
                tuplu=(echipa,concurent,aux,ma)
                sol.append(tuplu)
    sol.sort(key=lambda t:(-t[3],t[0],t[1]))
    return sol

#print(premianti(d,50,25,40,60,30,45,k=3))

#c)
def sterge(d,nume_echipa,nume_membru):
    del  d[nume_echipa][nume_membru]
    L=[]
    for membru in d[nume_echipa]:
        L.append(membru)
    #len(d[nume_echipa])
    if len(L)>=2:
        return L
    else:
        del d[nume_echipa]
        print(f'Am sters si jucatorul {L[0]} si echipa {nume_echipa}')

print(sterge(d,'Noi suntem cei mai buni','Strumful Norocos'))