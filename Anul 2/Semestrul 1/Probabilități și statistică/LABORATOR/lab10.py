import numpy as np
import matplotlib.pyplot as plt

# #1.Convarianta si corelatie
# #  X=valoarea primului zar
# # Y=suma celor două zaruri
#
#
# # convarianta
# N=100000
#
# # zar 1
# # vector nu nr de la 1 la 7
# # np.random.choice(range(1,7))
# X=np.floor(np.random.random(N) * 6 + 1)
#
# # zar 2
# Z=np.floor(np.random.random(N) * 6 + 1)
#
# # suma zarurilor
# Y=X+Z
#
# mod_X=np.average(X)
# mod_Y=np.average(Y)
#
# cov=np.sum((X-mod_X)*(Y-mod_Y))/(N-1)
#
# print(cov)
#
#
# # corelatia
# # sigma patrat= (X-mod_X)*(X-mod_X))
# # sigma=rad(covarianta)
#
# sigma_X=np.sqrt(np.sum((X-mod_X)*(X-mod_X))/(N-1))
# sigma_Y=np.sqrt(np.sum((Y-mod_Y)*(Y-mod_Y))/(N-1))
#
# corr=cov/(sigma_X*sigma_Y)
# print(corr)


# 2
N=10000

def functie(X,Y):
    mod_X = np.average(X)
    mod_Y = np.average(Y)

    cov = np.sum((X - mod_X) * (Y - mod_Y)) / (N - 1)

    print(cov)

    # corelatia
    # sigma patrat= (X-mod_X)*(X-mod_X))
    # sigma=rad(covarianta)

    sigma_X = np.sqrt(np.sum((X - mod_X) * (X - mod_X)) / (N - 1))
    sigma_Y = np.sqrt(np.sum((Y - mod_Y) * (Y - mod_Y)) / (N - 1))

    corr = cov / (sigma_X * sigma_Y)
    print(corr)





from data_file import get_data

# X=np.floor(np.random.random(N) * 6 + 1)
# Z=np.floor(np.random.random(N) * 6 + 1)
# Y=X+Z
#
dictionar=get_data("geyser")
# print(dictionar)

functie(dictionar['eruptions'],dictionar['waiting'])

plt.scatter(dictionar['eruptions'],dictionar['waiting'])
# plt.show()



# 2.regresia liniara
# pt gaiser
X=dictionar['eruptions']
Y=dictionar['waiting']

# print(X,Y)

# z=ax+by+c

a11=np.sum(X*X)
a12=np.sum(X)
a21=np.sum(X)
b11=np.sum(X*Y)
b21=np.sum(Y)

print(a11,a12,a21,N,b11,b21)

N=len(X)
A=np.array([[a11,a12],[a21,N]])
B=np.array([[b11],[b21]])

A_inv=np.linalg.inv(A)
sol=A_inv@B
# pune tot intr-un vector
sol=sol.flatten()
a=sol[0]
b=sol[1]

print(a, b)


plt.plot([min(X), max(X)], [a*min(X)+b, a*max(X)+b])
plt.show()
print(a*6+b)


