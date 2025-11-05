# lab 5
import numpy as np

# # 1. (Probabilități condiționate)
# #  Cu ochii închiși, aruncăm două zaruri, iar cineva ne spune că suma lor este S. Care
# #  sunt șansele ca primul zar să aibă valoarea V ? Testați empiric, prin simulări repetate,
# #  următoarele situații:
#
#
# def simuleaza_prob_zaruri(S_dorita, V_dorita, simulari):
#     cnt_suma_s=0
#     cnt_caz_fav=0  #ambele conditii
#
#     for i in range (simulari):
#         zar1=np.random.randint(1,7)
#         zar2=np.random.randint(1,7)
#         suma = zar1+zar2
#         if suma == S_dorita:
#             cnt_suma_s+=1
#             if zar1 == V_dorita:
#                 cnt_caz_fav+=1
#
#     if cnt_caz_fav!=0:
#          return cnt_caz_fav / cnt_suma_s
#     return 0
#
#
# numar_simulari = 10000
#
# # a)S =7, V =2;
# P1_sim = simuleaza_prob_zaruri(S_dorita=7, V_dorita=2, simulari=numar_simulari)
# print(P1_sim)
#
# # b)S =8, N =2;
# P2_sim = simuleaza_prob_zaruri(S_dorita=8, V_dorita=2, simulari=numar_simulari)
# print(P2_sim)
#
# #c)S =8, N =1;
# P3_sim = simuleaza_prob_zaruri(S_dorita=8, V_dorita=1, simulari=numar_simulari)
# print(P3_sim)
#
# #d)S =14, N =2.
# P4_sim = simuleaza_prob_zaruri(S_dorita=14, V_dorita=2, simulari=numar_simulari)
# print(P4_sim)


# # cu 3 zaruri
# def simuleaza_prob_trei_zaruri(S_dorita, V_dorita, simulari):
#     cnt_suma_S = 0
#     cnt_caz_fav = 0
#
#     for _ in range(simulari):
#         zar1 = np.random.randint(1, 7)
#         zar2 = np.random.randint(1, 7)
#         zar3 = np.random.randint(1, 7)
#         suma = zar1 + zar2 + zar3
#
#         if suma == S_dorita:
#             cnt_suma_S += 1
#             if zar1 == V_dorita:
#                 cnt_caz_fav += 1
#
#     if cnt_suma_S == 0:
#         return 0.0
#
#     return cnt_caz_fav / cnt_suma_S
#
# numar_simulari = 10000
# S_trei = 15
# V_primul = 3
#
# P_sim = simuleaza_prob_trei_zaruri(S_dorita=S_trei, V_dorita=V_primul, simulari=numar_simulari)
# print(P_sim)




# # 2.La aruncarea cu două zaruri, considerăm următoarele evenimente
# # A= ”primul zar are valoarea 1”;
# # B= ”al doilea zar are valoarea 6”;
# # C= ”suma zarurilor este 7”.
#
#
# # 2.1  A și B sunt independente;
# def simuleaza_prob_zaruri(V1_dorita, V2_dorita, simulari):
#     cnt_val1=0
#     cnt_val2=0
#     cnt_caz_fav=0  #ambele conditii
#
#     for i in range (simulari):
#         zar1=np.random.randint(1,7)
#         zar2=np.random.randint(1,7)
#
#         if zar1 == V1_dorita:
#             cnt_val1+=1
#         if zar2 == V2_dorita:
#             cnt_val2+=1
#             if zar1 == V1_dorita:
#                 cnt_caz_fav+=1
#
#     P_A_empiric=cnt_val1/simulari
#     P_B_empiric=cnt_val2/simulari
#     P_inter_empiric=cnt_caz_fav/simulari
#
#     produs_prob = P_A_empiric*P_B_empiric
#
#     # print(P_inter_empiric)
#     # print(produs_prob)
#
#     return P_inter_empiric == produs_prob
#
#
# numar_simulari = 10000
# P_sim1 = simuleaza_prob_zaruri(V1_dorita=1, V2_dorita=6 ,simulari=numar_simulari)
# print(P_sim1)
#
#
#
# # 2.2  A și C sunt independente;
# def simuleaza_prob_zaruri(V1_dorita, S_dorita, simulari):
#     cnt_val1=0
#     cnt_S_dorita=0
#     cnt_caz_fav=0  #ambele conditii
#
#     for i in range (simulari):
#         zar1=np.random.randint(1,7)
#         zar2=np.random.randint(1,7)
#
#         if zar1 == V1_dorita:
#             cnt_val1+=1
#         if zar1+zar2==S_dorita :
#                 cnt_S_dorita+=1
#                 if zar1 == V1_dorita:
#                     cnt_caz_fav+=1
#
#     P_A_empiric = cnt_val1 / simulari
#     P_C_empiric = cnt_S_dorita / simulari
#     P_inter_empiric = cnt_caz_fav / simulari
#
#     produs_prob = P_A_empiric * P_C_empiric
#
#     # print(P_inter_empiric)
#     # print(produs_prob)
#
#     return P_inter_empiric == produs_prob
#
#
# numar_simulari = 10000
# P_sim2 = simuleaza_prob_zaruri(V1_dorita=1, S_dorita=7 ,simulari=numar_simulari)
# print(P_sim2)
#
#
#
# # 2.3 A și B si C sunt independente;
# def simuleaza_prob_zaruri(S_dorita, V1_dorita, V2_dorita, simulari):
#     cnt_suma_s=0
#     cnt_val1=0
#     cnt_val2=0
#     cnt_caz_fav=0
#
#     for i in range (simulari):
#         zar1=np.random.randint(1,7)
#         zar2=np.random.randint(1,7)
#         suma = zar1+zar2
#         if suma == S_dorita:
#             cnt_suma_s+=1
#             if zar1==V1_dorita and zar2==V2_dorita:
#                 cnt_caz_fav += 1
#         if zar1 == V1_dorita:
#             cnt_val1+=1
#         if zar2==V2_dorita:
#             cnt_val2+=1
#
#     P_A_empiric = cnt_val1 / simulari
#     P_B_empiric = cnt_val1 / simulari
#     P_C_empiric = cnt_suma_s / simulari
#     P_inter_empiric = cnt_caz_fav / simulari
#
#     produs_prob = P_A_empiric * P_B_empiric * P_C_empiric
#
#     return P_inter_empiric == produs_prob
#
# P_sim3 = simuleaza_prob_zaruri(S_dorita=7, V1_dorita=1, V2_dorita=6 ,simulari=numar_simulari)
# print(P_sim3)


# 3. Probabilitatea de a mă întâlni în metrou cu o persoană cunoscută când vin spre facultate
#  este p = 9%.

# #3.1 Într-o lună, ce este mai probabil? Să nu mă întâlnesc cu nicio persoană cunoscută în
# # metrou, sau să existe 5 zile în care mă văd cu cineva? Răspundeți la întrebare prin
# # simulări repetate.
#
# p=9
# N=10000
#
# int_zero=0
# int_da=0
# for _ in range(N):
#     nr_persoane=0
#     for i in range(30):
#         if np.random.random()<=9/100:
#             nr_persoane+=1
#     if nr_persoane == 0:
#         int_zero+=1
#     if nr_persoane == 5:
#         int_da+=1
#
# print(int_zero)
# print(int_da)


# # 3.2 Realizați histograma numărului de zile pe lună în care mă văd cu un cunoscut în
# #  metrou.
import matplotlib.pyplot as plt
#
# # v1
# fig, ax=plt.subplots()
# probabilitati = np.zeros(31)
# p=9
# N=10000
#
# int_zero=0
# int_da=0
# for _ in range(N):
#     nr_persoane=0
#     for i in range(30):
#         if np.random.random()<=9/100:
#             nr_persoane+=1
#     probabilitati[nr_persoane]+=1
#     if nr_persoane == 0:
#         int_zero+=1
#     if nr_persoane == 5:
#         int_da+=1
#
# ax.bar(range(31), probabilitati/N)
# plt.show()


# # v2
fig, ax=plt.subplots()
v=[]
p=9
N=100000

int_zero=0
int_da=0
for _ in range(N):
    nr_persoane=0
    for i in range(31):
        if np.random.random()<=9/100:
            nr_persoane+=1
    v.append(nr_persoane)
    if nr_persoane == 0:
        int_zero+=1
    if nr_persoane == 5:
        int_da+=1

ax.hist(v, bins=range(31), density=True, rwidth=0.9)
plt.show()