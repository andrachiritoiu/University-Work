import numpy as np
import matplotlib.pyplot as plt

#Considerăm, spre exemplu, variabila Bernoulli(p):

p=0.3

mu=1-p
sigma=np.sqrt(p*(1-p))

SUBPUNCTUL=1

if SUBPUNCTUL==1:
    N=100000
    eroarea_partiala_mu=[]

    suma_mu=0
    suma_var=0

    X=np.random.choice([0,1],p=[p,1-p],size=N)

    partial_sums=np.cumsum(X)

    eroarea_partiala_mu=partial_sums/np.array(range(1,N+1))-mu

    eroarea_partiala_var=[]

    for i in range(2,N):
        eroarea_partiala_var.append(np.sum((X[:i]-partial_sums[i]/i)**2)/(i-1)-sigma**2)

    #eroarea_partiala_var=np.cumsum()/np.array(range(1,N))-mu

    fig,(ax1,ax2)=plt.subplots(1,2)
    ax1.plot(range(1,N+1),eroarea_partiala_mu)
    ax1.plot([0,N+1],[0,0])
    ax2.plot(range(2,N),eroarea_partiala_var)
    ax2.plot([0,N+1],[0,0])


    plt.show()

if SUBPUNCTUL==2:

    f=lambda x: np.exp(-x**2/2)/(np.sqrt(2*np.pi))
    K=10000
    N=50000

    sim=[]

    for _ in range(K):
        X=np.random.choice([0,1],p=[p,1-p],size=N)

        TLC=np.sqrt(N)/sigma*(np.average(X)-mu)
        sim.append(TLC)

    fig,ax=plt.subplots()

    ax.hist(sim,bins=200,density=True)

    v_x=np.linspace(-4,4,100)
    v_y=f(v_x)

    plt.plot(v_x,v_y)

    plt.show()


