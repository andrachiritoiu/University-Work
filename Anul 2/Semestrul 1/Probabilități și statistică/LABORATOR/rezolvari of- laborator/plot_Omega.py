import numpy as np
import matplotlib.pyplot as plt

def plot_Omega(with_ball=False,with_points=None):
    fig,ax=plt.subplots()
    v_theta=np.linspace(0,2*np.pi,num=100)
    v_x=np.multiply(rho(v_theta),np.cos(v_theta))
    v_y=np.multiply(rho(v_theta),np.sin(v_theta))
    ax.set_aspect(1)

    ax.plot(v_x,v_y,color="blue")

    if with_ball:
        v_R_x=R*np.cos(v_theta)
        v_R_y=R*np.sin(v_theta)
        ax.plot(v_R_x,v_R_y,color="red")

    if with_points:

        vp_x=[p[0]*np.cos(p[1]) for p in with_points]
        vp_y=[p[0]*np.sin(p[1]) for p in with_points]

        ax.scatter(vp_x, vp_y, color="black",marker='*')

    plt.show()

def points_inside(rho,R,number): # generates 'number' uniform random points in the star-shaped domain characterised by rho, via exclusion technique
                                 # R is the radius of a ball enclosing the domain
    points=[]
    num=0
    while (num<number):
        x,y=2*R*np.random.random(2)-R
        theta=np.arctan2(y,x)
        r=np.sqrt(x**2+y**2)
        if r<rho(theta):
            points.append((r,theta))
            num+=1
    return points


def rho(theta):
    return 3+np.cos(4*theta)

R=4

points=points_inside(rho,R,100)

plot_Omega(with_ball=True,with_points=points)
