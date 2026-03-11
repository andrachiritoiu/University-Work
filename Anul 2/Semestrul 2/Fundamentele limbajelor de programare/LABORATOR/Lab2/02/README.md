# Laboratorul 2 - Interpretoare pentru IMP

În acest laborator veți implementa interpretoare pentru limbajul IMP bazate pe
semanticile operaționale de tip big-step și small-step.

Structura proiectului:

- [`Syntax.hs`](Syntax.hs) conține sintaxa abstractă a limbajului `IMP`

- [`State.hs`](State.hs) conține definiția unei stări a execuției, asociind valori (întregi)  variabilelor de program

- [`Parser.hs`](Parser.hs) folosește ideile și o mare parte din codul de la  Laboratorul 1 pentru a transforma:

  - codul sursă a programului (e.g., [`test1.exp`](test1.exp)) în sintaxă abstractă

  - descrieri de stări (e.g., `n |-> 10, x |-> 14`) în reprezentări de stări

- [`BigStep.hs`](BigStep.hs) conține o schiță a implementării unui interpretor bazat pe semantica
  big-step. Implementați regulile lipsă și testați implementarea

- [`SmallStep.hs`](SmallStep.hs) conține o schiță a implementării unui interpretor bazat pe semantica
  small-step. Implementați regulile lipsă și testați implementarea

- [`Main.hs`](Main.hs) conține cod pentru a putea rula proiectul ca un interpretor.
  Programul compilat `ghc Main.hs -o lab2` ia următoarele argumente
  - un program sursă  (e.g., [`test1.exp`](test1.exp))
  - descrierea unei stări (e.g., `"n |-> 10, x |-> 14"`)
  - un șir `parse | bs | one | ss | trace` care controlează tipul de execuție dorit:
    - `parse` doar afișează configurația inițială, fără a executa
    - `bs` apeleaza intepretorul big-step
    - `one` execută un singur pas small-step
    - `ss` apelează interpretorul small-step
    - `trace` apelează interpretorul small-step și înregistrează toate
      configurațiile intermediare.

## Testare

În afară de testele din fișierele sursă (liniile care încep cu `>>>`), puteți rula și testele pentru fișierul executabil, astfel

- Conținutul fișierului [`tests/test.exp.parse`](tests/test.exp.parse) este obținut cu comanda:

  ```
  ./lab2 tests/test1.exp "" parse
  ```

- Conținutul fișierului [`tests/test.exp.bs.n_10`](tests/test.exp.bs.n_10) este obținut cu comanda:

  ```
  ./lab2 test1.exp "n |-> 10" bs
  ```

- Conținutul fișierului [`tests/test.exp.one.n_10`](tests/test.exp.one.n_10) este obținut cu comanda:

  ```
  ./lab2 test1.exp "n |-> 10" one
  ```

- Conținutul fișierului [`tests/test.exp.ss.n_10`](tests/test.exp.ss.n_10) este obținut cu comanda:

  ```
  ./lab2 test1.exp "n |-> 10" ss
  ```

- Conținutul fișierului [`tests/test.exp.trace.n_1`](tests/test.exp.trace.n_1) este obținut cu comanda:

  ```
  ./lab2 test1.exp "n |-> 1" trace
  ```
