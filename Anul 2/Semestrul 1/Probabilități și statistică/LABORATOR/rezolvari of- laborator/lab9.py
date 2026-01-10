import numpy as np
import matplotlib.pyplot as plt



SUBPUNCTUL=3

if SUBPUNCTUL==1:
    #Spre exemplu,
    g=lambda x: x**2+2
    a=1
    b=2
    int_teoretic=13/3
    N=10000

    X=a+np.random.random(size=N)*(b-a)

    Z=g(X)

    partials=(b-a)*np.cumsum(Z)/np.array(range(1,N+1))

    fig,ax=plt.subplots()
    ax.plot(range(1,N+1),partials-int_teoretic)
    ax.plot([1,N],[0,0])
    plt.show()


if SUBPUNCTUL==2:
    R=4
    rho = lambda theta: 3+np.cos(4*theta)
    def is_in_omega(x,y):
        r=np.linalg.norm([x,y])
        th=np.arctan2(y,x)
        return r<=rho(th)
    def g(x,y):
        if not is_in_omega(x,y):
            return 0
        return x**2-3*y**3

    N=5000000

    X=-R+np.random.random(size=N)*2*R
    Y=-R+np.random.random(size=N)*2*R

    Z=[g(x,y) for (x,y) in zip(X,Y)]

    integrala=4*R**2*sum(Z)/N

    print(integrala)

if SUBPUNCTUL==3:
    g = lambda x: 1/(x**2+1)

    int_teoretic=np.pi

    sigma=20

    f=lambda x: 1/(np.sqrt(2*np.pi)*sigma)*np.exp(-x**2/(2*sigma**2))

    N=100000


    X=np.random.normal(scale=sigma,size=N)

    print(X)

    Z=g(X)/f(X)

    print(Z)


    partials=np.cumsum(Z)/np.array(range(1,N+1))

    fig,ax=plt.subplots()
    ax.plot(range(1,N+1),partials-int_teoretic)
    ax.plot([1,N],[0,0])
    plt.show()




