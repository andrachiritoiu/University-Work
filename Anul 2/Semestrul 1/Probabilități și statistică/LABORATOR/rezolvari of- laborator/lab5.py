import numpy as np
import matplotlib.pyplot as plt

EXERCISE=1

def zar():
        nr=np.random.random()
        for i in range(1,7):
            if nr<i/6:
                return i

if EXERCISE==1:
    NR_ZARURI=3
    S=15
    V=3

    N=1000000


    cazuri_totale=0
    cazuri_favorabile=0

    if NR_ZARURI==2:
        for _ in range(N):
            z1=zar()
            z2=zar()

            if z1+z2==S:
                cazuri_totale+=1
                if z1==V:
                    cazuri_favorabile+=1

        print('Probabilitatea condiționată:', cazuri_favorabile/cazuri_totale)


    if NR_ZARURI==3:
        for _ in range(N):
            z1=zar()
            z2=zar()
            z3=zar()

            if z1+z2+z3==S:
                cazuri_totale+=1
                if z1==V:
                    cazuri_favorabile+=1

        print('Probabilitatea condiționată:', cazuri_favorabile/cazuri_totale)


if EXERCISE==2:
    cnt_A=0
    cnt_B=0
    cnt_C=0

    cnt_A_B=0
    cnt_A_C=0
    cnt_A_B_C=0

    V1=1
    V2=5
    S=7

    N=100000

    for _ in range(N):
        z1=zar()
        z2=zar()

        A=B=C=False

        if z1==V1:
            A=True
        if z2==V2:
            B=True
        if z1+z2==S:
            C=True

        if A:
            cnt_A+=1
        if B:
            cnt_B+=1
        if C:
            cnt_C+=1
        if A and B:
            cnt_A_B+=1
        if A and C:
            cnt_A_C+=1
        if A and B and C:
            cnt_A_B_C+=1

    pA=cnt_A/N
    pB=cnt_B/N
    pC=cnt_C/N
    pAB=cnt_A_B/N
    pAC=cnt_A_C/N
    pABC=cnt_A_B_C/N
    print('P(A)=',pA)
    print('P(B)=',pB)
    print('P(C)=',pC)
    print('P(A,B,C)',pABC)

    print('P(A,B)-P(A)P(B)',pAB/(pA*pB)-1)
    print('P(A,C)-P(A)P(C)',pAC/(pA*pC)-1)
    print('P(A,B,C)-P(A)P(B)P(C)',pABC/(pA*pB*pC)-1)


if EXERCISE==3:
    n=30 #nr zile intr-o luna
    p=0.09 #probabilitatea de a intalni pe cineva

    METHOD=['SIMULATIONS','PROBABILITY_FUNCTION'][1]

    N=100000

    if METHOD=='SIMULATIONS':

        #Histograma facuta de mana, adica un bar plot al frecventelor fiecarei valori:
        freq=np.zeros(n+1)

        for _ in range(N):
            s=0 #va contine nr de zile in care intalnesc pe cineva
            for i in range(n): #simulez o luna
                intalnesc=np.random.random()<p
                if intalnesc:
                    s+=1
            freq[s]+=1


        print('Probabilitatea de a nu intalni pe nimeni vs 5 zile cu intalniri:',freq[0]/N,freq[5]/N)


        freq/=N
        fig,ax=plt.subplots()
        ax.bar(range(0,n+1),freq)
        plt.show()


    if METHOD=='PROBABILITY_FUNCTION':
        def factorial(j): #alternativ np.math.factorial
            if j==0:
                return 1
            p=1
            for i in range(1,j+1):
                p*=i

            return p

        def combinare(n,k): #alternativ scipy.special.comb
            return int(factorial(n)/(factorial(n-k)*factorial(k)))

        capete_interval=np.zeros(n+1)

        for k in range(0,n+1):
            capete_interval[k]=(capete_interval[k-1] if k>0 else 0) + combinare(n,k)*p**k*(1-p)**(n-k) #generam intervalele din sugestia din problema


        ZILE_TOTAL=[]
        for _ in range(N):
            r=np.random.random()
            zile=0
            for k in range(0,n+1):
                if r<capete_interval[k]:
                    zile=k
                    break
            ZILE_TOTAL.append(zile)


        fig,ax=plt.subplots()
        ax.hist(ZILE_TOTAL,bins=range(0,n+1),density=True,rwidth=0.9)
        plt.show()


