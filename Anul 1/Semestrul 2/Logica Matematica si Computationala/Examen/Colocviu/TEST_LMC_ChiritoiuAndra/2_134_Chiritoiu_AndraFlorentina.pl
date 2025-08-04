%Chiritoiu Andra
%grupa 134
%varianta 2

%1.
expand_intervals([],[]).
expand_intervals([(N,M)|T],[H|R]):- expand_pair(N,M,H), expand_intervals(T,R).
expand_pair(N,M,[]):- N>=M.
expand_pair(N,M,[X|R]):- X is N + 1, X =< M, expand_pair(X, M, R).

%expand_intervals([(1, 3), (5, 5), (4, 5), (5, 3), (2, 6)], R).
%R = [[2, 3], [], [5], [], [3, 4, 5, 6]]



%2
div_concat([],[]).
div_concat(L,R):- append(L1,L2,L), append(L2,L1,R), L\=R,
                length(L,LenL),  length(L1,Len1),  length(L2,Len2),
                (divi(LenL, Len1); divi(LenL, Len2)).
divi(LenL,LenR):- LenR=\=0, 0 is LenL mod LenR.

%div_concat([1, 2, 3, 4, 5, 6, 7, 8, 9], R).
%R = [2, 3, 4, 5, 6, 7, 8, 9, 1]
%R = [4, 5, 6, 7, 8, 9, 1, 2, 3]
%R = [7, 8, 9, 1, 2, 3, 4, 5, 6]
%R = [9, 1, 2, 3, 4, 5, 6, 7, 8]


%3
%a)
orVars(X) :- atom(X).
orVars(sau(X,Y)):- orVars(X), orVars(Y).
modif(V,[V]):- atom(V).
assoc_or(Phi,Psi):-orVars(Phi),orVars(Psi).


 