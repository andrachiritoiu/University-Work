import numpy as np
import matplotlib.pyplot as plt

# a=np.array([1,2,3])
# print(a)

# 1
# varianta 1
# a=np.random.random()*2*np.pi
# b=np.random.random()*2*np.pi
# print(a,b,sep="\n")
# print()
#
# # generare puncte daca avem unghiul
# A=(np.cos(a), np.sin(a))
# B=(np.cos(b), np.sin(b))
# print(A,B,sep="\n")
#
# # Ploture in Python
# plt.plot([A[0],B[0]],[A[1],B[1]])  # x-urile si y-urile
# # plt.show()
#
# # ajusteaza cutia in care afisezi pe axa Ox
# plt.gca().set_xlim(-1.05,1.05)
# plt.gca().set_ylim(-1.05,1.05)
#
# # sa nu fie prea mare
# plt.gca().set_aspect(1)
# circle=plt.Circle((0,0),1,color='b',fill=False,linewidth=3)
# circle2=plt.Circle((0,0),0.5,color='b',fill=False,linewidth=3)
# plt.gca().add_patch(circle)
# plt.gca().add_patch(circle2)
#
#
def intersecteaza(A,B):
    return np.linalg.norm(np.array(A)-np.array(B))>=np.sqrt(3)

# print(intersecteaza(A,B))

# plt.show()
print()

# Tot repetat de 100 de ori
num=100
cnt=0

plt.gca().set_xlim(-1.05, 1.05)
plt.gca().set_ylim(-1.05, 1.05)
plt.gca().set_aspect(1)
circle = plt.Circle((0, 0), 1, color='b', fill=False, linewidth=3)
circle2 = plt.Circle((0, 0), 0.5, color='b', fill=False, linewidth=3)
plt.gca().add_patch(circle)
plt.gca().add_patch(circle2)

for i in range(num):
    a = np.random.random() * 2 * np.pi
    b = np.random.random() * 2 * np.pi

    A = (np.cos(a), np.sin(a))
    B = (np.cos(b), np.sin(b))

    if intersecteaza(A,B)==True:
        cnt+=1

    plt.plot([A[0],B[0]],[A[1],B[1]])  # x-urile si y-urile


print(cnt)
print("Probabilitattea este de: ",cnt/num)

plt.show()




# varianta 2
nr_puncte=0
nr_puncte_bune=0
while(nr_puncte<num):
    p1=np.random.random()
    p2=np.random.random()

    if np.linalg.norm(np.array([p1,p2]))<=1:
        #pastrez (p1,p2)
        nr_puncte+=1
        if np.linalg.norm(np.array([p1,p2]))<=0.5:
            #intersecteaza
            nr_puncte_bune+=1
print('Prrobabilitatea empirica:', nr_puncte_bune/num)




# var 3 - tema
#
# N = 10000  # numărul de corzi
# R = 1
# r_mic = 0.5
#
# # 1. Generează puncte aleatoare în pătratul [-1,1] x [-1,1]
# x = np.random.uniform(-1, 1, N * 2)
# y = np.random.uniform(-1, 1, N * 2)
#
# # 2. Păstrăm doar punctele din cercul mare
# mask = x**2 + y**2 <= R**2
# x, y = x[mask][:N], y[mask][:N]  # luăm primele N puncte valide
#
# # 3. Calculăm distanța de la centru
# d = np.sqrt(x**2 + y**2)
#
# # 4. Verificăm câte intersectează cercul mic (d < 0.5)
# prob = np.mean(d < r_mic)
#
# # 5. Afișăm rezultatul
# print(f"Probabilitatea empirică (varianta 3): {prob:.4f}")





# 2.Ziua de nastere - tema

import numpy as np

def prob_coincid(N, sim=10000):
    count = 0
    for _ in range(sim):
        zile = np.random.randint(0, 365, N)
        if len(np.unique(zile)) < N:
            count += 1
    return count / sim

for N in [23, 60, 100]:
    p = prob_coincid(N)
    print(f"N={N}: P ≈ {p:.4f}")



