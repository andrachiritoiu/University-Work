import numpy as np
import matplotlib.pyplot as plt

EXERCICES=2

if EXERCICES==1:
    SUBPUNCT=2

    if SUBPUNCT==1:
        print("Simulare pe hartie")


    elif SUBPUNCT==2:
        N = 10000
        nr_aruncari = 10
        cnt = 0
        sol_partiale=[]

        for i in range(N):
            nr_cap = 0
            nr_pajura = 0

            for _ in range(nr_aruncari):
                x = np.random.random()

                if x <= 0.5:
                    nr_cap += 1

                else:
                    nr_pajura += 1

            if nr_cap >= 3:
                cnt += 1

            sol_partiale.append(cnt/(i+1))

        print(f"Probabilitatea sa pice de cel putin 3 ori cap este {cnt / N}")
        p = cnt / N

        fig,ax = plt.subplots()
        ax.plot([0,N],[p,p])
        ax.plot(sol_partiale)

        plt.show()



    elif SUBPUNCT == 3:
        N = 10000
        nr_aruncari = 10
        cnt_cap3 = 0
        cnt_pajmin5=0
        cnt=0


        for _ in range(N):
            nr_cap = 0
            nr_pajura = 0

            for _ in range(nr_aruncari):
                x = np.random.random()

                if x <= 0.5:
                    nr_cap += 1

                else:
                    nr_pajura += 1

            if nr_cap >= 3:
                cnt_cap3 += 1

            if nr_pajura <=5:
                cnt_pajmin5 +=1

                if nr_cap >= 3:
                    cnt+=1

        P_A_empiric=cnt_cap3/N
        P_B_empiric=cnt_pajmin5/N
        P_AsiB_empiric=cnt/N

        P_interesect=P_A_empiric*P_B_empiric

        if(P_interesect == P_AsiB_empiric):
            print("Sunt independente")
        else:
            print("Nu sunt independete")



elif EXERCICES==2:
    SUBPUNCT = 1

    if SUBPUNCT == 1:
        N = 1000
        d = 20
        l = 2
        nr_generari=0
        caz_fav=0

        for _ in range(N):
            cnt = 0  # cat nu nimereste lemnul
            corect = 0
            while (corect == 0):
                x = np.random.uniform(-d, d)
                y = np.random.uniform(-d, d)
                nr_generari += 1

                if ((np.linalg.norm([x], [y]) < 1) == 0):
                    cnt += 1
                else:
                    corect = 1

            if cnt>=20:
                caz_fav+=1

        print(f"Probabilitatea sa ma opresc dupa ce am aruncat mai mult de 20 de pietre este: {caz_fav / N}")



    if SUBPUNCT == 2:
        d = 20
        l = 2
        cnt = 0  # cat nu nimereste lemnul
        corect = 0
        nr_generari=0


        while(corect==0):
            x = np.random.uniform(-d, d)
            y = np.random.uniform(-d, d)
            nr_generari+=1

            if ((np.linalg.norm([x], [y]) < 1) == 0):
                cnt += 1
            else:
                corect = 1


    # fig , ax = plt.subplots()
    # ax.add_patch(plt.Circle((0,0), 20 ,fill=False))
    # ax.add_patch(plt.Rectangle((0,0),2,2,fill=False))
    # ax.plt([x],[y])
    # plt.show()



    if SUBPUNCT == 3:
        N = 1000
        d = 20
        l = 2
        nr_generari = 0
        caz_fav = 0
        sol_partaile=[]

        for _ in range(N):
            cnt = 0  # cat nu nimereste lemnul
            corect = 0
            while (corect == 0):
                x = np.random.uniform(-d, d)
                y = np.random.uniform(-d, d)
                nr_generari += 1

                if ((np.linalg.norm([x], [y]) < 1) != 0):
                    corect = 1
                    sol_partaile.append(tuple(x,y))

        #aici se parcugea fiecare pereche si se vedea daca distanta e mai mica de 1 metru intre macar 2 puncte si se crestea contorul




