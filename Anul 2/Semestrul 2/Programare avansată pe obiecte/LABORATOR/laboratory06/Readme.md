# Laboratory 06 — Interfețe

> **Pachet:** `com.pao.laboratory06` · **Curs:** 05 ·
> **Data limită:** miercuri 1 aprilie 2026, ora 23:59

---

<details open>
<summary><h2>Obiective</h2></summary>

1. **Interfețe** — sintaxă, membre (constante, metode abstracte, default, static, private)
2. **`Comparable<T>`** — sortare naturală, `compareTo`
3. **`Comparator<T>`** — sortări alternative, clase externe
4. **Callback** — transmiterea unei metode ca argument folosind interfețe
5. **Extinderea interfețelor** — `extends` între interfețe, sub-interfețe
6. **Referința de tip interfață** — accesarea unui obiect prin tipul interfeței (CAN_DO)
7. **Constante în interfețe** — grupuri de constante (și de ce enum-urile sunt superioare)

</details>

---

## Exerciții

| # | Pachet | Concept principal | Timp estimat | Teste automate |
|---|--------|-------------------|--------------|----------------|
| 1 | [`exercise1/`](exercise1/Readme.md) | EXEMPLU: `Comparable` + `Comparator` + sortări multiple | ~35 min | ✓ (3 părți) |
| 2 | [`exercise2/`](exercise2/Readme.md) | Cerințe principale (vezi Readme principal) | ~30 min | ✓ (3 părți) |
| 3 (bonus) | [`exercise3/`](exercise3/Readme.md) | Integrare avansată colaboratori (bonus) | ~45 min | manual |

> **Notă:** Doar în acest laborator, exercițiul 1 este un exemplu pentru a vă familiariza cu formatul și testarea automată. Exercițiul 2 este exercițiul principal, cu cerințe bazate pe Readme-ul principal al laboratorului. Exercițiul 3 este bonus: dacă îl rezolvi, poți participa la doar 8 exerciții și poți obține un bonus de 0.5% la nota finală de laborator, astfel încât să poți atinge nota maximă chiar dacă nu se rotunjește la 50% la calculul final.

> **Total estimat:** ~1h50 min (fără bonus) · ~2h35 min (cu bonus)

---

## Cum rulezi testele automate

Deschide `exercise1/Test.java` sau `exercise2/Test.java` în IntelliJ și apasă **Run**.

Directorul de lucru trebuie să fie **rădăcina proiectului** (`paoj-2026/`):
`Run → Edit Configurations → Working directory → $PROJECT_DIR$`

Fiecare exercițiu cu teste automate are **mai multe părți** (`partA`, `partB`, `partC`).
Poți rezolva și testa câte o parte pe rând — la rulare vei vedea un sumar per parte
și un tabel final cu totalul testelor trecute.

---

## Fișiere din acest laborator

| Fișier | Rol |
|--------|-----|
| [exercise1/Readme.md](exercise1/Readme.md) | Cerință completă Ex 1 (exemplu) |
| [exercise1/Main.java](exercise1/Main.java) | Punct de intrare Ex 1 |
| [exercise1/Test.java](exercise1/Test.java) | Runner teste automate Ex 1 |
| [exercise2/Readme.md](exercise2/Readme.md) | Cerință completă Ex 2 (principal) |
| [exercise2/Main.java](exercise2/Main.java) | Punct de intrare Ex 2 |
| [exercise2/Test.java](exercise2/Test.java) | Runner teste automate Ex 2 |
| [exercise3/Readme.md](exercise3/Readme.md) | Cerință completă Ex 3 (bonus) |
| [exercise3/Main.java](exercise3/Main.java) | Punct de intrare Ex 3 |
