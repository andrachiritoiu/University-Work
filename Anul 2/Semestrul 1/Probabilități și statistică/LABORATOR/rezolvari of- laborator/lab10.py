import numpy as np
import matplotlib.pyplot as plt

from data_file import get_data

EXERCISE=2

if EXERCISE==1:
    SUBPUNCT=3
    def covariance_correlation(X,Y):


        L=len(X)

        X_bar=np.average(X)
        Y_bar=np.average(Y)

        Cov=L/(L-1)*np.average((X-X_bar)*(Y-Y_bar))



        Var_X=L/(L-1)*np.average((X-X_bar)**2)
        Var_Y=L/(L-1)*np.average((Y-Y_bar)**2)

        Corr=Cov/np.sqrt(Var_X*Var_Y)

        return Cov,Corr

    if SUBPUNCT==1:
        N=10000
        Z1=np.ceil(np.random.random(size=N)*6)
        Z2=np.ceil(np.random.random(size=N)*6)
        S=Z1+Z2

        Cov,Corr=covariance_correlation(Z1,S)

        print('Covarianta',Cov)
        print('Corelatia',Corr)


    if SUBPUNCT==2:
        geyser=get_data("geyser")

        Cov,Corr=covariance_correlation(geyser["eruptions"],geyser["waiting"])

        print('Covarianta',Cov)
        print('Corelatia',Corr)

        fig, ax=plt.subplots()

        ax.scatter(geyser["eruptions"],geyser["waiting"])
        plt.show()

    if SUBPUNCT==3:
        cars=get_data("cars")

        Cov,Corr=covariance_correlation(cars["tons"],cars["range"])

        print('Covarianta',Cov)
        print('Corelatia',Corr)

        fig, ax=plt.subplots()

        ax.scatter(cars["tons"],cars["range"])
        plt.show()

if EXERCISE==2:
    SUBPUNCT=3
    def simple_regression(X,Y):
        N=len(X)
        s_x_squared=np.sum(X**2)
        s_x=np.sum(X)
        s_xy=np.sum(X*Y)
        s_y=np.sum(Y)
        A=np.array([[s_x_squared, s_x],
                    [s_x, N]]) #matricea sistemului

        B=np.array([[s_xy],[s_y]])

        sol=(np.linalg.inv(A)@B).flatten()

        return sol[0],sol[1]


    if SUBPUNCT==1:
        geyser=get_data("geyser")
        a,b=simple_regression(geyser["eruptions"],geyser["waiting"])

        x_min=min(geyser["eruptions"])
        x_max=max(geyser["eruptions"])


        print('Predicția pauzei după o erupție de 6 minute:', a*6+b, 'minute')

        fig, ax=plt.subplots()
        ax.scatter(geyser["eruptions"],geyser["waiting"])
        ax.plot([x_min,x_max],[a*x_min+b,a*x_max+b],color="r")
        plt.show()


    if SUBPUNCT==2:
        cars=get_data("cars")
        a,b=simple_regression(cars["hp"],cars["range"])

        x_min=min(cars['hp'])
        x_max=max(cars['hp'])



        fig, ax=plt.subplots()
        ax.scatter(cars['hp'],cars['range'])
        ax.plot([x_min,x_max],[a*x_min+b,a*x_max+b],color="r")
        plt.show()

    if SUBPUNCT==3:
        def two_input_regression(X,Y,Z):
            N=len(X)
            ZZ=Z.reshape(N,1)

            XX=np.hstack([X.reshape(N,1),Y.reshape(N,1), np.ones((N,1))])

            XX_T_XX=XX.T@XX
            XX_T_XXinv=np.linalg.inv(XX_T_XX)

            sol=XX_T_XXinv@XX.T@ZZ

            sol=sol.flatten()

            return sol[0],sol[1],sol[2]


        cars=get_data("cars")
        a,b,c=two_input_regression(cars['tons'],cars["hp"],cars["range"])

        prediction=a*2+b*97+c


        print('Cu 40 de litri masina merge aproximativ',prediction*40,'kilometri')


        fig = plt.figure()
        ax = fig.add_subplot(projection='3d')

        ax.scatter(cars['tons'],cars["hp"],40*cars["range"])

        v_x=np.linspace(min(cars['tons']),max(cars['tons']),3)
        v_y=np.linspace(min(cars['hp']),max(cars['hp']),3)

        m_x,m_y=np.meshgrid(v_x,v_y)

        m_z=40*(a*m_x+b*m_y+c)

        ax.plot_surface(m_x,m_y,m_z,color="r",alpha=0.5)

        plt.show()
