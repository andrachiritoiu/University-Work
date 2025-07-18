# Laborator 13
# https://docs.google.com/document/d/1UCFuPlWchZbHJbWaMKlERVF47AAtFH6Wjwj5Qx4mOK4/edit?usp=sharing

# #model test
# #1
#
# with open("punctaje.in","r") as f:
#     M=[[int(x) for x in linie.split()]for linie in f]
# for linie in M:
#     print(*linie)
#
# #cand avem de facut modificari ale listei, parcurgem prin pozitii (pron valoare face copii-read only)
# for i in range(len(M)):
#     M[i].remove(max(M[i]))
#     M[i].remove(max(M[i]))
# for linie in M:
#     print()
#
# with open("matrice.out","w")as g:
#     # g.write("\n".join([" ".join([str(x)for x in linie]) for linie in M]))
#
# #sau
#     g.writelines([" ".join([str(x)for x in linie])+"\n" for linie in M])


# #2
# with open("exemplu.txt","r") as f:
#     d={}
#     for linie in f:
#         for cuv in linie.lower().split():
#             # if cuv not in d:
#             #     d[cuv]=1
#             # else:
#             #     d[cuv]+=1
#
#             #sau
#             d[cuv] = d.get(cuv, 0) +1
#
# print(d)
#
# d2={}  #freceventa-lista de cuvinte
# for cuv,frecv in d.items():
#     if frecv not in d2:
#         d2[frecv] = [cuv]
#     else:
#         d2[frecv].append(cuv)
#
#     #sau =>ineficient + pe liste
#     # d2[frecv] = d2.get(frecv, []) + [cuv]
#
# print(d2)
#
# rez= sorted(d2.keys(), reverse=True) #lista de frecvente
#
# print()
# for frecv in rez:
#     print(f"Frecevnta {frecv}: {", ".join(sorted(d2[frecv]))}")

#PD
#1
# with open("punctaje.in","r") as f:
#     m,n=[int(x) for x in f.readline().split()]
#     M=[[int(x)for x in linie.split()]for linie in f]
#
# print(m,n)
# print(M)
# #smax[i][j]=suma maxima a traseului care se termina pe pozitia (i,j)
# smax=[[0]*n for _ in range(m)]
# for i in range(m):
#     for j in  range(n):
#         if i==0 and j==0:
#             smax[i][j]=M[i][j]
#         elif i==0:
#             smax[i][j]=smax[i][j-1]+M[i][j]
#         elif j==0:
#             smax[i][j]=smax[i-1][j]+M[i][j]
#         else:
#             smax[i][j]=max(smax[i][j-1],smax[i-1][j]+M[i][j])
#
# print()
# for linie in M:
#     print(*linie)
#
# L_traseu = [(m-1, n-1)]
# i=m-1
# j=n-1
# while i>0 or j>0:
#     if i>0 and (j==0 or smax[i-1][j]>=smax[i][j-1]):
#         i-=1
#     else:
#         j-=1
#     L_traseu.append((i,j))
#
# print(L_traseu)
# with open("matrice.out","w") as g:
#     g.write(f'suma este {smax[-1][-1]}.\n')
#     g.writelines(f'{i+1} {j+1} \n' for i,j in L_traseu[::-1])

#2
with open("../PA/date.in", "r") as f:
    L=[int(x) for x in f.readline().split()]
print(L)

#smax[i]=suma maxima a subscventei care se termina pe pozitia i
smax=[0 for x in range(len(L))]
smax[0]=L[0]
for i in range(1,len(L)):
    smax[i]=max(L[i],smax[i-1]+L[i])
    #sau
    # smax[i]=L[i]+max(0,smax[i-1])
print(smax)
suma_max=max(smax)
poz_ultimul = smax.index(suma_max)
poz_primul = poz_ultimul
while L[poz_primul]!=smax[poz_primul]:
    poz_primul_=1
print(poz_primul,poz_ultimul)

with open("../PA/date.out", "w")as g:
    g.write(f'Suma este{suma_max}\n')
    g.write(" ".join([str(x) for x in L[poz_primul:poz_ultimul]]))