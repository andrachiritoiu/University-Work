# Laborator 2
# https://docs.google.com/document/d/1mLMT0GV-k1mkHyDnn1rPTAadoa6Qc0DtWCD1d7NEJ-s/edit?usp=drive_link
# # Problema 1

# n = int(input("n= "))
# ogl = 0
# cn = n
# while n:
#     ogl = ogl*10 + n%10
#     n //= 10
# if cn == ogl:
#     print(f'{cn} este palindrom')
# else:
#     print(f'{cn} nu este palindrom')


# Problema 2

# L1, L2 = input("Introduceti dimensiunile:").split()
# L1, L2 = int(L1), int(L2)
# aux1, aux2 = L1, L2
# while aux2:
#     r = aux1 % aux2
#     aux1 = aux2
#     aux2 = r
# print(f"Folosim { L1 * L2 // (aux1 * aux1) } placi patrate de latura {aux1} cm")


# # Problema 3
# a, b = input('Introduceti doua numere: ').split()
# a, b = int(a), int(b)
# f1, f2 = 0, 1
# f3 = 0
# while f3 < a:
#     f3 = f1 + f2
#     f1 = f2
#     f2 = f3
# if f3 <= b:
#     print(f'Cel mai mic numar Fibonacci din intervalul [{a}, {b}] este {f3}')
# else:
#     print(f'Nu exista niciun numar Fibonacci in intervalul [{a}, {b}].')


# # Problema 4
# a,b = input("Introduceti capetele: ").split()
# a,b = int(a),int(b)
# for x in range(0,100,5):
#     if a<=x<=b:
#         continue
#     print(x, end=" ")
# print()
# for x in range(95,-1,-5):
#     if not a<=x<=b:
#         print(x, end=" ")


# # Problema 5
# n=int(input("n= "))
# for x in range(1, n+1):
#     for y in range(1, x+1):
#         print(y, end=" ")
#     print()


# # Problema 10
# n = int(input('Introduceti numarul de studenti: '))
# a, b = input('Primul interval: ').split()
# a, b = int(a), int(b)
# for _ in range(n - 1):
#     a2, b2 = input('Alt interval: ').split()
#     a2, b2 = int(a2), int(b2)
#     a, b = max(a, a2), min(b, b2)
#     if a >= b:
#         print('Studentii nu sunt toti simultan prezenti.')
#         break
# else:
#     print(f'Studentii sunt toti simultan prezenti in intervalul [{a}, {b}].')


#REZOLVARE
#1
# n=int(input("n="))
# c=n
# ogl=0
# while n>0:
#     ogl=ogl*10+n%10
#     n=n//10
# if c==ogl:
#     print("da")
# else:
#     print("nu")

#2
# L1=int(input("L1="))
# L2=int(input("L2="))
# A=L1*L2
#
# while L1!=L2:
#     if L1>L2:
#         L1-=L2
#     else:
#         L2-=L1
#
# Ap=L1*L1
# print(f'numarul de placi minim este {A//Ap} si acestea au latura de {L1} cm')

#3
# a=int(input("a="))
# b=int(input("b="))
# # if a>b:
# #     a,b=b,a
# f1=1
# f2=1
# f3=0
# while f3<a:
#     f3=f1+f2
#     f1=f2
#     f2=f3
# if a<=f3<=b:
#     print(f3)
# else:
#     print("nu exista")

#4
# a=int(input("a="))
# b=int(input("b="))
# for i in range (0,100,5):
#     if a<=i<=b:
#         continue
#     else:
#         print(i,end=" ")

#5
# n=int(input("n="))
# for i in range (1,n+1):
#     for j in range (1,i+1):
#         print (j, end=" ")
#     print()

#6
# n=int(input("n="))
# L=[]
# while n>0:
#     L+=[n%10]
#     n=n//10
# L.sort()
# nr0=0
# min=-1
# for i in range(len(L)):
#     if L[i]==0:
#         nr0+=1
#     elif min==-1:
#         min=L[i]
# nrm=0
# if nr0!=0:
#     nrm=min
#     p=1
#     for i in range(nr0):
#         p*=10
#     nrm=nrm*p
#     for i in range(nr0+1,len(L)):
#         nrm=nrm*10+L[i]
# else:
#     for i in range(len(L)):
#         nrm=nrm*10+L[i]
#
# nrmax=0
# for i in range(len(L)-1,-1,-1):
#         nrmax = nrmax * 10 + L[i]
#
#
# print(nrm)
# print(nrmax)

#7
# n=int(input("n="))
# x=int(input("x="))
# min=x
# ap=1
# for i in range (1,n):
#     x=int(input("x="))
#     if x<min:
#         min=x
#         ap=1
#     elif x==min:
#         ap+=1
# print(f'nr min este {min} si a aparut de {ap} ori')

#8
# n=int(input("n="))
# max1=0
# max2=0
# for i in range(n):
#     x=int(input("x="))
#     if x>max1:
#         max2=max1
#         max1=x
#     elif x>max2 and x!=max1:
#         max2=x
# if max1!=max2!=0:
#     print(max2, max1)
# else:
#     print("nu exista")

#9
# a=int(input("a="))
# b=int(input("b="))
# p2=1
# while p2<=b:
#     if p2>=a:
#         print(p2,end=" ")
#     p2=p2*2
#

#10
# n=int(input("n="))
# a=int(input("a="))
# b=int(input("b="))
# maxs=a
# mind=b
# for i in range(1,n):
#     a = int(input("a="))
#     b = int(input("b="))
#     if a>maxs:
#         maxs=a
#     if b<mind:
#         mind=b
# if maxs<mind:
#     print(f'intrvalul este {maxs}:{mind}')
# else:
#     print("nu se poate")

#11
# n=int(input("n="))
# p=0
# v=[]
# for i in range(n):
#     v+=[int(input(f'v[{i}]='))]
# print(v)
#
# i=0
# while i<n-1 and v[i]<=v[i+1]:
#     i+=1
# ok=1
# p=i
# while i<n-1 and ok==1:
#     if v[i]<v[i+1]:
#         ok=0
#     i+=1
# if(ok==0 or p==n-1):
#     print("nu este")
# else:
#     print("este craesta")

#12-cifra de control a lui n
# n=int(input("n="))
# c=n
# while c>10:
#     c = 0
#     while n>0:
#         c+=n%10
#         n=n//10
#     n=c
# print(c)

#13
#var1
# n=int(input("n="))
# a=n
# print(n, end=" ")
# if n%2==1:
#     while a>1:
#         a=(n-1)//2
#         b=a+1
#         print(b,a,end=" ")
#         n=a
# else:
#     while a>1:
#         b=a-1
#         a=n//2
#         print(b,end=" ")
#         if a!=1:
#             print(a, end=" ")
#         n=a

#var2
# n=int(input("n="))
# p=n
# while p>1:
#     print(p,end=" ")
#     if(n%2==1):
#         p=n//2+1
#     else:
#         p=n-1
#     n=p
# print(1)

#14
# n=int(input("n="))
# nr=0
# for i in range(1,n+1):
#     if n%i==0:
#         nr+=1
# print(nr)

#15
# n=int(input("n="))
# max=0
# nr=0
# for i in range(n):
#     nrdiv=0
#     for j in range(1,i+1):
#         if i%j==0:
#             nrdiv+=1
#     if nrdiv>max:
#         max=nrdiv
#         nr=i
# print(nr)

#16
# def verif(n):
#     nrdiv=0
#     for i in range(1,n+1):
#         if n%i==0:
#             nrdiv+=1
#     if(nrdiv==3):
#         return True
#     else:
#         return False
#
# n=int(input("n="))
# print(verif(n))

#17
# a=int(input("a="))
# b=int(input("b="))
# nr=0
# for i in range(1,a+1):
#     if a%i==0 and b%i==0:
#         nr+=1
# print(nr)

#18
# n=int(input("n="))
# p2=0
# p5=0
# for i in range(1,n+1):
#     while(i%2==0):
#         p2+=1
#         i=i//2
#     while (i%5==0):
#         p5+=1
#         i=i//5
# print(p2 if p2<p5 else p5)

#19
def diferite(n):
    c=n%10
    n=n//10
    while n>0:
        if n%10==c:
            return 0
        n=n//10
    return 1

n=int(input("n="))
p=1
for i in range(n):
    p*=10
nr=0
for i in range(p):
    if diferite(i)==1:
        nr+=1
print(nr)


