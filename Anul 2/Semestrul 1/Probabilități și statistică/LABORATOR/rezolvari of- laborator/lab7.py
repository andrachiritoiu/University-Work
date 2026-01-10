import numpy as np
import matplotlib.pyplot as plt

EXERCISE=2



if EXERCISE==1:
    SUBPUNCT=6

    lam=20

    f=lambda t: lam*np.exp(-t*lam)

    if SUBPUNCT==1:

        p=1/180
        n=3600


        N=100000

        ore_pana_la_mesaj=[]

        cnt_mai_putin_10_min=0

        cnt_mai_mult_20_min=0

        for _ in range(N):
            cnt_secunde=1

            while(True):
                if np.random.random()<p:
                    break
                else:
                    cnt_secunde+=1

            ore_pana_la_mesaj.append(cnt_secunde/3600)

            if cnt_secunde<=60:
                cnt_mai_putin_10_min+=1

            elif cnt_secunde>=5*60:
                cnt_mai_mult_20_min+=1

        print('Probabilitatea sa primesc mesaj in primele 10 min',cnt_mai_putin_10_min/N)
        print('Probabilitatea sa primesc mesaj dupa mai mult de 20 min',cnt_mai_mult_20_min/N)

        print('Timpul mediu până la mesaj (minute)',np.average(ore_pana_la_mesaj)*60)

        fig,ax=plt.subplots()
        ax.hist(ore_pana_la_mesaj,bins=100,density=True)

        v_x=np.linspace(0,0.5,100)
        v_y=f(v_x)

        plt.plot(v_x,v_y)
        plt.show()

    if SUBPUNCT==4:
        N=10000

        ore_pana_la_mesaj=[]

        for _ in range(N):
            u=np.random.random()

            ore_pana_la_mesaj.append(-np.log(1-u)/lam)

        fig,ax=plt.subplots()
        ax.hist(ore_pana_la_mesaj,bins=100,density=True)

        v_x=np.linspace(0,0.5,100)
        v_y=f(v_x)

        plt.plot(v_x,v_y)

        plt.show()

    if SUBPUNCT==6:
        N=100000

        ore_pana_la_mesaj=[]
        cnt_astept_mai_mult_de_5_min=0
        cnt_a_venit_dupa_mai_putin_1_min=0

        for _ in range(N):
            u=np.random.random()

            x=-np.log(1-u)/lam

            if x>=5/60:
                cnt_astept_mai_mult_de_5_min+=1

                if x<=6/60:
                    cnt_a_venit_dupa_mai_putin_1_min+=1


        print('Probabilitatea ca, daca nu a venit mesaj de 5 minute, sa vina mesaj intr-un minut:',cnt_a_venit_dupa_mai_putin_1_min/cnt_astept_mai_mult_de_5_min)

if EXERCISE==2:
    SUBPUNCT=1

    if SUBPUNCT==1:
        N=50000

        VARIANTA=['INCET','RAPID'][1]

        nr_pasi=3600

        mu=0
        sigma=np.sqrt(nr_pasi)

        f=lambda x: np.exp(-(x-mu)**2/(2*sigma**2))/(np.sqrt(2*np.pi)*sigma)

        if VARIANTA=='INCET':

            pozitii_finale=[]

            cnt_favorabile=0

            for _ in range(N):
                poz=0
                for pas in range(nr_pasi):
                    directia=-1 if np.random.random() <0.5 else 1
                    poz+=directia

                pozitii_finale.append(poz)
                if np.abs(poz)<25:
                    cnt_favorabile+=1

        if VARIANTA=='RAPID':

            miscari=np.random.choice([-1,1],replace=True,size=(N,nr_pasi))

            pozitii_finale=np.sum(miscari,axis=1)

            cnt_favorabile=np.sum(np.abs(pozitii_finale)<25)


        print('Probabilitatea să am distanța mai mică de 25 de metri',cnt_favorabile/N)

        fig,ax=plt.subplots()

        ax.hist(pozitii_finale,density=True,bins=range(min(pozitii_finale),max(pozitii_finale)+2,2)) #punem bin-urile din 2 in 2 pentru ca pozitia betivului va avea mereu paritatea numarului de pasi
        v_x=np.linspace(-200,200,1000)
        v_y=f(v_x)

        plt.plot(v_x,v_y)

        plt.show()

    if SUBPUNCT==3:

        mu=2
        sigma=3

        f=lambda x: np.exp(-(x-mu)**2/(2*sigma**2))/(np.sqrt(2*np.pi)*sigma)

        N=100000

        normal_vector=np.random.normal(loc=mu,scale=sigma,size=N)

        fig,ax=plt.subplots()

        ax.hist(normal_vector,bins=100,density=True)

        v_x=np.linspace(-10,15,100)
        v_y=f(v_x)

        plt.plot(v_x,v_y)

        plt.show()

    if SUBPUNCT==5:

        mu=2
        sigma=3

        nu=4
        tau=2

        f=lambda x: np.exp(-(x-mu-nu)**2/(2*(sigma**2+tau**2)))/(np.sqrt(2*np.pi*(sigma**2+tau**2)))

        N=100000

        X=np.random.normal(loc=mu,scale=sigma,size=N)

        Y=np.random.normal(loc=nu,scale=tau,size=N)

        fig,ax=plt.subplots()

        ax.hist(X+Y,bins=100,density=True)

        v_x=np.linspace(-10,15,100)
        v_y=f(v_x)

        plt.plot(v_x,v_y)

        plt.show()


    if SUBPUNCT==6:

        N=100000

        mu=2
        sigma=3

        f=lambda x: np.exp(-(x-mu)**2/(2*sigma**2))/(np.sqrt(2*np.pi)*sigma)

        results=[]

        for _ in range(N):
            u1=np.random.random()
            u2=np.random.random()

            x= mu+ np.sqrt(-2*sigma**2*np.log(u1))*np.cos(2*np.pi*u2)

            results.append(x)

        fig,ax=plt.subplots()

        ax.hist(results,bins=200,density=True)

        v_x=np.linspace(-10,15,100)
        v_y=f(v_x)

        plt.plot(v_x,v_y)

        plt.show()


