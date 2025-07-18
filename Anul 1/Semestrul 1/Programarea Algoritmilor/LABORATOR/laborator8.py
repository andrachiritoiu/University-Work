## Laborator 8
# https://docs.google.com/document/d/10F4Jrrd0Gg2E-B_7q3OSeRF5rOPEHWY6hNXPiWrCErw/edit?usp=sharing

# s = input()
# # tabel = str.maketrans(".,;:","    ")#!!!metoda statica
# separatori = ".,:;!?"
# tabel = str.maketrans(separatori, " "*len(separatori))
#
# print(tabel,type(tabel)) # dictionar de coduri ascii
# s=s.translate(tabel)
# print(s)


# s = input()
# vocale = "aeiou"
# vocale1 = "".join([chr(ord(x) + 1) for x in vocale])  # sirul facut din cod
# print(vocale1)
# # tabel="".maketrans("aeiou","bfjpv")
# # tabel = "".maketrans(vocale, vocale1)
#
# tabel="".maketrans(vocale,vocale1,",.;:")
# # tabel="".maketrans("","",",.;:")
# print(tabel)
# s = s.translate(tabel)
# print(s)


# s = input()
# d = {"1": "unu", "2": "doi", "3": "trei", "4": "patru"}  # dictio!!CHEIE CARACTER
# tabel = str.maketrans(d)
# print(tabel)
# s = s.translate(tabel)
# print(s)

###########################
# import re
# print(re.search(r"gr[ee]n", "green"))

# import re
#
# p = "Astazi Ana a fost la piata. A luat de 30 lei Afine, de 20 lei alune si la ora 15 a plecat acasa"

# # split - dupa o multime de separatori
# ls = re.split("[., ;]", p)
# print(ls)
#
# # split - dupa o combinatie de separatori dintr-o multime
# ls = re.split("[., ;]+", p)
# print(ls)

# # spit dupa o combinatie de separatori - orice caracter care nu e cifra este separator
# ls = re.split(r"\D+", p)
# print(ls)
#
# # split sa pastram doar numerele - orice numar este separator+ separatorii uzuali
# ls = re.split(r"[\d., ;]+", p)
# print(ls)
#
# # Inlocuirie
# # inolcuim cuvantul s cu cuvantul t - trebuie sa cautam s incadrat de delimitatori
# s = "lei"
# t = "RON"
#
# p = "Astazi Ana a fost la piata. A luat de 30 lei Afine, de 20 lei alune, de 10 lei clei si la ora 15 a plecat acasa"
# ls = re.sub(f"\\b{s}\\b", t, p)
# print(ls)
# #
# print()
#
# # inlocuiesc doar cele la care pretul se termina cu 0
# p = "Astazi Ana a fost la piata. A luat de 30 lei Afine, de 26 lei alune, de 10 lei clei si la ora 15 a plecat acasa"
# s = "lei"
# t = "RON"
# ls = re.sub(f"(?<=0 ){s}", t, p)
# print(ls)
#
# # cuvintele care incep cu litera A ,a
# print("incep cu a", re.findall(r"\b[Aa]\w+", p))
#
## caut numerele dintr-un text pentru a le face suma
# print(re.findall(r"\d+", p))
#
# # caut doar numerele care continua cu "  lei" pentru a face suma
# print(re.findall(r"\d+(?= lei)", p))
#
# # caut sirurile binare din text
# s = '00un sir 000112are ultimul bit gresit00 110'
# print(re.findall("[0-1]+", s))
#
# # caut sirurile binare din text de lungime minim 3
# s = '00un sir 000112are ultimul bit gresit00 110 1000'
# print(re.findall("[0-1]{3,}", s))
#
# # match- caut un tipar de la inceputul sirului
# # exemplu- detectarea datei dintr-un text de forma de forma Nume eveniment -  data: detalii eveniment
# s = "Vacanta de iarna - 25.12.2024: lucrez la PA"
# m = re.match(r'([a-zA-Z\s]+) - ([0-9]{2}.[0-9]{2}.[0-9]{4}):', s)
# m = re.match(r'([a-zA-Z\s]+) - ([0-9]{2}\.[0-9]{2}\.[0-9]{4}):', s)
# print(m)
# print(m.group(1))
# print(m.group(2))
# print(m.start(), m.end(), sep="\n")
#
# f = re.findall("[0-9]{2}.[0-9]{2}.[0-9]{4}", s)  # nu stim ce este in rest in text
# print(f)
#
# # translate cu dictionar
# s = "sa.. inlocuim. separatori, doar .,"
# sr = s.translate(str.maketrans(".,", "  "))
# print(sr)
# d = {"a": "apa", "o": "opo"}
# sr = s.translate(str.maketrans(d))
# print(sr)


####################################

"""
Sa verificam daca o parola e 
a) puternica: daca contine cel putin o litera mica, 
cel putin o litera mare, cel putin o cifra, cel putin un 
simbol special (fara spatii), are lungimea minim 10 caractere
b) medie: daca contine cel putin o litera mica, una mare, 
o cifra, are lungimea intre 6 si 9 caractere
c) slaba: daca are doar litere mici sau doar mari sau doar cifre, 
iar lungimea este maxim 5
"""

#def parola(sir):
    # ## c) slaba: daca are doar litere mici sau doar mari
    # ## sau doar cifre, iar lungimea este maxim 5
    #
    # a = re.search(r"^[a-z]{1,5}$", sir)
    # A = re.search(r"^[A-Z]{1,5}$", sir)
    # c = re.search(r"^[0-9]{1,5}$", sir)
    # print(a, A, c, sep="\n")
    # if a or A or c:
    #     print(f"parola {sir} este slaba!")

    ## b) medie: daca contine cel putin o litera mica, una mare,
    ## o cifra, are lungimea intre 6 si 9 caractere
#     a = re.search(r"[a-z]", sir)
#     A = re.search(r"[A-Z]", sir)
#     c = re.search(r"[0-9]", sir)
#     d = re.search(r"^[a-zA-Z0-9]{6,9}$", sir)
#     print(a, A, c, d, sep="\n")
#     if a and A and c and d:
#         print(f"parola {sir} este medie!")
#
#
# parola("09aAadd")
