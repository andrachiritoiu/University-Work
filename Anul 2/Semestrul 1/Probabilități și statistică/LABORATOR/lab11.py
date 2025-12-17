import numpy as np
import matplotlib.pyplot as plt
import scipy.optimize
import minimize, minimize_scalar

# 1
N=10000
Y=np.random.normal(loc=0, scale=1, size=N)
Z=np.random.choice([-1,1], size=N)

# print(Y)
# print(Z)

theta=0.4

X=Y*theta+np.sqrt(1-theta*theta)*Z
plt.hist(X, bins = 1000)
# plt.show()


# 2

def h(x):
    return 1 / np.sqrt(np.pi * 2) * np.exp(-x * x / 2)

def f(x):
    return 1/(2*theta)*(h((x-np.sqrt(1-theta*theta))/theta) + h((X+np.sqrt(1-theta*theta))/theta))

v_x=np.linspace(min(X), max(X), 100)
v_y=[f(x) for x in v_x]
plt.plot(v_x,v_y)
plt.show()

# 3
# log-ul
def logLN(th):
    return -np.sum(np.log(f(X,th)))
#plt.hist(x,bins=100, density=True)
# v_x= np.linspace(min(x), max(x), 200)
# v_y=[f(x,theta) for x in v_x]
#plt.plot(v_x,v_y, color='purple')

vx=np.linspace(0.1,0.9, 200)
vy=[logLN(th) for th in vx]
sol=minimize_scalar(logLN, bounds=(0,1))
print(sol.x)

#plt.plot(vx,vy)
#plt.show()


