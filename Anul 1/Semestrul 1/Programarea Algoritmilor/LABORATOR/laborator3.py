# Laborator 3
# https://docs.google.com/document/d/1a0Mtr6Zt5TV30k5E0niEIJv8S_9VY81QDRBv9uLDRxg/edit?usp=sharing

# # Problema 2
#
# s = input('cuvant= ')
# i = 0
# while len(s) - 2 * i > 0:
#     print(s[i:len(s) - i].center(len(s), '*'))
#     i += 1


# Problema 3

# # rezolvare cu find()
# s = "abccabcababcc"
# t = "abc"
# poz = s.find(t)
# if poz == -1:
#     print(f"Subsirul '{t}' nu apare deloc in sirul \"{s}\" ")
# else:
#     while poz != -1:
#         print(poz,end=", ")
#         poz = s.find(t,poz + len(t))

# #rezolvare cu index()
# s = "abccabcababcc"
# t = "abcd"
# poz = -len(t)
# gasit = False
# while True:
#     try:
#         poz = s.index(t, poz + len(t))
#         print(poz, end=", ")
#         gasit = True
#     except ValueError:
#         print("Gata cautarea")
#         break
# if not gasit:
#     print(f"Subsirul '{t}' nu apare deloc in sirul \"{s}\" ")


# ## Problema 4
# prop = "Problemele cu siruri de caracteger nu sunt ggerle!"
# t = "ger"
# s = "re"
#
# # a)
# prop2 = prop.replace(t, s)
# print(prop2)
#
# #b)
# nr_inlocuiri = int(input('nr_inlocuiri = '))
# nr_aparitii = prop.count(t)
# prop3 = prop.replace(t, s, nr_inlocuiri)
# print(prop3)
# if nr_aparitii <= nr_inlocuiri:
#     print('Toate greselile au fost corectate.')
# else:
#     print(f'Sirul "{prop}" contine prea multe greseli. Au fost corectate primele {nr_inlocuiri}')


## Problema 5
## punctul a)
# prop = "Mancare Ana are mere si mancare sau are"
# s = "are"
# t = "VREA"
#
# poz = prop.find(s)
# while poz != -1:
#     if (poz == 0 or prop[poz-1]==" ") \
#         and (poz+len(s)==len(prop) or prop[poz+len(s)]==" "):
#         prop = prop[:poz] + t + prop[poz+len(s):]
#         poz = prop.find(s,poz+len(t))
#     else:
#         poz = prop.find(s, poz + len(s))
# print(prop)

# #punctul b
# prop = "Mancare Ana, ;are. mere si mancare sau ?are,"
# s = "are"
# t = "VREA"
# poz = prop.find(s)
# while poz != -1:
#     if (poz == 0 or prop[poz-1] in " ,.?:;!") \
#         and (poz+len(s)==len(prop) or prop[poz+len(s)] in " ,.?:;!"):
#         prop = prop[:poz] + t + prop[poz+len(s):]
#         poz = prop.find(s,poz+len(t))
#     else:
#         poz = prop.find(s, poz + len(s))
# print(prop)



# ## Problema 6
# print(ord("A"))
# print(chr(65))
#
# for x in text:
#     if x.isalpha():
#         if x.isupper():
#             pass
#         elif x.islower():
#             pass
#
#
# ## Problema 7
# for x in text:
#     if x in "aeiouAEIOU":
#         pass
#
# # apa => apapapa => ApA
#
# ## Problema 8
# L_cuv = prop.split()
# for cuv in L_cuv:
#     if cuv.isdigit():
#         pass

#REZOLVARE
#2
# s=input("s=")
# for i in range(len(s)//2+len(s)%2):
#     print(s[i:len(s)-i].center(10))

#3
# s=input("s=")
# t=input("t=")
s='𝑎𝑏𝑐𝑐𝑎𝑏𝑐𝑎𝑏𝑎𝑏𝑐𝑐'
t='d'

#cu find
# ok=1
# p=0
# gasit=0
# while ok==1:
#     verif=s.find(t,p)
#     if verif==-1:
#         ok=0
#     else:
#         gasit=1
#         print(verif,end=" ")
#         p=verif+1
# if(gasit==0):
#     print("nu exista")

#cu index
# p=0
# ok=0
# try:
#     while True:
#         verif=s.index(t,p)
#         print(verif)
#         p=verif+1
#         ok=1
# except ValueError:
#     if ok==0:
#         print("nu exista")

#4
# #a
# prop= "Problemele cu siruri de caracteger nu sunt ggerle!"
# s="re"
# t="ger"
# print(prop.replace(t,s))
#
# #b
# p=int(input("p="))
# nr_greseli=prop.count(t)
# if p<nr_greseli:
#     print(f"textul contine prea multe greseli, doar {p} au fost corectate")
# print(prop.replace(t,s,count=p))

#5
#a
# prop= "Problemele cu multe, sirurimulte! de caracteger nu sunt ggerle?, dar sunt multe:"
# s="multe"
# t="putine"
# ok=1
# p=0
# gasit=0

# while ok==1:
#     verif=prop.find(s,p)
#     if verif==-1:
#         ok=0
#     else:
#         if (verif==0 and prop[len(s)]==" ") or (verif+len(s)==len(prop) and prop[verif-1]==" ") or (prop[verif-1]==" " and prop[verif+len(s)]==" "):
#             prop=prop[:verif]+ t +prop[verif+len(s):]
#             gasit = 1
#         p = verif + 1

#b
# semne=" ,.!:?"
# while ok==1:
#     verif=prop.find(s,p)
#     if verif==-1:
#         ok=0
#     else:
#         if (verif==0 and prop[len(s)] in semne) or (verif+len(s)==len(prop) and prop[verif-1] in semne) or (prop[verif-1] in semne and prop[verif+len(s)] in semne):
#             prop=prop[:verif]+ t +prop[verif+len(s):]
#             gasit = 1
#         p = verif + 1
# if(gasit==0):
#     print("nu exista")
# else:
#     print(prop)

#6-cifrul cezar
#a
s="O zi frumoasa!"
k=9
# nou=""
# for i in range(len(s)):
#     if s[i].isalpha():
#         if s[i].isupper():
#             offset=65
#         else:
#             offset=97
#         nou+=chr((ord(s[i])+k-offset)%26+offset)
#     else:
#         nou+=s[i]
# print(nou)

#b
# s="X ir oadvxjbj!"
# k=9
# nou=""
# for i in range(len(s)):
#     if s[i].isalpha():
#         if s[i].isupper():
#             offset=65
#         else:
#             offset=97
#         nou+=chr((ord(s[i])-k-offset)%26+offset)
#     else:
#         nou+=s[i]
# print(nou)

#7
# s="Ana are mere."
# nou=""
# for i in range(len(s)):
#     if s[i] in "aeiouAEIOU":
#         nou+=s[i]+'p'+s[i].lower()
#     else:
#         nou+=s[i]
# print(nou)


# s="Apanapa aparepe meperepe."
# nou=""
# i=0
# while i < len(s):
#     nou += s[i]
#     if s[i] in "aeiouAEIOU":
#         i+=3
#     else:
#         i+=1
# print(nou)

#8
prop="Astazi am cumparat paine de 5 RON, pe lapte am dat 10 RON, iar de 15 RON am cumparat niste cascaval. De asemenea, mi-am cumparat si niste papuci cu 50 RON!".split()
sum=0
for i in range(len(prop)):
    if prop[i].isdigit():
        sum+=int(prop[i])
print(sum)


s="ana are mere si pere"
print(s[::-1]) #invers

#9-15