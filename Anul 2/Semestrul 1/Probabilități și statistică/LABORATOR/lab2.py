import numpy as np
import matplotlib.pyplot as plt

# Ex 1
# Situatia 1
# k=10000
# nr_c=0
# nr_p=0
# for i in range(k):
#     n = np.random.random()
#     if n > 0.5:
#         nr_c +=1
#     else:
#         nr_p += 1
#
# print("Probabilitatea empirica sa fie cap este de: ",nr_c/k)
# print("Probabilitatea empirica sa fie pajura este de: ",nr_p/k)

# plt.plot(nr_c)
# plt.plot(nr_p)
#
# plt.gca().set_xlim(-1.05,1.05)
# plt.gca().set_ylim(-1.05,1.05)
#
# plt.show()



# corect
# fig,ax=plt.subplots()   # il face automat pe ax=plt.gca()
# k=10000
# ax.plot([0,k],[0.5,0.5],color='r')
# prob_partial=[]
# cnt=0
#
# for i in range(k):
#     r=np.random.random()
#     #am dat cap
#     if r < 0.5:
#         cnt+=1
#     prob_partial.append(cnt/(i+1))   #incepe de la 0
# ax.plot(range(1,k+1),prob_partial,color='b')
# plt.show()




# Situatia 2 - 0.7 probailitattea sa de cap
# fig,ax=plt.subplots()   # il face automat pe ax=plt.gca()
# k=10000
# ax.plot([0,k],[0.5,0.5],color='r')
# prob_partial=[]
# cnt=0
#
# for i in range(k):
#     r=np.random.random()
#     #am dat cap
#     if r < 0.7:
#         cnt+=1
#     prob_partial.append(cnt/(i+1))
# ax.plot(range(1,k+1),prob_partial,color='b')
# plt.show()


# Ex 2
# # i
# k=10000
# prob_partial=[]
#
# for i in range(k):
#     s = ""
#     for j in range(20):
#         r=np.random.random()
#         if r < 0.5:
#             s+='c'
#         else:
#             s+='p'
#     if 'ccc' in s:
#         prob_partial.append(1)
#     else:
#         prob_partial.append(0)
#
# p_empirica = sum(prob_partial) / k
# print(p_empirica)
#
# # ii
# k=10000
# prob_partial=[]
#
# for i in range(k):
#     s = ""
#     for j in range(20):
#         r=np.random.random()
#         if r < 0.5:
#             s+='c'
#         else:
#             s+='p'
#     if 'cpcpcpcp' in s:
#         prob_partial.append(1)
#     else:
#         prob_partial.append(0)
#
# p_empirica = sum(prob_partial) / k
# print(p_empirica)
#
# # iii
# k=10000
# prob_partial=[]
#
# for i in range(k):
#     s = ""
#     for j in range(20):
#         r=np.random.random()
#         if r < 0.5:
#             s+='c'
#         else:
#             s+='p'
#     if ('cccc' in s) or ('pppp' in s):
#         prob_partial.append(1)
#     else:
#         prob_partial.append(0)
#
# p_empirica = sum(prob_partial) / k
# print(p_empirica)


#Ex 3
