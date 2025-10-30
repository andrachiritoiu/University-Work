# 1. Daca fac un test si e pozitiv care e probabilitatte asa fiu bolnav

import numpy as np
import matplotlib as mp


#var 1
INCIDENTA = 1 / 1000  # P(I): Probabilitatea de a fi infectat (1 la 1000)
SENSIBILITATE = 0.98  # P(P|I): Probabilitatea ca testul să fie pozitiv dat fiind infectat (Adevărat Pozitiv)
FALS_POZITIV = 0.01  # P(P|N): Probabilitatea ca testul să fie pozitiv dat fiind neinfectat (Fals Pozitiv)


P_N = 1 - INCIDENTA  # P(N): Probabilitatea de a nu fi infectat
P_P_I = SENSIBILITATE  # P(P|I)
P_P_N = FALS_POZITIV  # P(P|N)


# 1) Probabilitatea de a fi infectat după UN TEST POZITIV: P(I|P)

# Pasul 1: Calculul Probabilității Totale de a avea un test pozitiv, P(P)
# P(P) = P(P|I) * P(I) + P(P|N) * P(N)
probabilitate_test_pozitiv = (P_P_I * INCIDENTA) + (P_P_N * P_N)

# Pasul 2: Aplicarea Teoremei lui Bayes
# P(I|P) = [P(P|I) * P(I)] / P(P)
probabilitate_I_dupa_1_test = (P_P_I * INCIDENTA) / probabilitate_test_pozitiv

# 2) Probabilitatea de a fi infectat după DOUĂ TESTE POZITIVE: P(I|P1 ∩ P2)
# Probabilitatea ca AMBELE teste să fie pozitive dat fiind infectat: P(P1 ∩ P2 | I)
P_P1_P2_I = P_P_I * P_P_I

# Probabilitatea ca AMBELE teste să fie pozitive dat fiind neinfectat: P(P1 ∩ P2 | N)
P_P1_P2_N = P_P_N * P_P_N

# Pasul 1: Calculul Probabilității Totale de a avea două teste pozitive, P(P1 ∩ P2)
# P(P1 ∩ P2) = P(P1 ∩ P2 | I) * P(I) + P(P1 ∩ P2 | N) * P(N)
probabilitate_2_teste_pozitive = (P_P1_P2_I * INCIDENTA) + (P_P1_P2_N * P_N)

# Pasul 2: Aplicarea Teoremei lui Bayes
# P(I|P1 ∩ P2) = [P(P1 ∩ P2 | I) * P(I)] / P(P1 ∩ P2)
probabilitate_I_dupa_2_teste = (P_P1_P2_I * INCIDENTA) / probabilitate_2_teste_pozitive

print("1) Probabilitatea de a fi infectat după UN TEST POZITIV:")
print(f"P(I|P) = {probabilitate_I_dupa_1_test:.6f} sau {probabilitate_I_dupa_1_test * 100:.2f}%")

print("2) Probabilitatea de a fi infectat după DOUĂ TESTE POZITIVE:")
print(f"P(I|P1 ∩ P2) = {probabilitate_I_dupa_2_teste:.6f} sau {probabilitate_I_dupa_2_teste * 100:.2f}%")
print()



# var 2
import numpy as np
import matplotlib
matplotlib.use('QtAgg')
counterPozitive = 0
counterPozitive2 = 0
bolnavi_cu_test = 0


for x in range(100000):
    bolnav1 = (np.random.random() <= 1/1000)

    sensibil1 = (np.random.random() <= 0.98)
    specific1 = (np.random.random() <= 0.99)

    sensibil2 = (np.random.random() <= 0.98)
    specific2 = (np.random.random() <= 0.99)

    test_pozitiv1 = (bolnav1 and sensibil1) or (not bolnav1 and not specific1)
    test_pozitiv2 = (bolnav1 and sensibil2) or (not bolnav1 and not specific2)



    if test_pozitiv1:
        counterPozitive += 1
        if bolnav1:
            bolnavi_cu_test += 1

    if test_pozitiv1 and test_pozitiv2:
        counterPozitive2 += 1

print(bolnavi_cu_test/counterPozitive)
print(bolnavi_cu_test/counterPozitive2)





# 2.Masina si capre
# 1.concurentul ramane la alegerea initiala

import random

castig_fara_schimb=0
castig_cu_schimb=0
nr=1000

for _ in range(nr):
    usa_masina=random.randint(0,2)
    alegere_initiala=random.randint(0,2)

    usi = [0, 1, 2]
    usi_ramase=[u for u in usi if u != alegere_initiala and u != usa_masina]
    usa_deschisa = random.choice(usi_ramase)

    # ușa rămasă închisă (alta decât alegerea inițială și cea deschisă)
    usa_ramasă = [u for u in usi if u not in (alegere_initiala, usa_deschisa)][0]

    # verificăm rezultatele pentru ambele strategii
    if alegere_initiala == usa_masina:
        castig_fara_schimb += 1
    if usa_ramasă == usa_masina:
        castig_cu_schimb += 1

    # calculăm probabilitățile
    prob_fara_schimb = castig_fara_schimb / nr
    prob_cu_schimb = castig_cu_schimb / nr

print(f"Probabilitate câștig FĂRĂ schimbare: {prob_fara_schimb:.4f}")
print(f"Probabilitate câștig CU schimbare: {prob_cu_schimb:.4f}")