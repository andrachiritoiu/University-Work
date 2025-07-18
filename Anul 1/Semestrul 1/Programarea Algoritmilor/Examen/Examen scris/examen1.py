 #1
#  def litere(*cuvinte):
#     d={}
#     for i in cuvinte:
#         d2={}
#         for lit in i:
#             d2[lit]=d2.get(lit,0)+1
#         d[i]=d2
#     return d
#
# print(litere("test","programare"))
# #b)
# numere=[x for x in range(10,100) if x%2==0 and x%6!=0]
# print(numere)
# #c)
# T(n)=2T(n/2)+O(n^2)

#REZOLVARE
 #1
 #a
# def litere(*cuvinte):
#     d={}
#     for cuv in cuvinte:
#         d1 = {}
#         for l in cuv:
#             if l not in d1:
#                 d1[l]=1
#             else:
#                 d1[l]+=1
#             d[cuv]=d1
#     return d
#
#
# print(litere("teste","programare"))

#2-greedy
# A=[3,-2,5,-1,4]
# B=[7,8,-5,2,-4,-1,5]
#
# #var1
# A.sort()
# # print(A)
# # #var2
# # A=sorted(A)
#
# B.sort()
# i=0
# m=len(A)
# n=len(B)
# s=0
# while i<m and A[i]<0:
#     s+=A[i]*B[i]
#     i+=1
# #var1
# # j=-(m-i)
# # while i<m:
# #     s+=A[i]*B[j]
# #     i+=1
# #     j+=1
# # print(s)
#
# #var2
# j=n-i-1
# while j<n:
#     s += A[i] * B[j]
#     i+=1
#     j+=1
#
# print(s)

#3-pd
# f=open("date.in")
# n=int(f.readline())
# lmax=[0]*n
# prev=[-1]*n
# for linie in f:
#     cuvinte =linie.strip().split()
# for i in range(1,n):
#     for j in range(i):
#         if ord(cuvinte[i][0]) == ord(cuvinte[j][-1])+1 or ord(cuvinte[i][0])==ord(cuvinte[j][-1])-1:
#             if lmax[i]<lmax[i]+lmax[j]:
#                 lmax[i]=lmax[j]+1
#                 prev[i]=j
#             else:
#                 prev[i]=j
#
# print(lmax)
# print(prev)

# sol=[]
# for cuv in cuvinte:
#     if cuv not in sol:
#         print(cuv, end=" ")

#4
#a
# s=4
# nrf=4
# nrb=3
# def bkt(k):
#     global count
#     for i in range(sol[k-1]+1, nrf+nrb+1):
#         sol[k] = i
#         if (k<=s//2 and sol[k]<= nrf) or (k>s//2 and sol[k]>nrf):
#             if k==s:
#                 if sol[1]==1 and sol[s//2+1]==nrf+1:
#                     count +=1
#                     print(sol[1:])
#                 else:
#                     bkt(k+1)
#
# count=0
# sol=[0]*(s+1)
# bkt(1)
# print(count)

#b
# import math
# print(math.floor(-3.5))

#Backtracking