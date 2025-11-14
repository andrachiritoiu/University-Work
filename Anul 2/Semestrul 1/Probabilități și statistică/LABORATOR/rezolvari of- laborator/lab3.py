import numpy as np
import matplotlib.pyplot as plt

EXERCISE=2

if EXERCISE==1:
    a=2
    b=7
    c=3
    d=5

    NUM=10000

    cnt=0

    for _ in range(NUM):
        r=a+np.random.random()*(b-a)

        if r>=c and r<=d:
            cnt+=1

    print('Probabilitatea empirică este: ',cnt/NUM)

if EXERCISE==2:

    R=4

    rho1=lambda theta: R

    rho2=lambda theta: 3+np.cos(4*theta)

    rho=rho2

    NUM=10000

    cnt=0

    for _ in range(NUM):
        x=-R+2*R*np.random.random()
        y=-R+2*R*np.random.random()

        P=np.array([x,y]) #punctul P arbitrar în pătratul de latură 2R

        r=np.linalg.norm(P)
        th=np.arctan2(y,x)

        if r<=rho(th):
            cnt+=1


    prob=cnt/NUM
    print('Probabilitatea empirică de a nimeri înăuntru: ',prob)
    print('Aria este aproximativ:', prob*(2*R)**2)


if EXERCISE==3:
    dist=10
    l=5

    NUM=1000

    cnt=0

    fig,ax=plt.subplots()

    ax.set_xlim(-l,dist+l)
    ax.set_ylim(-l,l)

    ax.plot([0,0],[-l,l],color='b')
    ax.plot([dist,dist],[-l,l],color='b')

    for _ in range(NUM):
        P=dist* np.random.random() #centrul chibritului

        th=np.pi * np.random.random() #unghiul cu verticala

        umbra=l/2*np.sin(th) #lungimea proiectiei unei jumatati de chibrtit pe axa orizontala

        if P+umbra>=dist or P-umbra<0: #chibritul taie una dintre linii
            cnt+=1

        x1=P-umbra
        x2=P+umbra

        y1=l/2*np.cos(th)
        y2=-l/2*np.cos(th)

        ax.plot([x1,x2],[y1,y2],color='k')



    print('Probabilitatea empirică este:',cnt/NUM)

    print('Pi este aproximativ:',NUM/cnt)

    plt.show()

