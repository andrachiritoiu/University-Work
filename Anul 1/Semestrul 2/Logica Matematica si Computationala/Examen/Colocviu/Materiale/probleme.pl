P01. Find the last element of a list.
ex:?- my_last(X,[a,b,c,d]).
X = d

my_last(T,[T]).
my_last(X,[H|T]):-my_last(X,T).



P02. Find the last but one element of a list.

my_last1(H,[H,T]).
my_last1(X,[H|T]):-my_last1(X,T).



P03.Find the K th element of a list.

element(H,[H|T],1).
element(X,[H|T],K):-element(X,T,M), K is M+1.



P04. Find the number of elements of a list.
nr([],0).
nr([H|T],X):- nr(T,M), X is M+1.



P05.Reverse a list.
rev([],[]).
rev([H|T], L):- rev(T,M), append(M,[H],L).


P06. Find out whether a list is a palindrome.
palindrom(L1):-rev(L1,R), L1==R.


P07 (**) Flatten a nested list structure.
Transform a list, possibly holding lists as elements into a flat list by replacing each list with its elements (recursively).
flatt([],[]).
# apeleaza pana cand ramane un singur element
flatt([H|T],X):-flatt(H,X1), flatt(T,X2), append(X1,X2,X).
flatt(L,[L]):-not(is_list(L)).



P08 (**) Eliminate consecutive duplicates of list elements.
compress([],[]).
compress([X],[X]).
compress([H1,H2|T1],[H1|T2]):- compress([H2|T1],T2), H1\==H2.
compress([H1,H1|T1],T2):- compress([H1|T1],T2).



