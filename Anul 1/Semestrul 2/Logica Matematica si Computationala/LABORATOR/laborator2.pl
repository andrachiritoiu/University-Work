# ?- 3+5 is 8.
# evalueaza doar ce e in drepata lui is

# 8 is 3 + X.
# eraore- ce e dupa x tebuie sa fie complet instantiat


ex1:distanta dintre 2 puncte

distance((A,B),(C,D),X) :- X is sqrt((C-A)**2 + (D-B)**2).


ex2:fibonacci

fib(0,1).
fib(1,1).
fib(N,X) :- 2 =< N, M is N - 1, fib(M, Y), P is N - 2, fib(P, Z), X is Y + Z.

fibo(0,0,1).
fibo(1,1,1).
fibo(N,Z,X) :- 2 =< N, M is N-1, fibo(M,Y,Z), X is Y + Z.
# n-poz,x-val n-1, y-val n

fibg(N,X) :- fibo(N,_,X).


ex3:patrat dintr-un simbol

line(0,_).
line(X,C):- X>0, Y is X-1, write(C), line(Y,C).

rectangle(0,_,_):-nl.
rectangle(X,Z,C):- X>0, Y is X-1, line(Z,C), nl, rectangle(Y,Z,C).
square(X,C) :- rectangle(X,X,C).
# un dreptunghi cu x randuri,z coloane ,folsoid caracterul c


ex4:toate el sunt a in lista

all_a([]).
all_a([a|X]):-all_a(X).

trans_a_b([],[]).
trans_a_b([a|X],[b|Y]):-trans_a_b(X,Y).


ex5:
# a) Scriet¸i un predicat scalarMult/3, al c˘arui prim argument este un
# ˆıntreg, al doilea argument este o list˘a de ˆıntregi, iar al treilea argument
# este rezultatul ˆınmult¸irii cu scalari al celui de-al doilea argument cu
# primul.


# _ -variabila anonima
scalarMult(_,[],[]).
scalarMult(N,[H|T],[X|Y]) :- X is N * H, scalarMult(N,T,Y).


# b)Scriet¸i un predicat dot/3 al c˘arui prim argument este o list˘a de
# ˆıntregi, al doilea argument este o list˘a de ˆıntregi de lungimea primeia, iar
# al treilea argument este produsul scalar dintre primele dou˘a argumente.

dot([],[],0).
dot([H|T],[X|Y],M) :- dot(T,Y,N), M is N + H * X.

EXEMPLU DE FUNCTIONARE:
dot([1,2,3], [4,5,6], M)
→ dot([2,3], [5,6], N), M is N + 1*4
→ dot([3], [6], K), N is K + 2*5
→ dot([], [], 0), K is 0 + 3*6 = 18
→ N is 18 + 10 = 28
→ M is 28 + 4 = 32


# c)Scrieti un predicat max/2 care cauta elementul maxim ıntr-o lista de
# numere naturale.

max([],0).
max([H|T],X) :- max(T,Y), maxim(H,Y,X).

maxim(A,B,B) :- B>A.
maxim(A,B,A) :- A>=B.

ex6:
# Am definit un predicat ancestor of(X,Y) care este adev˘arat dac˘a X
# este un stramos al lui Y.
# Definitia recursiva a predicatului ancestor of(X,Y) :
ancestor of(X,Y) :- parent(X,Y).
ancestor of(X,Y) :- parent(X,Z), ancestor of(Z,Y).
