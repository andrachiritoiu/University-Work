### Laborator 1
# https://docs.google.com/document/d/1wCK2Vu7Ny4js_ahzIdDdL9UL-g9gwegY/edit?usp=sharing&ouid=103396152483260729031&rtpof=true&sd=true
# # Problema 1
#from bisect import bisect

# x = int(input('x = '))
# y = int(input('y = '))
# suma = x + y
# prod = x*y
# print(suma, prod)
# print(suma, prod, sep = ',')

# print(suma, prod, sep = '\n')

# print(f'suma numerelor {x} si {y} este {x + y}, iar produsul este {x*y}')
# print('suma numerelor {x} si {y} este {x + y}, iar produsul este {x*y}')


# ###############
# # Problema 2

# a, b, c = input('introduceti 3 numere: ').split()
# #print(a, b, c)
# #print(type(a))
# a, b, c =int(a), int(b), int(c)

# if 0<=a<24 and 0<=b<60 and 0<=c<60:
#     print(f'{a:02d}:{b:02d}:{c:02d}')
# else:
#     print("Date invalide")


# #########################
# # Problema 3
# z = int(input("zi = "))
# l = int(input("luna = "))
# a = int(input("an = "))
# ok = True

# if l in [1, 3, 5, 7, 8, 10, 12]:
#     #31 de zile
#     if 1<=z<31:
#         z+=1
#     elif z == 31:
#         z=1
#         if l == 12:
#             l = 1
#             a+=1
#         else:
#             l+=1
#     else:
#         ok = False

# elif l in [4, 6, 9, 11]:
#     #30 de zile
#     if 1<=z<30:
#         z+=1
#     elif z == 30:
#         z=1
#         l+=1
#     else:
#         ok = False

# elif l == 2:
#     #februarie
#     if a%4==0 and a%100!=0 or a%400==0:
#         #an bisect 29 de zile
#         if 1<=z<29:
#             z+=1
#         elif z == 29:
#             z=1
#             l+=1
#         else:
#             ok = False
#     else:
#         #anul nu e bisect 28 de zile
#         if 1<=z<28:
#             z+=1
#         elif z == 28:
#             z=1
#             l+=1
#         else:
#             ok = False
# else:
#     ok = False

# if ok == False:
#     print("Date incorecte")
# else:
#     print(f"{z:02d}.{l:02d}.{a:04d}")


# nr = 34.2327325436
# print(f"{nr:.3f}")




#REZOLVARE
#1
# a=int(input("a="))
# b=int(input("b="))
#
# a,b=(input("numerle sunt pe aceasi linie").split())
# a,b=int(a),int(b)
#
# print(f'suma numerelor {a} si {b} este {a+b}, iar produsul este {a*b}')

#2
# a=int(input("a="))
# b=int(input("b="))
# c=int(input("c="))
# # if a>=0 and a<24 and b>=0 and b<60 and c>=0 and c<60:
# if 0<=a<24 and 0<=b<60 and 0<=c<60:
#     print(f'{a:02d}:{b:02d}:{c:02d}')
# else:
#     print("date gresite")

#3
# z=int(input("z="))
# l=int(input("l="))
# a=int(input("a="))
# ok=1
#
# if l in [1,3,5,7,8,10,12]:
#     if 1<=z<31:
#         z+=1
#     elif z==31:
#         if l==12:
#             z=1
#             l=1
#             a+=1
#         else:
#             z=1
#             l+=1
#     else:
#         ok=0
# elif l in [2,4,6,9,11]:
#     if a%4==0 and a%100!=0:
#         #an bisect
#         if z==28 and l==2:
#             l+=1
#             z=1
#         elif 1 <= z < 30:
#             z += 1
#         elif z == 30:
#             if l == 12:
#                 z = 1
#                 l = 1
#                 a += 1
#             else:
#                 z = 1
#                 l += 1
#         else:
#             ok = 0
#     else:
#         if z==29 and l==2:
#             l+=1
#             z=1
#         elif 1<=z<30:
#             z+=1
#         elif z==30:
#             if l==12:
#                 z=1
#                 l=1
#                 a+=1
#             else:
#                 z=1
#                 l+=1
#         else:
#             ok=0
# else:
#     ok=0
# if ok!=0:
#     print(f'{z}.{l}.{a}')
# else:
#     print("nu exista")


#4
# x=int(input("x="))
# op=input("op=")
# y=int(input("y="))
# ok=1
#
# if op=='+':
#     r=x+y
# elif op=='-':
#     r=x-y
# elif op=='*':
#     r=x*y
# elif op=='/':
#     r=x/y
# else:
#     ok=0
#
# if(ok==0):
#     print("nu exista")
# else:
#     print(f'{x}{op}{y}={r:.3f}')

#5
# a=int(input("a="))
# b=int(input("b="))
# c=float(input("c="))
# d=float(input("d="))
# c1=input("c1=")
# c2=input("c2=")
# print(a,b, c, d, c1, c2)
# print(a, c, c1, b, d, c2)
# print(a, b, c, d, c1, c2, sep='\n')
#
# #var1
# print(a,b)
# print(c,d)
# print(c1,c2)
#
# #var2
# for i in range(4,2):
#     print(*[a, b, c, d, c1, c2][i:i+2], end='\n')
#
# # Crează o listă cu elementele
# # elements = [a, b, c, d, c1, c2]
# #  Parcurge lista și afișează câte două elemente pe linie
# # for i in range(0, len(elements), 2):
# #     print(*elements[i:i+2], end='\n')

#6
# n=int(input("n="))
# max=0
# zo1=0
# zi2=0
# x=float(input("x="))
# for i in range(2,n+1):
#     y=float(input("y="))
#     if abs(y-x)>max:
#         max=abs(y-x)
#         zi1=i-1
#         zi2=i
#     x=y
# print(f'Cea mai mare crestere a avut loc intre zilele {zi1} si {zi2} si este de {max:.2f}')

#7
# s=int(input("s="))
# sum=0
# zi=0
# while sum<s:
#     x=int(input("azi gigel a  adaugat "))
#     sum+=x
#     zi+=1
# print(f'gigel si-a luat jucaria dupa {zi} zile , suma medie zilnica a fost de {sum/zi:.3f} si a ramas cu {sum-s} lei')

#8
# a=int(input("a="))
# b=int(input("b="))
# c=int(input("c="))
# min=a
# max=a
# if b<min and b<c:
#     min=b
# elif c<min and c<b:
#     min=c
#
# if b>max and b>c:
#     max=b
# elif c>max and c>b:
#     max=c
# print(f'{max-min}')

#9
# a,b,c=input("numerele sunt:").split()
# a,b,c=int(a), int(b), int(c)
# L=[a,b,c]
L=[(int(input("x=")))for i in range (3)]
print(L)
L.sort()
print(L)



