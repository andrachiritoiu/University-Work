# lab 3

import numpy as np
#
# # 1. Se consideră două intervale închise [c,d] ⊆ [a,b]. Folosind funcția np.random.random()
# #  de generare a unui număr aleator din intervalul [0,1), determinați empiric probabilitatea
# #  ca un număr aleator din [a,b] să se afle în [c,d].
#
# a=int(input("a= "))
# b=int(input("b= "))
# c=int(input("c= "))
# d=int(input("d= "))
#
#
# k=1000
# cnt=0
#
# for i in range(k):
#     nr = np.random.random()*(b-a)+a
#     if nr>=c and nr<=d:
#         cnt+=1
#
# print(cnt/k)




# 2.(Aria unei figuri stelate din plan)
# #  Vrem să folosim simulări aleatoare pentru a estima aria unei figuri stelate, de tipul:
# #  Ω={(rcos(θ),rsin(θ)) : θ ∈ [0,2π], r ∈ [0,ρ(θ)]},
# #  unde ρ : [0,2π] → (0,R] este o funcție periodică (i.e., ρ(0) = ρ(2π)) iar valoarea R > 0
# #  este cunoscută.
#
# def is_in_omega(x,y,rho):
#     # Verifică dacă punctul (x, y) se află în regiunea Omega -steluta- , dată de functia rho(theta)
#     # Calculează unghiul theta al punctului (x, y)
#     my_theta=np.arctan2(y,x)
#
#     # Calculează distanța 'r' (raza)
#     r = np.linalg.norm(np.array([x, y]))
#     return r <= rho(my_theta)
#
#
# def estimeaza_aria(R, rho_func, N=1000000):
# # param R: Raza maximă, definește pătratul de referință [-R, R] x [-R, R].
# # param rho_func: Funcția rho(theta) care definește conturul figurii.
# # param N: Numărul de simulări.
# # return: Aria estimată.
#
#     # Aria regiunii de referință (Pătratul de latură 2R)
#     Aria_ref = (2 * R) ** 2
#
#     # Generarea Punctelor Aleatoare (N puncte in [-R, R] x [-R, R])
#     x = np.random.uniform(-R, R, N)
#     y = np.random.uniform(-R, R, N)
#
#     # Verificarea apartenenței pentru fiecare punct
#     puncte_in_omega = is_in_omega(x, y, rho_func)
#
#     # Contorizarea cazurilor favorabile
#     # np.sum(boolean_array) numără True-urile (puncte in Ω)
#     numar_puncte_in_omega = np.sum(puncte_in_omega)
#
#     Aria_estimata = (numar_puncte_in_omega / N) * Aria_ref
#
#     return Aria_estimata
#
#
import math
# # i) R=4, rho(theta) = R (Disc)
# R_disc = 4
# rho_disc = lambda theta: R_disc
# aria_teoretica_disc = 16 * math.pi
# print(f"Aria: {aria_teoretica_disc:.4f}")
#
#
# # ii) R=4, rho(theta) = 3 + cos(4*theta) (Figură Stelată)
# R_stelata = 4
# rho_stelata = lambda theta: 3 + np.cos(4 * theta)
# aria_teoretica_stelata = (19 * math.pi) / 2
# print(f"Aria  {aria_teoretica_stelata:.4f}")




# 3.Pe podea sunt trasate linii paralele la distanța de 10cm una de alta. Calculați empiric
#  probabilitatea ca aruncând un băț de chibrit de 5cm pe podea, acesta să intersecteze una
#  dintre linii.

d = 10
l = 5
N = 1000000
cnt=0

for i in range(N):
    # un punct
    x = np.random.random()*d
    theta=np.random.random()*np.pi
    # sin e punctul proiectat pe axa ok unde se etrmina chibritul
    sin=np.sin(theta)*l/2
    if x-sin<0<x+sin or x-sin<d<x+sin:
        cnt+=1

print(N/cnt)




