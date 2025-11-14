import numpy as np
import matplotlib.pyplot as plt


EXERCISE=2


#np.random,seed(13) #lucky number


if EXERCISE==1:
    #Generarea unei coarde intr-un cerc
    METHOD= 1 # 1=doua puncte pe cerc; 2=centrul generat cu coordonate polare; 3=centrul generat cu metoda respingerii

    NUM=10000
    R=1; r=1/2

    def plot_chords(R,r,Chords): #raza mare, raza mica si lista de perechi de puncte de pe cerc, determinand coardele
        fig,ax=plt.subplots()
        ax.set_xlim(-1.05,1.05)
        ax.set_ylim(-1.05,1.05)
        ax.set_aspect(1)

        ax.add_patch(plt.Circle((0,0),R,color='b',fill=False,linewidth=3)) #cercul mare
        ax.add_patch(plt.Circle((0,0),r,color='r',fill=False,linewidth=3)) #cercul mic

        for chord in Chords: #coardele
            P1=chord[0]
            P2=chord[1]
            ax.plot([P1[0],P2[0]],[P1[1],P2[1]],color='k')

        plt.show()


    #plot_chords(1,1/2,[((0,1),(-1,0))]) #Exemplu de plotare a unei coarde

    def does_intersect_small_circle(P1,P2): #verifica daca segmentul P1P2 intersecteaza cercul mic
        length=np.linalg.norm(np.array(P1)-np.array(P2))
        
        if length>=np.sqrt(3):
            return True #coardele mai lungi decat sqrt(3) taie cercul mic
        else:
            return False

    if METHOD==1:

        Chords=[]
        Num_intersects=0

        for _ in range(NUM):
            theta1=np.random.random()*2*np.pi #primul unghi
            theta2=np.random.random()*2*np.pi #al doilea unghi

            P1=(R*np.cos(theta1),R*np.sin(theta1))
            P2=(R*np.cos(theta2),R*np.sin(theta2))
            Chords.append((P1,P2))
            
            if does_intersect_small_circle(P1,P2):
                Num_intersects+=1
        
        print('In cazul #1, probabilitatea este:',Num_intersects/NUM)
        plot_chords(R,r,Chords)

    
    if METHOD==2:

        Chords=[]
        Num_intersects=0

        for _ in range(NUM):
            r_sim=np.random.random() #raza la care se afla centrul coardei
            theta=np.random.random()*2*np.pi # unghiul fata de axa Ox pe care il face perpendiculara pe coarda

            if r_sim==0: #caz improbabil
                continue

            center=np.array((r_sim*np.cos(theta),r_sim*np.sin(theta))) #centrul coardei
            perpendicular=np.array((-r_sim*np.sin(theta),r_sim*np.cos(theta))) #directia perpendiculara pe coarda
            normalized_perpendicular=perpendicular/np.linalg.norm(perpendicular) #normalizam
            

            P1=center+np.sqrt(1-r_sim**2)*normalized_perpendicular #lungimea coardei=2*sqrt(1-r**2)
            P2=center-np.sqrt(1-r_sim**2)*normalized_perpendicular

            Chords.append((P1,P2))

            if does_intersect_small_circle(P1,P2):
                Num_intersects+=1

        print('In cazul #2, probabilitatea este:',Num_intersects/NUM)
        plot_chords(R,r,Chords)

    if METHOD==3:

        Chords=[]
        Num_intersects=0

        Num_generated=0
        while(Num_generated<NUM): 
            x=np.random.random()*2-1 #Generam uniform in patratul [-1,1]*[-1,1]
            y=np.random.random()*2-1

            r_sim=np.linalg.norm(np.array((x,y))) #distanta de la punctul simulat in patrat la centrul cercurilor

            if r_sim<=R: #daca suntem in cercul mare, pastram punctul
                Num_generated+=1
                center=np.array((x,y)) #centrul coardei
                perpendicular=np.array((-y,x)) #directia perpendiculara pe coarda
                normalized_perpendicular=perpendicular/np.linalg.norm(perpendicular) #normalizam
                

                P1=center+np.sqrt(1-r_sim**2)*normalized_perpendicular #lungimea coardei=2*sqrt(1-r**2)
                P2=center-np.sqrt(1-r_sim**2)*normalized_perpendicular

                Chords.append((P1,P2))

                if does_intersect_small_circle(P1,P2):
                    Num_intersects+=1

        print('In cazul #3, probabilitatea este:',Num_intersects/NUM)
        plot_chords(R,r,Chords)


if EXERCISE==2:

    def factorial(n): #calculeaza n!
        p=1
        for i in range(n):
            p*=(i+1)
        return p

    def analytic_solution(N,DAYS): #solutia analitica a problemei zilelor de nastere
        return 1-factorial(DAYS)/(DAYS**N*factorial(DAYS-N))

    N=60 #nr de persoane
    DAYS=365 #zile intr-un an

    NUM=10000 #nr de simulari

    Num_occurences=0

    for _ in range(NUM):
        #print('')
        #print('Epoch')
        days=[]
        for _ in range(N):
            day=int(1+np.random.random()*365)
            #print(day)
            if day in days:
                Num_occurences+=1
                break
            else:
                days.append(day)

    print('Probabilitatea de a se repeta o aniversare:',Num_occurences/NUM)
    print('Analitic:',analytic_solution(N,DAYS))







            




