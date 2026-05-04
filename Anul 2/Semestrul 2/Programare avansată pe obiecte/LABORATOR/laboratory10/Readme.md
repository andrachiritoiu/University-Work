# Laboratory 10 — Java Collections Framework: LinkedList, Iterator și Stream API

> **Pachet:** `com.pao.laboratory10` · **Curs:** 10
> **Data limită:** miercuri 21 mai 2026, ora 23:59

---

## Noțiuni teoretice

### LinkedList — Listă dublu înlănțuită

`LinkedList<E>` implementează atât `List<E>` cât și `Deque<E>`. Spre deosebire de `ArrayList`, operațiile `addFirst` / `removeFirst` sunt **O(1)**, dar accesul prin index `get(i)` este **O(n)**. Folosește `LinkedList` când ai nevoie de inserări / ștergeri frecvente la capete (coadă FIFO sau stivă LIFO). Metode cheie: `addFirst`, `addLast`, `removeFirst`, `removeLast`, `peekFirst`, `peekLast`.

### Iterator explicit și ConcurrentModificationException

`enhanced-for` nu permite modificarea colecției în timpul iterației — orice `add()` sau `remove()` aruncă `ConcurrentModificationException`. Soluția: `Iterator<E> itr = col.iterator(); while(itr.hasNext()) { if(...) itr.remove(); }` — `itr.remove()` este singura ștergere sigură în iterație. `ConcurrentModificationException` apare și **single-thread**, nu doar în multi-thread.

### Clasa `Collections` — metode utilitare

`Collections.sort(list, comparator)` — sortare (refolosești `Comparator` din labs anterioare).
`Collections.reverse(list)` — inversare in-place.
`Collections.min(col) / max(col)` — extremele (necesită `Comparable` sau `Comparator`).
`Collections.frequency(col, elem)` — numărul de apariții.

### LinkedHashSet — Set cu ordine garantată

`LinkedHashSet<E>` combină viteza lui `HashSet` (O(1) add/contains) cu păstrarea **ordinii de inserare**. Util când deduplicezi o colecție și vrei să menții ordinea primei apariții a fiecărui element.

---

<details open>
<summary><h2>Obiective</h2></summary>

1. **LinkedList** — operații deque, contrast structural cu `ArrayList`
2. **Iterator explicit + `itr.remove()`** — singura ștergere sigură în iterație
3. **`ConcurrentModificationException`** — cauza (fail-fast) și remedierea
4. **`LinkedHashSet`** — deduplicare cu ordine de inserare garantată
5. **`Collections` utilitar** — `sort`, `reverse`, `min`, `max`
6. **Stream API** *(bonus)* — `filter`, `map`, `Collectors.groupingBy`, extrase lunare

</details>

---

## Exerciții

| # | Pachet | Concept principal | Timp estimat | Teste automate |
|---|--------|-------------------|--------------|----------------|
| 1 | [`exercise1/`](exercise1/Readme.md) | `LinkedList` (operații deque + `Iterator.remove()`), contrast `ArrayList` | ~40 min | ✓ (2 părți) |
| 2 | [`exercise2/`](exercise2/Readme.md) | `LinkedHashSet`, `ConcurrentModificationException`, `Collections.sort/reverse/min/max` | ~40 min | ✓ (flat) |
| 3 *(bonus)* | [`exercise3/`](exercise3/Readme.md) | Stream API — `filter`, `groupingBy`, `summingDouble`, extrase de cont pe luni | ~30 min | manual |

> **Total estimat:** ~1h20 min (fără bonus) · ~1h50 min (cu bonus)

---

## Cum rulezi testele automate

Deschide `exercise1/Checker.java` sau `exercise2/Checker.java` în IntelliJ și apasă **Run**.

Directorul de lucru trebuie să fie **rădăcina proiectului** (`paoj-2026/`):
`Run → Edit Configurations → Working directory → $PROJECT_DIR$`

- **exercise1** — teste pe 2 părți (`partA`, `partB`); Checker apelează `IOTest.runParts`.
- **exercise2** — teste flat; Checker apelează `IOTest.runFlat`.

---

## Fișiere din acest laborator

| Fișier | Rol |
|--------|-----|
| `exercise1/Readme.md` | Cerințe exercițiu 1 |
| `exercise1/Main.java` | Implementează cerința (completează TODO-urile) |
| `exercise1/Checker.java` | Rulează testele automate pentru exercițiul 1 |
| `exercise2/Readme.md` | Cerințe exercițiu 2 |
| `exercise2/Main.java` | Implementează cerința (completează TODO-urile) |
| `exercise2/Checker.java` | Rulează testele automate pentru exercițiul 2 |
| `exercise3/Readme.md` | Cerințe exercițiu bonus |
| `exercise3/Main.java` | Demonstrație (completează conform cerințelor din Readme) |
