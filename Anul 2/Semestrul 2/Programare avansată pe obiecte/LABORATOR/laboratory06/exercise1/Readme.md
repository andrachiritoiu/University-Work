# Exercițiul 1 — Sistemul de management al angajaților

> **EXEMPLU:** Acest exercițiu este doar pentru familiarizare cu formatul și testarea automată. Următoarele exerciții vor avea cerințe mai avansate și vor fi punctate conform regulilor laboratorului.
> **Pachet:** `com.pao.laboratory06.exercise1`
> **Timp estimat:** ~35 min · **Teste automate:** da (`Test.java`)

---

## Scenariul

Ești responsabil de o aplicație internă pentru o companie. Aplicația primește de la
stdin o listă de angajați și un criteriu de sortare, și trebuie să afișeze lista sortată.

Pe viitor vor apărea noi criterii de sortare — arhitectura trebuie să fie ușor de extins
fără a modifica clasele existente.

---

## Cerința generală

Creează în pachetul `com.pao.laboratory06.exercise1` toate clasele necesare și
implementează `Main.java` care citește datele, sortează și afișează rezultatul.

**Nu există un singur mod corect de a structura clasele** — gândește-te la ce fiecare
clasă trebuie să știe și să facă, și separă responsabilitățile.

---

## Format input / output

```
<N>
<nume> <salariu>      (N linii)
<criteriu>
```

Criteriile posibile cresc pe parcursul celor trei părți (vezi mai jos).

Output: câte o linie per angajat în ordinea cerută, format `<nume> <salariu_double>`.

---

## Partea A — Sortare după salariu (crescător)

Criteriu de intrare: `by_salary`

Implementează sortarea naturală a angajaților după salariu crescător.

**Exemplu:**
```
Input:        Output:
3             Bob 3000.0
Alice 5000    Alice 5000.0
Bob 3000      Carol 7000.0
Carol 7000
by_salary
```

> 💡 Hint: există o interfață standard în Java care permite unui obiect să se compare
> cu alt obiect de același tip. `Arrays.sort` o folosește automat.

---

## Partea B — Sortare după nume (alfabetic)

Criteriu de intrare: `by_name`

Adaugă posibilitatea de a sorta după nume alfabetic, fără a modifica clasa `Angajat`.

**Exemplu:**
```
Input:        Output:
3             Alice 5000.0
Alice 5000    Bob 3000.0
Bob 3000      Carol 7000.0
Carol 7000
by_name
```

> 💡 Hint: există un mecanism standard pentru a defini criterii de sortare alternative,
> separat de clasa sortată. `Arrays.sort` are o variantă care acceptă acest obiect.

---

## Partea C — Sortare după salariu descrescător

Criteriu de intrare: `by_salary_desc`

Adaugă un al treilea criteriu. La egalitate de salariu, ordinea originală trebuie păstrată.

**Exemplu:**
```
Input:          Output:
4               Carol 7000.0
Alice 5000      Alice 5000.0
Bob 3000        Bob 3000.0
Carol 7000      Dave 3000.0
Dave 3000
by_salary_desc
```

> 💡 Hint: poți reutiliza criteriile deja existente — inversarea unei comparații
> se poate exprima simplu. Gândește-te și la cum tratezi egalitățile.

---

## Cum rulezi testele

Deschide `Test.java` și apasă **Run** în IntelliJ.
Directorul de lucru trebuie să fie rădăcina proiectului (`paoj-2026/`).
Vei vedea câte un bloc `Partea: partA / partB / partC` cu `[PASS]` / `[FAIL]` per test.
