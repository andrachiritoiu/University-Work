# Exercițiul 3 (BONUS) — Extrase de cont lunare cu Stream API

> **Pachet:** `com.pao.laboratory10.exercise3`
> **Timp estimat:** ~30 min · **Fără teste automate** — demonstrație în `Main.java`

---

## Scop

Generarea extraselor de cont lunare cu Stream API — pasul final al narativului BancaDigitala. Datele sunt în memorie; acum le analizezi elegant fără bucle explicite, folosind `filter`, `map`, `Collectors.groupingBy` și `summingDouble`. Aceasta este finalizarea operației de „generate invoices grouped by month" planificate pentru sistem.

---

## Noțiuni demonstrate

- `stream().filter()` — filtrare pe criteriu
- `stream().mapToDouble().sum()` — agregare numerică
- `Collectors.groupingBy()` + `Collectors.summingDouble()` — grupare + sumare per grup
- `stream().sorted().limit()` — sortare și trunchiere
- `stream().map().distinct().collect()` — proiecție + deduplicare
- `stream().mapToDouble().average()` — medie
- Streams sunt **lazy și single-use** — pornești `stream()` de la zero pentru fiecare operație

---

## Cerințe minime pentru `Main.java`

Definește minim 10 tranzacții hardcodate acoperind cel puțin 3 luni diferite, cu ambele tipuri CREDIT și DEBIT.

Demonstrează **7 operații**, fiecare precedată de un titlu afișat la consolă:

| # | Operație | Output |
|---|---------|--------|
| 1 | `filter(tip == CREDIT)` | Lista tuturor tranzacțiilor CREDIT |
| 2 | `mapToDouble(suma).sum()` | `Total procesat: X.XX RON` |
| 3 | `Collectors.groupingBy(luna, summingDouble(suma))` | Per lună: `yyyy-MM: X.XX RON` |
| 4 | `sorted(comparingDouble.reversed()).limit(3)` | `Top 3 tranzactii:` + 3 linii |
| 5 | `map(contSursa).distinct().collect(toList())` | `Conturi sursa unice: [CONT_A, CONT_B, ...]` |
| 6 | `mapToDouble(suma).average()` | `Suma medie: X.XX RON` |
| 7 | `Collectors.groupingBy(luna)` cu format extras | `EXTRAS DE CONT - yyyy-MM: N tranzactii, total: X.XX RON` per lună |

> **Notă operația 5:** pentru această demonstrație extinde clasa `Tranzactie` locală cu un câmp `contSursa` sau folosește o structură proprie — libertate totală de implementare.

---

## Libertate de implementare

Ordinea outputului, formatarea exactă și datele demo sunt alese de student. Important: toate cele 7 operații sunt demonstrate și outputul este clar etichetat cu un titlu înainte de fiecare bloc de rezultate.

---

## Hint-uri

- Grupare pe lună: `Collectors.groupingBy(t -> t.getData().substring(0, 7))`
- Suma per grup: `Collectors.groupingBy(cheie, Collectors.summingDouble(Tranzactie::getSuma))`
- `OptionalDouble avg = stream().mapToDouble(...).average()` — `.getAsDouble()` sau `.orElse(0.0)`
- Streams sunt lazy și single-use — un `stream()` poate fi consumat o singură dată; creează unul nou pentru fiecare operație
- `Collectors.toUnmodifiableList()` sau `Collectors.toList()` pentru colectare
- `TreeMap` pe rezultatul `groupingBy` dacă vrei luni sortate: `Collectors.groupingBy(..., TreeMap::new, Collectors.summingDouble(...))`
