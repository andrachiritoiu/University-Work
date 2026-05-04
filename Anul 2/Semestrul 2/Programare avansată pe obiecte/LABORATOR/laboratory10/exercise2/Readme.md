# Exercițiul 2 — Deduplicare și rapoarte lunare

> **Pachet:** `com.pao.laboratory10.exercise2`
> **Timp estimat:** ~40 min · **Teste automate:** da (`Checker.java`, flat)

---

## Scop

Un extras de cont primit de la bancă poate conține tranzacții duplicate (același `id` apare de două ori în export). Sistemul trebuie să identifice ID-urile unice (în ordinea primei apariții), să genereze rapoarte lunare și să sorteze / analizeze tranzacțiile. De asemenea, vei demonstra `ConcurrentModificationException` printr-un test deliberat.

---

## Import din exercițiul 1

```java
import com.pao.laboratory10.exercise1.Tranzactie;
import com.pao.laboratory10.exercise1.TipTranzactie;
```

---

## Format input

```
N
id suma data(yyyy-MM-dd) tip(CREDIT|DEBIT)
... (N linii, pot exista duplicate de id)
comandă*
```

Comenzile se citesc până la EOF. Lista internă păstrează **toate** cele N tranzacții (inclusiv duplicate).

## Format output

**Format linie tranzacție:** `[id] data tip: suma RON`

**Comenzi disponibile:**

| Comandă | Noțiune | Output |
|---------|---------|--------|
| `UNIQUE_IDS` | `LinkedHashSet<Integer>` | `IDs unice (N): [1, 2, 3, ...]` — id-uri în ordinea primei apariții, fără duplicate |
| `MONTHLY_REPORT` | `TreeMap<String, ...>` | Per lună sortată: `yyyy-MM: CREDIT X.XX RON, DEBIT Y.YY RON` |
| `TOP n` | `Collections.sort` + `subList` | `Top n:` urmat de n linii (suma descrescătoare, nu modifică lista internă) |
| `SORT_ASC` | `Collections.sort(Comparator)` | Lista sortată suma crescătoare; modifică lista internă |
| `SORT_DESC` | `Collections.sort(reversed)` | Lista sortată suma descrescătoare; modifică lista internă |
| `REVERSE` | `Collections.reverse` | Lista inversată față de starea curentă; modifică lista internă |
| `MIN_MAX` | `Collections.min/max` | `MIN: [id] data tip: suma RON` și `MAX: [id] data tip: suma RON` |
| `CME_DEMO` | try-catch `CME` | `ConcurrentModificationException prins: modificare in iteratie detectata.` |

> **MONTHLY_REPORT** afișează întotdeauna ambele tipuri per lună (`CREDIT 0.00 RON` dacă nu există tranzacții CREDIT în luna respectivă).

---

## Exemplu complet

```
Input:
4
1 1500.00 2024-01-15 CREDIT
2 750.50 2024-01-22 DEBIT
3 200.00 2024-02-05 CREDIT
4 1200.00 2024-02-18 DEBIT
SORT_ASC

Output:
[3] 2024-02-05 CREDIT: 200.00 RON
[2] 2024-01-22 DEBIT: 750.50 RON
[4] 2024-02-18 DEBIT: 1200.00 RON
[1] 2024-01-15 CREDIT: 1500.00 RON
```

---

## Hint-uri

- `LinkedHashSet<Integer>` — iterarea produce id-urile în ordinea primei inserări
- `TreeMap<String, double[]>` (sau `Map<String, double[]>`) — cheia = `data.substring(0, 7)`; valoarea = `[sumaCREDIT, sumaDEBIT]`; `TreeMap` sortează cheile lexicografic (yyyy-MM sortează cronologic)
- `Collections.sort(list, Comparator.comparingDouble(Tranzactie::getSuma))` — refolosești ideea de `Comparator` din Lab02/05/06
- **`CME_DEMO`:** `try { for (Tranzactie t : lista) lista.remove(t); } catch (ConcurrentModificationException e) { System.out.println("..."); }` — eroarea apare la prima iterație
- `TOP n` — creează o copie a listei, sortează copia descrescător, ia `subList(0, n)` — lista internă nu se modifică
