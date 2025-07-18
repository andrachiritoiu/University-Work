# Laborator 12
# https://docs.google.com/document/d/1UgutziWtCzsMEtXEivaTKE8iufL418XwD45s_wGDnNs/edit?usp=sharing

# #problema 1
# def completare(M, i, j, d):
#     global k
#     if d==1:
#         M[i][j] = k
#         k+=1
#         return
#     completare (M, i , j+d//2,d//2)
#     completare(M, i+ d//2, j,d//2)
#     completare(M, i, j, d//2)
#     completare(M, i+d//2, j+d//2, d//2)
#
# N=int(input("Introduceti dimensiunea: "))
# M=[[0]* 2**N for _ in range(2**N)]
#
# k=1
# completare(M,0,0, 2**N)
# dim_max=len(str(2**N * 2**N))
#
# for linie in M:
#     for elem in linie:
#         print(str(elem).rjust(dim_max), end=' ')
#     print()
#
#


#3-problema din seminar 6
# def citire():
#     f=open("spectacole.in")
#     st,jos = [ int (x) for x in f.readline().split()]
#     dr,sus=[int(x) for x in f.readline().split()]
#     L_copaci= [ tuple([int(x) for x in linie.split()])
#                 for linie in f]
#     dreptunghi=(st, jos,dr,sus)
#     f.close()
#     return dreptunghi, L_copaci
#
# def dr_max(st, jos, dr , sus, L_copaci):
#     for x,y  in L_copaci:
#         if st<x<dr and jos<y<sus:
#             #taiere pe orizontala => jos, sus
#             aria1,dr1= dr_max(st, jos,dr, y,L_copaci)
#             aria2, dr2 = dr_max(st,y, dr, sus,L_copaci)
#
#             #taierea pe verticala =>stanga,dreapta
#             aria3, dr3 = dr_max(st, jos, x, sus,L_copaci)
#             aria4, dr4 = dr_max(x, jos, dr, sus,L_copaci)
#
#             aria, dreptunghi = max([(aria1,dr1), (aria2,dr2), (aria3,dr3),(aria4,dr4)])
#             break
#         else:
#             aria=(dr-st)*(sus-jos)
#             dreptunghi=(st,jos,dr,sus)
#     else:
#         #daca nu am trecut niciun break
#         aria = (dr-st)*(sus-jos)
#         dreptunghi = (st, jos, dr, sus)
#     return aria, dreptunghi
#
# D,copaci=citire()
# print(dr_max(*D, copaci))

#6-curs 11
import random

def quickselect(A, k, f_pivot=random.choice):
    pivot = f_pivot(A)

    L = [x for x in A if x<pivot]
    E = [x for x in A if x == pivot]
    G = [x for x in A if x>pivot]

    if k < len(L):
        quickselect(L,k,f_pivot)
    if k < len(L)+len(E):
        return E[0]
    return quickselect(G, k-len(L)-len(E), f_pivot)

A=[10,7,25,4,3,4,9,12,7]
k=5
print(quickselect(A, k-1))

def mediana(A):
    if len(A)<=5:
        return sorted(A)[len(A)//2]
    rest=len(A)%5
    grupuri=[sorted(A[i:i+5])for i in range(0,len(A)-rest,5)]
    mediane=[grup[2] for grup in grupuri]
    return mediana(mediane)

print(mediana(A))