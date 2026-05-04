# Exercițiul 1 — Serializarea istoricului de tranzacții bancare

> **Pachet:** `com.pao.laboratory09.exercise1`
> **Timp estimat:** ~45 min · **Teste automate:** da (`Checker.java`, 3 părți)

---

## Scop

Banca Digitală trebuie să salveze un lot de tranzacții zilnice într-un fișier binar și să le restaureze ulterior pentru interogare. Vei implementa serializarea și deserializarea unui obiect complex, observând comportamentul câmpurilor `transient` și garantând stabilitatea clasei cu `serialVersionUID`.

---

## Cerință generală

Creează în pachetul `com.pao.laboratory09.exercise1`:

- `enum TipTranzactie` cu valorile `CREDIT` și `DEBIT`
- `class Tranzactie implements Serializable` cu câmpurile: `id` (int), `suma` (double), `data` (String, format `yyyy-MM-dd`), `contSursa` (String), `contDestinatie` (String), `tip` (TipTranzactie), `transient String note`
  - `serialVersionUID = 1L`
  - `note` se setează la `"procesat"` înainte de serializare și devine `null` la deserializare
- `Main.java` cu protocolul de comenzi descris mai jos

**Fișier intermediar:** `output/lab09_ex1.ser` (relativ la rădăcina proiectului)

---

## Format input

```
N
id suma data(yyyy-MM-dd) contSursa contDestinatie tip(CREDIT|DEBIT)
... (N linii)
comandă*
```

Comenzile se citesc până la EOF.

## Format output

**Format linie tranzacție** (folosit de `LIST` și `FILTER`):
```
[id] data tip: suma RON | contSursa -> contDestinatie
```

**Comenzi disponibile:**

| Comandă | Output |
|---------|--------|
| `LIST` | Toate tranzacțiile deserializate, în ordinea serializării |
| `FILTER yyyy-MM` | Tranzacțiile cu `data` care începe cu `yyyy-MM`, sau `Niciun rezultat.` |
| `NOTE id` | `NOTE[id]: <valoarea câmpului note>` sau `NOTE[id]: not found` |

---

## Partea A — Serializare și LIST

Citește N tranzacții, setează `note = "procesat"` pe fiecare, serializează lista în `output/lab09_ex1.ser`, deserializează, apoi execută comanda `LIST`.

**Exemplu:**
```
Input:                       Output:
3                            [1] 2024-01-15 CREDIT: 1500.00 RON | RO01SRC1 -> RO01DST1
1 1500.00 2024-01-15 ...     [2] 2024-01-22 DEBIT: 750.50 RON | RO02SRC2 -> RO02DST2
...                          [3] 2024-02-05 CREDIT: 200.00 RON | RO01SRC1 -> RO03DST3
LIST
```

> Ordinea în output este ordinea originală de inserare (serializarea păstrează ordinea listei).

---

## Partea B — Filtrare lunară cu FILTER

Comandă suplimentară: `FILTER yyyy-MM` — afișează tranzacțiile al căror câmp `data` începe cu prefixul dat.

Dacă nu există nicio tranzacție în luna respectivă, afișează:
```
Niciun rezultat.
```

**Exemplu (fără rezultate):**
```
Input:          Output:
...             Niciun rezultat.
FILTER 2024-03
```

---

## Partea C — Câmpul transient și NOTE

Comandă suplimentară: `NOTE id` — afișează valoarea câmpului `note` al tranzacției cu `id`-ul dat, după deserializare.

Deoarece `note` este `transient`, valoarea sa devine `null` la deserializare, indiferent că a fost setată la `"procesat"` înainte de serializare.

**Exemplu:**
```
Input:          Output:
...             NOTE[1]: null
NOTE 1          NOTE[99]: not found
NOTE 99
```

> **De reținut:** câmpul `transient` nu participă la serializare. La deserializare primește valoarea implicită (`null` pentru obiecte, `0` pentru primitive, `false` pentru boolean).

---

## Hint-uri

- `ObjectOutputStream(new FileOutputStream(...))` / `ObjectInputStream(new FileInputStream(...))` — folosește `try-with-resources` pentru ambele
- `serialVersionUID` declarat explicit — fără el, JVM calculează automat un UID instabil care se poate schimba la recompilare
- `transient` pe câmpul `note` — marchează câmpul ca exclus din serializare
- Dacă `TipTranzactie` este `Serializable`? Nu este nevoie să implementeze — enum-urile din Java sunt implicit serializabile
- `List<Tranzactie>` implementează `Serializable` (ca și `ArrayList`) — poți serializa lista direct
