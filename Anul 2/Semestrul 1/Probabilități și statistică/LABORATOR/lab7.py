import numpy as np
import matplotlib.pyplot as plt
from math import comb
from math import factorial

# lab6
# 2. În medie, primesc λ = 20 de mesaje pe WhatsApp într-o oră. Care este probabilitatea ca
#  ora viitoare să primesc k = 30 de mesaje?
#
# k=30   #cate mesaje sa primesc
# n=3600
#
# N=1000
# cnt=0
# nr_mesaje=[]
#
# for _ in range(N):
#     nr=0
#     for _ in range(n):
#         if np.random.random()<1/180:
#             nr+=1
#     nr_mesaje.append(nr)
#     if nr==30:
#         cnt+=1
#
# print(f"Probabilitatea este de: {cnt/N}")
#
#
# # 2
# fig, ax = plt.subplots()
#
# ax.hist(nr_mesaje, bins=range(0, max(nr_mesaje)+2), rwidth=0.9, density=True)
# # plt.show()
#
# # 3
# print(np.average(nr_mesaje))
#
# # 4
# lmbda=20
# nr_mesaje2=[]
#
# def prob(k):
#     return (lmbda**k/factorial(k)) * np.exp(-lmbda)
#
# for _ in range(N):
#     sk=np.random.random()
#     capat_interval=prob(0)
#     k=0
#     while sk<capat_interval:
#         k+=1
#         capat_interval+=prob(k)
#     nr_mesaje2.append(k-1)


# ax.hist(nr_mesaje2, bins=range(0, max(nr_mesaje2)+2), rwidth=0.9, density=True)
# plt.show()


# lab 7
# 1.1 si 2

#  cel puțin un mesaj în următorul minut
N=10000
cnt1=0
nr_mesaje_min1=[]
medie=[]

for _ in range(N):
    nr=0

    while np.random.random() >= 1/180:
        nr+=1
    nr_mesaje_min1.append(nr/3600)
    medie.append(nr/60)

for _ in range(N):
    nr1=0
    for _ in range(60):
        if np.random.random()<1/180:
            nr1+=1
    if nr1>=1:
        cnt1+=1

print(f"Probabilitatea este de: {cnt1/N}")

# fig, ax = plt.subplots()
# ax.hist(nr_mesaje_min1, bins=100, rwidth=0.9, density=True)
# plt.show()



# 1.2
#a să nu primesc niciun mesaj în următoarele 5 minute

cnt2=0
nr_mesaje_min2=[]

for _ in range(N):
    nr2=0
    for _ in range(300):
        if np.random.random()<1/180:
            nr2+=1
    nr_mesaje_min2.append(nr2)
    if nr2 == 0:
        cnt2+=1

print(f"Probabilitatea este de: {cnt2/N}")

# fig, ax = plt.subplots()
# ax.hist(nr_mesaje_min2, bins=range(0, max(nr_mesaje_min2)+2), rwidth=0.9, density=True)
# plt.show()

# 3
print(np.average(medie))

# 4
lmbda=20
timp_ore=[]

for _ in range(N):
    u=np.random.random()
    x= -np.log(1-u)/lmbda
    timp_ore.append(x)

# fig, ax = plt.subplots()
# ax.hist(timp_ore, bins=100, rwidth=0.9, density=True)
# plt.show()


# 5
def f(t):
    # f = F'
    return lmbda**np.exp(-t)

fig, ax = plt.subplots()
v_x=np.linspace(0,2,200)
v_y=[f(x) for x in v_x]
ax.plot(v_x,v_y)
plt.show()

# tema 6

