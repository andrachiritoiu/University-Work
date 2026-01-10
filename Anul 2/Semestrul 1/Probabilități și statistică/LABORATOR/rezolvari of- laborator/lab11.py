import numpy as np
import matplotlib.pyplot as plt

from scipy.optimize import minimize_scalar

def h(x):
    return np.exp(-x**2/2)/np.sqrt(2*np.pi)

def f(x,th):
    return (h((x-np.sqrt(1-th**2))/th)+h((x+np.sqrt(1-th**2))/th))/(2*th)

N=10000

th=0.32

xx=[]

for _ in range(N):
    y=np.random.normal()
    z=np.random.choice([-1,1])

    x=th*y + np.sqrt(1-th**2)*z
    xx.append(x)

fig, (ax1,ax2)=plt.subplots(1,2)
ax1.hist(xx,bins=200,density=True)

v_x=np.linspace(-3,3,200)
v_y=[f(x,th) for x in v_x]

ax1.plot(v_x,v_y)


def MinusLogL(thth):
    return -sum([np.log(f(x,thth)) for x in xx])

minimization=minimize_scalar(MinusLogL,bounds=(0,1))

th_star=minimization.x

print('Predicted theta*:',th_star)

v_x2=np.linspace(0.1,0.99,100)
v_y2=[-MinusLogL(x) for x in v_x2]

ax2.plot(v_x2,v_y2)

ax2.plot([0,1],[0,0],color="k")

ax2.plot([th_star,th_star],[0,-minimization.fun],linestyle='dashed')

plt.show()
