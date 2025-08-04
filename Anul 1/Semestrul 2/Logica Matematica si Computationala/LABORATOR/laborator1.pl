# lab1

# 1.Sa se coloreze o harta data cu un numar minim de culori astfel ıncat
# oricare doua tari vecine sa fie colorate diferit.

culoare(albastru).
culoare(rosu).
culoare(verde).
culoare(galben).

harta(RO,SE,MD,UA,BG,HU) :- vecin(RO,SE), vecin(RO,UA),
vecin(RO,MD), vecin(RO,BG),
vecin(RO,HU), vecin(UA,MD),
vecin(BG,SE), vecin(SE,HU).

vecin(X,Y) :- culoare(X),
culoare(Y),
X \== Y.

# 2.
bigger(elephant, horse).
bigger(horse, donkey).
bigger(donkey, dog).
bigger(donkey, monkey).

is_bigger(X, Y) :-
    bigger(X, Y).                 % Caz de bază (relație directă)

is_bigger(X, Y) :-
    bigger(X, Z),
    is_bigger(Z, Y).             % Caz recursiv (relație indirectă)


# 3.Sa presupunem ca avem o lista de fapte cu perechi de oameni casatorit¸i
# ıntre ei:

# \+ se nume¸ste negation as failure

# ?- \+ animal(elephant).
# true.   % Pentru că elephant NU este în baza de date

# ?- \+ animal(dog).
# false.  % Pentru că dog ESTE un animal în baza de date

married(peter, lucy).
married(paul, mary).
married(bob, juliet).
married(harry, geraldine).

# Putem sa definim un predicat single/1 care reuseste daca argumentul
# sau nu este nici primul nici al doilea argument ın faptele pentru married.

#echivalent cu \+ == not() 

single(Person) :-
\+ married(Person, _),
\+ married(_, Person).

# 4.Fisierul ex2.pl cont¸ine o baz˘a de cuno¸stint¸e reprezentˆand un arbore
# genealogic.

father_of(Father, Child):-male(Father),parent(Father, Child).
grandfather_of(Grandfather, Child):-father_of(Grandfather,Parent),parent(Parent,Child).
sister_of(Sister,Person):- female(Sister), parent(Parent,Person), parent(Parent,Sister), Sister\==Person.
aunt_of(Aunt,Person):-female(Aunt),parent(Parent,Person),sister_of(Aunt,Parent).

# 5.Definim predicatul not parent folosind operatorul de negatie introdus
# mai devreme:
not parent(X,Y) :- not(parent(X,Y)).
sau
not parent(X,Y) :- \+ parent(X,Y).
