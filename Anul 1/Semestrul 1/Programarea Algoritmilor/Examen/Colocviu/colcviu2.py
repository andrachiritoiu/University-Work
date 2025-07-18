#1
# f=open("date.in")
# g=open("date.out","w")
# nr_litere=0
# d={}
# for linie in f:
#     for litera in linie.strip():
#         if litera not in " ,.:!?":
#             litera=litera.lower()
#             nr_litere+=1
#             if litera not in d:
#                 d[litera]=1
#             else:
#                 d[litera]+=1
# d={cheie:valoare for cheie,valoare in sorted(d.items(),key=lambda x:x[1],reverse=True)}
# for cheie in d:
#     g.write(f'{cheie}: {d[cheie]/nr_litere: .3f} \n')
# f.close()
# g.close()

#2
#a
# def citire_matrice(numefis):
#     M=[]
#     with open(numefis) as f:
#         for linie in f:
#             L=[int(x) for x in linie.split()]
#             M.append(L)
#     return M
#
# M=citire_matrice("date.in")
#print(M)

#b
#x si y au valoarea implicita 0
# def functie(M,ch,x=0,y=0):
#     if ch=='c':
#         #interschimbare coloana x cu y
#         for i in range(len(M[0])):
#             aux=M[i][x]
#             M[i][x]=M[i][y]
#             M[i][y]=aux
#     elif ch=='d':
#         #interschimba elementele de pe DP cu DS
#         for i in range(len(M[0])):
#             n=len(M[0])-1
#             aux=M[i][i]
#             M[i][i]=M[i][n-i]
#             M[i][n-i]=aux
#     return M


# M=functie(M,'c',1,2)
# M=functie(M,'d')
#
# for i in range(len(M[0])):
#     print(*M[i])

#c
# for i in range(len(M[0])//2):
#     x=i
#     y=len(M[0])-i-1
#     M=functie(M,'c',x,y)
# M=functie(M,'d')
#
# for i in range(len(M[0])):
#     print(*M[i])
#
# print()
#
# for i in range(len(M[0])):
#     if i%2==0:
#         for j in range(len(M[0])):
#             print(M[i][j],end=" ")
#     else:
#         for j in range(len(M[0])-1,-1,-1):
#             print(M[i][j], end=" ")


#3
#a
f=open("date.in")
d={}
for linie in f:
    c1,c2,culoare,et=linie.strip().split(maxsplit=3)
    c1=tuple(int(x) for x in c1.strip('[]').split(","))
    c2=tuple(int(x) for x in c2.strip('[]').split(","))
    d[(c1,c2)]=[culoare,et]
print(d)
f.close()

#b
def insereaza_legatura(d,t1,t2,cl,et):
    if (t1,t2) in d:
        return False
    else:
        d[(t1,t2)]=[cl,et]
        return True

print(insereaza_legatura(d,(1,3),(2,7),'negru','legatura noua'))
print(d)

#c
def vecini(d,*t):
    L=set()
    for tuplu in  t:
        v=set()
        for cheie in d.keys():
            if tuplu in cheie:
                v.update(cheie)
        if L==set():
            L.update(v)
        else:
            L = L.intersection(v)
    L = L.difference(t)
    return L

print(vecini(d,(2,7),(1,2)))
#vecini(d,(2,7),(1,2))