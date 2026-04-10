# Exercițiul 3 (BONUS) — Analiză cu Stream API pentru comenzi

> **Pachet:** `com.pao.laboratory07.exercise3`
> **Timp estimat:** ~30 min · **Teste automate:** nu (demonstrație în `Main.java`)

---

## Scop

Extinde clasele `Comanda` din exercițiul 2 (adaugă câmpul `client`) și implementează operații de analiză și filtrare folosind **Stream API**.

---

## Extensia claselor din Exercițiul 2

Refolosește ierarhia sealed din exercițiul 2. Adaugă câmpul `String client` la clasa `Comanda`:

```java
public abstract sealed class Comanda permits ComandaStandard, ComandaRedusa, ComandaGratuita {
    protected String nume;
    protected String client;  // ← ADAUG ACEASTA
    // ...
}
```

---

## Structura inputului

- Prima linie: numărul de comenzi `N`
- Următoarele `N` linii, fiecare în formatul din exercițiul 2, urmat de clientul comenzii:
  - `STANDARD <nume> <pret> <client>`
  - `DISCOUNTED <nume> <pret> <discountProcent> <client>`
  - `GIFT <nume> <client>`
- Următoarele linii: comenzi (`STATS`, `FILTER <threshold>`, `SORT`, `SPECIAL`, `QUIT`)

---

## Structura outputului

**Pentru fiecare comandă**, pe câte o linie (format din exercițiul 2):
```
STANDARD: <nume>, pret: X.XX lei [PLACED] - client: <client>
```

**Apoi, la fiecare comandă primită:**

- `STATS` — Afișează mediile prețurilor finale grupate pe tip (STANDARD, DISCOUNTED, GIFT)
- `FILTER <threshold>` — Afișează comenzile cu preț final ≥ threshold
- `SORT` — Afișează comenzile sortate după client, apoi după preț final (crescător)
- `SPECIAL` — Afișează comenzile cu discont mai mare de 15% (dacă sunt DISCOUNTED)
- `QUIT` — Programul se termină

---

## Exemplu complet

**Input:**
```
5
STANDARD Laptop 2500.0 Alice
DISCOUNTED Headphones 200.0 20 Bob
GIFT Sticker Charlie
STANDARD Mouse 80.0 Alice
DISCOUNTED Keyboard 300.0 10 Dave
STATS
FILTER 100
SORT
SPECIAL
QUIT
```

**Output (exemplu cu flexibilitate):**
```
STANDARD: Laptop, pret: 2500.00 lei [PLACED] - client: Alice
DISCOUNTED: Headphones, pret: 160.00 lei (-20%) [PLACED] - client: Bob
GIFT: Sticker, gratuit [PLACED] - client: Charlie
STANDARD: Mouse, pret: 80.00 lei [PLACED] - client: Alice
DISCOUNTED: Keyboard, pret: 270.00 lei (-10%) [PLACED] - client: Dave

--- STATS ---
STANDARD: medie = 1290.00 lei
DISCOUNTED: medie = 215.00 lei
GIFT: medie = 0.00 lei

--- FILTER (>= 100.00) ---
STANDARD: Laptop, pret: 2500.00 lei - client: Alice
DISCOUNTED: Headphones, pret: 160.00 lei - client: Bob
DISCOUNTED: Keyboard, pret: 270.00 lei - client: Dave

--- SORT (by client, then by pret) ---
STANDARD: Mouse, pret: 80.00 lei - client: Alice
STANDARD: Laptop, pret: 2500.00 lei - client: Alice
DISCOUNTED: Keyboard, pret: 270.00 lei - client: Dave
DISCOUNTED: Headphones, pret: 160.00 lei - client: Bob
GIFT: Sticker, gratuit - client: Charlie

--- SPECIAL (discount > 15%) ---
DISCOUNTED: Headphones, pret: 160.00 lei (-20%) - client: Bob
```

---

## Indicații

Utilizează următoarele concepte Java:
- `Stream.collect(groupingBy(...))` pentru grupare și `averagingDouble()` pentru medii
- `stream().filter(...).toList()` pentru filtrare
- `Comparator.comparing(...).thenComparing(...)` pentru sortare compusă
- `instanceof` pattern matching pentru identificarea tipului comenzii
- Excepții custom pentru input invalid

---

## Testare

Demonstrează în `Main.java` toate operațiile de mai sus. Output-ul trebuie să fie clar și ușor de urmărit.

Se acordă **0.4% bonus** la nota finală dacă exercițiul este complet și funcțional.
