import numpy as np
import matplotlib.pyplot as plt

EXERCISE=6

if EXERCISE == 1:
    SUBPUNCT=3

    if SUBPUNCT == 1:
        N=1000  #nr de teste
        aruncari=20

        nr_perechi_identice=0
        for _ in range(N):
            nr_perechi=0

            for _ in range(aruncari):
                moneda1=np.random.random()
                moneda2=np.random.random()

                if (moneda1<=0.5 and moneda2<=0.5) or (moneda1>0.5 and moneda2>0.5):
                    nr_perechi+=1

            if nr_perechi==15:
                nr_perechi_identice+=1

        print(nr_perechi_identice/N)

    elif SUBPUNCT == 2:
        N=1000  #nr de teste
        aruncari=20

        nr_perechi_identice=0
        for _ in range(N):
            nr_perechi=0

            for _ in range(aruncari):
                moneda1=np.random.random()
                moneda2=np.random.random()

                if (moneda1<=0.5 and moneda2<=0.5) or (moneda1>0.5 and moneda2>0.5):
                    nr_perechi+=1

            if nr_perechi>=15:
                nr_perechi_identice+=1

        print(nr_perechi_identice/N)

    elif SUBPUNCT == 3:
        N = 1000  # nr de teste
        aruncari = 20

        nr_perechi_identice = 0
        for _ in range(N):
            nr_perechi = 0

            for _ in range(aruncari):
                moneda1 = np.random.random()
                moneda2 = np.random.random()

                if (moneda1 <= 0.5 and moneda2 <= 0.5) or (moneda1 > 0.5 and moneda2 > 0.5):
                    nr_perechi += 1

            if nr_perechi <= 15:
                nr_perechi_identice += 1

        print(nr_perechi_identice / N)


elif EXERCISE == 2:
    SUBPUNCT = 1

    if SUBPUNCT == 1:
        def f1(x,y):
            return (x**2+y**2)**2+18*(x**2+y**2)-27-8*(x**3-3*x*y**2)


        def f2(x, y):
            return 0

        def f3(x,y):
            return 0

        def arie(N=1000):
            arie_refereinta=6*6
            cnt=0
            for _ in range (N):
                a=-2
                b=4
                c=-3
                d=3

                x = np.random.random() * (b - a) + a
                y = np.random.random() * (d - c) + c

                if(f1(x,y)<=0):
                    cnt+=1
            return cnt

        N=1000
        cnt=arie(N)
        prob=cnt/N
        print(prob)
        print(f"Aria este:{prob*(6*6)}")

    elif  SUBPUNCT==2:

        print("verificare f1<=0 && f3>0 && f2<=0")


elif EXERCISE == 3:
    SUBPUNCT = 1

    if SUBPUNCT == 1:
        N=1000
        nr_teste=1
        cnt_defect=0
        cnt = 0
        cnt_poz = 0

        for _ in range(N):
            bec_defect=np.random.random()<2/100

            bec_bun=False


            for _ in range(nr_teste):
                test_sensibil=np.random.random()<90/100
                test_specific=np.random.random()<95/100

                test_pozitiv=(test_sensibil and bec_defect)or(not(test_specific) and not bec_defect)

                if not test_pozitiv:
                    bec_bun=True

            if not bec_bun:
                cnt_poz+=1

                if bec_defect:
                    cnt+=1

        print(cnt/cnt_poz)



elif EXERCISE == 4:
    #distributie binomiala
    N=100000
    cnt=0
    v=[]
    fig,ax=plt.subplots()

    for _ in range(N):
        nr_pachete=0
        for _ in range(20):
            p=np.random.random()
            if p<5/100:
                nr_pachete+=1

        if nr_pachete<=1:
            cnt+=1

        v.append(nr_pachete)

    print(cnt/N)
    ax.hist(v,bins=range(21),rwidth=0.9)
    plt.show()

elif EXERCISE == 5:
    # N=1000
    # fig,ax=plt.subplots()
    #
    # prima_zi = []
    #
    # for _ in range(N):
    #     k=1
    #     while(np.random.random()>1/1000):
    #         k+=1
    #     prima_zi.append(k)
    #
    # ax.hist(prima_zi,bins=range(0,max(prima_zi)), rwidth=0.9)
    # plt.show()
    #
    # cnt=0
    # for i in prima_zi:
    #     if i<=100:
    #         cnt+=1
    #
    # print(cnt/N)

# # distributie geometrica
    N=1000
    p=1/1000
    prima_zi=[]

    for _ in range(N):
        s=np.random.random()
        k=int(1+np.floor(np.log(1-s)/np.log(1-p)))
        prima_zi.append(k)

    cnt=0
    for i in prima_zi:
        if i<=100:
            cnt+=1


    print(cnt/N)

elif EXERCISE == 6:
    N = 1000

    cnt_succes = 0

    Linii = {
        1: 7,
        2: 10,
        3: 12
    }

    for _ in range(N):
        linie = np.random.randint(1, 4)

        Max_Wait = Linii[linie]
        timp_asteptare = np.random.uniform(0, Max_Wait)

        # print(timp_asteptare)

        if timp_asteptare <= 7:
            cnt_succes += 1

    probabilitate_empirica = cnt_succes / N

    print(f"Probabilitatea teoretică P(X <= 7): {0.7611:.4f} (76.11%)")
    print(f"Probabilitatea empirică P(X <= 7): {probabilitate_empirica:.4f}")


# elif EXERCISE == 7:
# poisson

