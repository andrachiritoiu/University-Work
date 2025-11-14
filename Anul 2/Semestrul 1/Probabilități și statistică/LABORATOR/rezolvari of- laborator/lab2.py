import numpy as np
import matplotlib.pyplot as plt

EXERCISE=3

if EXERCISE==1: #datul cu banul
    BAN=['cinstit','masluit'][0]

    K=100000 #nr de simulari

    PLOT=True

    if BAN=='cinstit':
        p=.5 #probabilitatea sa pice Cap
    else:
        p=.7

    if not PLOT:
        Capete=0
        
        for i in range(K):
            r=np.random.random() #ranodm in [0,1)
            
            C= 1 if r<p else 0 #a picat cap?

            Capete+=C

        print('Probabilitate empirică să pice Cap este:',Capete/K)

    if PLOT:
        ProbIntermediare=[]
        Capete=0
        
        for i in range(K):
            r=np.random.random() #ranodm in [0,1)
            
            C= 1 if r<p else 0 #a picat cap?

            Capete+=C

            ProbIntermediare.append(Capete/(i+1))

        fig,ax=plt.subplots()
        ax.plot(range(1,K+1),ProbIntermediare,color="b")
        ax.plot([1,K+1],[p,p],color="r") #probabilitatea reala
        plt.show()


if EXERCISE==2: #Mai multe aruncari cu banul
    N=20 #nr aruncari cu banul
    K=10000
    
    CHECK=['CCC','CPCPCPCP','CCCC/PPPP','CCCCC/PPPPP'][0]

    if CHECK=='CCC':
        MASK=[np.array([1,1,1],dtype=int)]
    elif CHECK=='CPCPCPCP':
        MASK=[np.array([1,0,1,0,1,0,1,0],dtype=int)]
    elif CHECK=='CCCC/PPPP':
        MASK=[np.array([1,1,1,1],dtype=int),np.array([0,0,0,0],dtype=int)]
    elif CHECK=='CCCCC/PPPPP':
        MASK=[np.array([1,1,1,1,1],dtype=int),np.array([0,0,0,0,0],dtype=int)]

    Favorabile=0

    for _ in range(K):
        vec=np.zeros(N,dtype=int)
        for i in range(N):
            r=np.random.random() #ranodm in [0,1)
            
            C= 1 if r<.5 else 0 #a picat cap?
            vec[i]=C
        #alternativ
        # vec=np.random.choice([0,1],N)
        
        #print(vec)

        to_break=False #ca sa dam break la ambele for-uri
        for mask in MASK:
            for i in range(N-len(mask)):
                if (vec[i:i+len(mask)]==mask).all(): #adica avem egalitate pe fiecare element
                    Favorabile+=1
                    to_break=True
                    break
            if to_break:
                to_break=False
                break
    

    print('Probabilitatea sa apara '+CHECK+' este:',Favorabile/K)


if EXERCISE==3: #Zarurile lui Efron
    Z1=[1,4,4,4,4,4]
    Z2=[3,3,3,3,3,6]
    Z3=[2,2,2,5,5,5]

    ZARURI=[Z1,Z2,Z3]

    K=10000

    Castiguri=np.zeros(len(ZARURI),dtype=int)
    for _ in range(K):
        aruncari=[] # aici punem rezultatele aruncarilor
        for zar in ZARURI:
            sim_zar=np.random.choice(zar) #alegem o cifra de pe zar
            aruncari.append(sim_zar)

        # print(aruncari)
        zar_castigator=np.argmax(aruncari) #care e zarul cu cea mai mare aruncare?
        #print('A castigat',zar_castigator)

        Castiguri[zar_castigator]+=1

    print('Probabilitatile de castig sunt:',Castiguri/K)
        

            
