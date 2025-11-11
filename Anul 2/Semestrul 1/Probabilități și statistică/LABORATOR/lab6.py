import numpy as np
import matplotlib.pyplot as plt

# 1
def factorial(n):
    if n == 0:
        return 1
    p=1
    for i in range(1,n+1):
        p*=i
    return p

def comb(n,k):
    return factorial(n)/(factorial(n-k)*factorial(k))

def prob(n,k,p):
    return comb(n,k)*p**k*(1-p)**(n-k)


total_zile=[]
p = 0.09
n = 30
N = 1000   #nr simulari

for _ in range(N):
    s=np.random.random()
    capat_interval=prob(n,0,p)

    # nr intalniri
    i=0
    while s>=capat_interval:
        i+=1
        capat_interval+=prob(n,i,p)
    total_zile.append(i)


plt.hist(total_zile, bins=range(0,n+1), density=True, rwidth=0.9)
plt.show();

# 2
import numpy as np
import matplotlib.pyplot as plt

N = 1000
p = 0.09
n = 30
primele_zile = []
for _ in range(N):
    i = 1
    while np.random.random() >=p :
        i+=1
        primele_zile.append(i)

print(f'Probabilitatea ceruta {primele_zile.count(7)/N}')
plt.hist(primele_zile, bins=(max(primele_zile)+1), density=True, rwidth=0.9)
plt.show();



# 3.cu formula
N=1000
primele_zile=[]
for _ in range(N):
    s=np.random.random()
    k=int(np.floor(np.log(1-s)/np.log(1-p)))
    primele_zile.append(k)
plt.hist(primele_zile, bins=(max(primele_zile)+1), density=True, rwidth=0.9)
plt.show();
