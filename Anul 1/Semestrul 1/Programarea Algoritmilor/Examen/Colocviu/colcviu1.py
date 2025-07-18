# #1
# #a
# def citire_matrice(nume_fisier):
#     with open(nume_fisier,"r") as f:
#         L=[[int(x) for x in f.readline().split()]]
#         nr=len(L[0])
#         for linie in f:
#             aux=[int(x) for x in linie.split()]
#             if len(aux)!=nr:
#                 return None
#             else:
#                 L.append(aux)
#     return L
#
# L=[]
# L=citire_matrice("punctaje.in")
# print(L)
#
# #b
# def multimi(L,*index):
#     n = set()
#     p=set()
#     for i in index:
#         cn=set()
#         for x in L[i]:
#             if x<0:
#                 cn.add(x)
#             elif str(x)[0]==str(x)[-1]:
#                 p.add(x)
#         if n==set():
#             n.update(cn)
#         else:
#            n=n.intersection(cn)
#     return n,p
#
# print(multimi(L, 0,1,2,3))
#
# #c
# L=citire_matrice("punctaje.in")
# #print(*(multimi(L,len(L)-3,len(L)-2,len(L)-1))[1])
# p=list((multimi(L,len(L)-3,len(L)-2,len(L)-1))[1])
# #print(len(multimi(L,0,3)[0]))
# # print(*(sorted(p)))
# print(len(multimi(L,0,len(L)-1)[0]))

#2
#a
# def modifica_prefix(x,y,prop):
#     nr=0
#     L=[cuv for cuv in prop.split()]
#     l=len(x)
#     for i in range(len(L)):
#         if L[i][:l]==x:
#             #if L[i].startwith(x):
#             L[i]=y+L[i][l:]
#               #L[i]=L[i].replace(x,y,1)
#             nr+=1
#     prop=" ".join(L)
#     return nr, prop
#
# f=open("date.in")
# prop=f.readline()
# print(modifica_prefix("cea","ca",prop))
# f.close()
#
# #b
# def poz_max(L2):
#     maxi=0
#     L=[]
#     for i in range(len(L2)):
#         if L2[i]>maxi:
#             maxi=L2[i]
#     for i in range(len(L2)):
#         if L2[i]==maxi:
#             L.append(i+1)
#     return L
#
# L2=[2,5,8,6,8,1,8,2,2,8,8,1,5]
# print(*(poz_max(L2)))
#
# #c
# f=open("spectacole.in","r")
# l=f.readlines()
# g=open("propozitii_modificate.out","w")
# a=input("a=")
# b=input("b=")
# for linie in l:
#     g.write((modifica_prefix(a,b,linie))[1]+"\n")
#
# i=1
# num=[]
# for linie in l:
#     n,prop=(modifica_prefix(a,b,linie))
#     # if n>maxi:
#     #     maxi=n
#     #     num=[i]
#     # elif n==maxi:
#     #     num+=[i]
#     # i+=1
#     num+=[n]
# print(*poz_max(num))
#
#
# f.close()
# g.close()

#3
#a
f=open("date.in")
m,n=f.readline().split()
m,n=int(m),int(n)
d={}
for i in range(m):
    c,num,p=f.readline().split()
    c=int(c)
    d[c]=[num]
    d[c]+=[p]
for i in range(n):
    ca,cc,an,nrpag,nume=f.readline().strip().split(" ",4)
    ca,cc,an,nrpag=int(ca),int(cc),int(an),int(nrpag)
    d[ca]+=[[cc,an,nrpag,nume]]

print(d)
print()

#b
# def sterge_carte(d,cod):
#     for key,valoare in d.items():
#         for list in valoare[2:]:
#             if list[0]==cod:
#                 valoare.remove(list)
#     return d
# print(sterge_carte(d,141))

#c
def carti_autor(d,codautor):
    L=[]
    if codautor not in d:
        return L
    else:
        for i in d[codautor][2:]:
            t=(i[3], i[1], i[2])
            L.append(t)
        L=sorted(L,key=lambda t:(t[1],-t[2],str(t[0])))
        return d[codautor][0],d[codautor][1],L

nume,prenume,list=carti_autor(d,11)
print(nume,prenume)
for carte in list:
    print(*carte)
#print(*list,sep='\n')