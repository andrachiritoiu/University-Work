# Exercițiul 1 — Coadă de tranzacții cu LinkedList și Iterator

> **Pachet:** `com.pao.laboratory10.exercise1`
> **Timp estimat:** ~40 min · **Teste automate:** da (`Checker.java`, 2 părți)

---

## Scop

Sistemul bancar menține o coadă de tranzacții în așteptare. Operatorii pot adăuga tranzacții ca într-o coadă FIFO (cu `ENQUEUE` / `DEQUEUE`) sau ca într-o stivă LIFO (cu `PUSH` / `POP`), pot vizualiza coada și pot elimina în bloc tranzacțiile de un anumit tip sau sub un prag. Eliminările **trebuie** să folosească `Iterator.remove()` — singura metodă sigură în iterație.

---

## Cerință generală

Creează în pachetul `com.pao.laboratory10.exercise1`:

- `enum TipTranzactie { CREDIT, DEBIT }`
- `class Tranzactie` cu câmpurile: `int id`, `double suma`, `String data` (yyyy-MM-dd), `TipTranzactie tip`
  - constructori, getteri, `toString()` → `[id] data tip: suma RON` (ex: `[1] 2024-01-10 CREDIT: 500.00 RON`)
- `Main.java` cu protocol de comenzi descris mai jos, folosind `LinkedList<Tranzactie>` intern

---

## Format input

Comenzile se citesc din stdin până la EOF, câte una pe linie.

## Format output

**Format linie tranzacție:**
```
[id] data tip: suma RON
```

**Comenzi disponibile:**

| Comandă | Operație LinkedList | Output |
|---------|---------------------|--------|
| `ENQUEUE id suma data tip` | `addLast` | *(niciun output)* |
| `DEQUEUE` | `removeFirst` | `Procesat: [id] data tip: suma RON` sau `Coada goala.` |
| `PUSH id suma data tip` | `addFirst` | *(niciun output)* |
| `POP` | `removeFirst` | `Extras: [id] data tip: suma RON` sau `Coada goala.` |
| `REMOVE_DEBIT` | `Iterator.remove()` pe DEBIT | `Eliminat N tranzactii DEBIT.` |
| `REMOVE_BELOW threshold` | `Iterator.remove()` pe suma < threshold | `Eliminat N tranzactii sub threshold RON.` |
| `PRINT` | iterare | Toate tranzacțiile, câte una pe linie |
| `SIZE` | `size()` | `Dimensiune coada: N` |

---

## Partea A — Operații de bază (ENQUEUE, DEQUEUE, PUSH, POP, PRINT, SIZE)

Implementează operațiile de bază ale cozii. `DEQUEUE` și `POP` ambele fac `removeFirst()`, dar cu mesaj diferit. La coadă goală afișează `Coada goala.`.

**Exemplu:**
```
Input:                          Output:
ENQUEUE 1 500.00 2024-01-10 CREDIT
ENQUEUE 2 300.00 2024-01-15 DEBIT
SIZE                            Dimensiune coada: 2
PRINT                           [1] 2024-01-10 CREDIT: 500.00 RON
                                [2] 2024-01-15 DEBIT: 300.00 RON
DEQUEUE                         Procesat: [1] 2024-01-10 CREDIT: 500.00 RON
DEQUEUE                         Procesat: [2] 2024-01-15 DEBIT: 300.00 RON
DEQUEUE                         Coada goala.
```

---

## Partea B — Eliminare cu Iterator (REMOVE_DEBIT, REMOVE_BELOW)

Implementează eliminările în bloc. Folosește `Iterator<Tranzactie>` explicit — **nu** `enhanced-for` (ar arunca `ConcurrentModificationException`).

`REMOVE_DEBIT` elimină toate tranzacțiile de tip DEBIT.
`REMOVE_BELOW threshold` elimină toate tranzacțiile cu `suma < threshold`.

Afișează numărul de tranzacții eliminate, chiar dacă este 0.

**Exemplu:**
```
Input:                             Output:
ENQUEUE 1 500.00 2024-01-10 CREDIT
ENQUEUE 2 50.00 2024-01-15 DEBIT
ENQUEUE 3 150.00 2024-02-01 CREDIT
REMOVE_BELOW 100.00                Eliminat 1 tranzactii sub 100.00 RON.
PRINT                              [1] 2024-01-10 CREDIT: 500.00 RON
                                   [3] 2024-02-01 CREDIT: 150.00 RON
```

---

## Hint-uri

- `LinkedList<E>` implementează `Deque<E>` — `addFirst` / `addLast` / `removeFirst` sunt **O(1)**; `ArrayList.addFirst` ar fi **O(n)**
- `enhanced-for` pe o `LinkedList` la care adaugi / elimini → `ConcurrentModificationException`
- Șablon `Iterator.remove()`:
  ```java
  Iterator<Tranzactie> itr = coada.iterator();
  while (itr.hasNext()) {
      Tranzactie t = itr.next();
      if (condiție) itr.remove();
  }
  ```
- `Double.parseDouble(scanner.next())` pentru suma; `TipTranzactie.valueOf(scanner.next())` pentru tip
