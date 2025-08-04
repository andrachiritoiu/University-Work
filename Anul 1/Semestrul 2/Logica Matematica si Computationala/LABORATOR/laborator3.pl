# ex1:Definiti un predicat palindrome/1 care este adevarat daca lista primit˘a
# ca argument este palindrom (lista citita de la stanga la dreapta este
# identica cu lista citita de la dreapta la stanga).

rev([],[]).
# IN l -LISTA NOUA
rev([H|T], L) :- rev(T,N), append(N,[H],L).
# append - pune H la finalul rezultatului (L!,L2, rez)

palindrome(L) :- rev(L,L).



# ex2:Definiti un predicat remove duplicates/2 care sterge toate duplicatele
# din lista data ca prim argument si ıntoarce rezultatul ın al doilea
# argument

remove_duplicates([],[]).
#  2. Caz: H este deja în rezultat → nu-l adăugăm
remove_duplicates([H|L],M) :- remove_duplicates(L,M), member(H,M). 
# 3. Caz: H NU e în rezultat → îl păstrăm
remove_duplicates([H|L],[H|M]) :- remove_duplicates(L,M), not(member(H,M)).



# ex3:Definiti un predicat atimes/3 care sa fie adevarat exact atunci cand
# elementul din primul argument apare ın lista din al doilea argument de
# numarul de ori precizat ın al treilea argument.

atimes(_,[],0).
atimes(N,[N|T],X) :- atimes(N,T,Y), X is Y + 1.
atimes(N,[H|T],X) :- atimes(N,T,X), H \= N.

# Verifici că H este diferit de N cu H \= N (negare structurală)



# ex4:scrieti regulile care definesc comportamentul predicatului
# ajutator insert/3.

# Predicatul insertsort/2 sorteaza lista de pe primul argument folosind
# algoritmul insertion sort.
# insertsort([],[]).
# insertsort([H|T],L) :- insertsort(T,L1), insert(H,L1,L).

insertsort([],[]).
insertsort([H|T],L) :- insertsort(T,L1), insert(H,L1,L).

insert(X,[],[X]).
insert(X,[H|T],[X|[H|T]]) :- X < H.
insert(X,[H|T],[H|L]) :- X >= H, insert(X,T,L).





# ex5:: scrieti regulile care definesc comportamentul predicatului
# ajutator split/4.

quicksort([],[]).
quicksort([H|T],L) :- split(H,T,A,B), quicksort(A,M), quicksort(B,N),
                        append(M,[H|N],L).
split(_,[],[],[]).
split(X,[H|T],[H|A],B) :- H < X, split(X,T,A,B).
split(X,[H|T],A,[H|B]) :- H >= X, split(X,T,A,B).