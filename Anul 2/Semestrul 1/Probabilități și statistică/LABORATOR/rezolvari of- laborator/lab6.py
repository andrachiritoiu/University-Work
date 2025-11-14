import numpy as np
import matplotlib.pyplot as plt
import math

EXERCISE=2



if EXERCISE==1:
    p=9/100

    zile=7

    N=10000

    METHOD=['SIMULATIONS','PROBABILITY_FUNCTION'][0]

    if METHOD=='SIMULATIONS':

        prima_zi=[]

        for _ in range(N):
            k=1
            while(np.random.random()>p):
                k+=1
            prima_zi.append(k)

        print(f'Probabilitatea de a mă vedea prima dată cu cineva peste {zile} zile este:',prima_zi.count(7)/N)

        fig,ax=plt.subplots()

        ax.hist(prima_zi,bins=range(0,max(prima_zi)),rwidth=0.9,density=True)
        plt.show()

    if METHOD=='PROBABILITY_FUNCTION':

        prima_zi=[]

        for _ in range(N):
            s=np.random.random()
            k=int(1+np.floor(np.log(1-s)/np.log(1-p)))
            prima_zi.append(k)

        fig,ax=plt.subplots()

        ax.hist(prima_zi,bins=range(0,max(prima_zi)),rwidth=0.9,density=True)
        plt.show()


if EXERCISE==2:

    lam=20
    n=3600

    test=30

    N=10000

    METHOD=['SIMULATIONS','PROBABILITY_FUNCTION'][0]

    if METHOD=='SIMULATIONS':

        p=lam/n

        nr_mesaje=[]

        for _ in range(N):
            msg=0 #va contine nr de mesaje intr-o ora
            for i in range(n): #simulez o ora
                primesc_mesaj_in_secunda_i=np.random.random()<p
                if primesc_mesaj_in_secunda_i:
                    msg+=1
            nr_mesaje.append(msg)

        print(f'Probabilitatea să primesc {test} mesaje este:',nr_mesaje.count(test)/N)

        fig,ax=plt.subplots()

        ax.hist(nr_mesaje,bins=range(0,max(nr_mesaje)),rwidth=0.9,density=True)
        plt.show()

    if METHOD=='PROBABILITY_FUNCTION':
        def prob(lam,k):
            return np.exp(-lam)*lam**k/math.factorial(k)

        nr_mesaje=[]

        for _ in range(N):
            s=np.random.random()
            k=0
            x=np.exp(-lam) #capatul din dreapta al intervalului
            while(True):
                if s < x:
                    break
                else:
                    k+=1
                    x+=prob(lam,k)
            nr_mesaje.append(k)

        fig,ax=plt.subplots()

        ax.hist(nr_mesaje,bins=range(0,max(nr_mesaje)),rwidth=0.9,density=True)
        plt.show()


