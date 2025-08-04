# ex1:Definiti un predicat vars/2 care este adevarat exact atunci cand primul
# argument este o formula, iar al doilea argument este lista care reprezint˘a
# multimea variabilelor care apar ın ea.


vars(V,[V]) :- atom(V).
vars(non(X),S) :- vars(X,S).
# T-lista de variabile din X
vars(si(X,Y),S) :- vars(X,T), vars(Y,U), union(T,U,S).
vars(sau(X,Y),S) :- vars(X,T), vars(Y,U), union(T,U,S).
vars(imp(X,Y),S) :- vars(X,T), vars(Y,U), union(T,U,S).



# ex2:ˆIn teoria mult¸imilor, graficul unei funct¸ii de la o mult¸ime A la o mult¸ime
# B este ”
# implementat” ca o submult¸ime a lui A × B.
# ˆIn acest fel vom
# implementa ¸si evalu˘arile propozit¸ionale de forma e : V → {0, 1}, unde V,
# spre deosebire de curs/seminar, va fi o mult¸ime (list˘a) finit˘a de variabile.
# De exemplu, o evaluare pe mult¸imea de variabile {a, b} poate fi
# [(a,1),(b,0)].
# Definit¸i un predicat val/3, astfel ˆıncˆat, pentru orice variabil˘a V ¸si orice
# evaluare E, avem c˘a, pentru orice A, val(V,E,A) este adev˘arat exact
# atunci cˆand A este ”
# E(V)”.


val(V,[(V,A)|_],A).
val(V,[_|T],A) :- val(V,T,A).

%Solutie alternativa:

val(V,E,A) :- member((V,A),E).



# ex3:Definit¸i predicate bnon/2, bsi/3, bsau/3, bimp/3 care implementeaz˘a
# operat¸iile ¬, ∧, ∨, → pe mult¸imea {0, 1}.


bnon(0,1). bnon(1,0).
bsi(0,0,0). bsi(0,1,0). bsi(1,0,0). bsi(1,1,1).
bsau(0,0,0). bsau(0,1,1). bsau(1,0,1). bsau(1,1,1).
% X -> Y = (non X) sau Y
bimp(X,Y,Z) :- bnon(X,NX), bsau(NX,Y,Z).



# ex4:Definit¸i un predicat eval/3, astfel ˆıncˆat, pentru orice formul˘a X ¸si orice
# evaluare E, avem c˘a, pentru orice A, eval(X,E,A) este adev˘arat exact
# atunci cˆand A este ”
# E+(X)”.


eval(V,E,A) :- atom(V), val(V,E,A).
eval(non(X),E,A) :- eval(X,E,B), bnon(B,A).
eval(si(X,Y),E,A) :- eval(X,E,B), eval(Y,E,C), bsi(B,C,A).
eval(sau(X,Y),E,A) :- eval(X,E,B), eval(Y,E,C), bsau(B,C,A).
eval(imp(X,Y),E,A) :- eval(X,E,B), eval(Y,E,C), bimp(B,C,A).


# ex5:Definit¸i un predicat evals/3, astfel ˆıncˆat, pentru orice formul˘a X ¸si orice
# list˘a de evalu˘ari Es, avem c˘a, pentru orice As, evals(X,Es,As) este
# adev˘arat exact atunci cˆand As este lista rezultatelor evalu˘arii lui X ˆın
# fiecare dintre elementele lui Es.


evals(_,[],[]).
evals(X,[E|Es],[A|As]) :- eval(X,E,A), evals(X,Es,As).



# ex6:Definit¸i un predicat evs/2, astfel ˆıncˆat, pentru orice list˘a de variabile S,
# avem c˘a, pentru orice Es, evs(S,Es) este adev˘arat exact atunci cˆand Es
# este lista evalu˘arilor definite pe S.


evs([],[[]]).
evs([V|T],Es) :- evs(T,Esp), adauga(V,Esp,Es).
adauga(_,[],[]).
adauga(V,[E|T], [[(V,0)|E],[(V,1)|E]|Es]) :- adauga(V,T,Es).


# ex7:Definit¸i un predicat all evals/2, astfel ˆıncˆat, pentru orice formul˘a X,
# avem c˘a, pentru orice As, all evals(X,As) este adev˘arat exact atunci
# cˆand As este lista rezultatelor evalu˘arii lui X ˆın fiecare dintre elementele
# listei evalu˘arilor definite pe Var(X).


all_evals(X,As) :- vars(X,S), evs(S,Es), evals(X,Es,As).


# ex8:Definit¸i un predicat taut/1, astfel ˆıncˆat, pentru orice formul˘a X, avem c˘a
# taut(X) este adev˘arat exact atunci cˆand X este tautologie.

all_ones([]).
all_ones([1|T]) :- all_ones(T).
taut(X) :- all_evals(X,As), all_ones(As).