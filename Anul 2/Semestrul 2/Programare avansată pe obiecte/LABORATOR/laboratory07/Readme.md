# Laboratory 07 — Mașini de stări, Enum avansat și Sisteme de Comenzi în eCommerce

> **Pachet:** `com.pao.laboratory07` · **Curs:** 06 ·
> **Data limită:** miercuri 8 aprilie 2026, ora 23:59

---

## Noțiuni teoretice: Mașini de stări, Enumuri și Command Pattern

### Mașina de stări (State Machine)
O mașină de stări este un model de calcul care descrie un sistem printr-un set finit de stări, tranziții între stări și acțiuni posibile. În contextul unui magazin online, o comandă trece prin stări precum plasată, procesată, expediată, livrată sau anulată. Fiecare acțiune (ex: "next", "cancel", "undo") determină o tranziție între stări.

### Enumuri avansate în Java
Un `enum` poate modela elegant stările și tranzițiile unei mașini de stări. Fiecare constantă din enum poate avea implementări proprii pentru metode abstracte, permițând comportamente diferite pentru fiecare stare. Enumurile pot avea câmpuri, constructori privați și metode, fiind utile pentru a asocia logică specifică fiecărei stări.

### Command Pattern
Command Pattern separă obiectul care emite o comandă de cel care o execută. În sistemele de tracking comenzi, comenzile (ex: "next", "cancel", "undo") pot fi modelate ca obiecte sau acțiuni distincte, facilitând extinderea și gestionarea istoricului de acțiuni (ex: implementarea funcționalității de undo).

---

<details open>
<summary><h2>Obiective</h2></summary>

1. **Mașini de stări și enumuri avansate** — modelarea ciclului de viață al unei comenzi
2. **Command Pattern și istoricul acțiunilor** — implementarea comenzilor și a funcționalității de undo/redo
3. **Sealed classes și interfețe marker** — ierarhii de tipuri sigure și extensibile
4. **Metode default/private în interfețe** — reutilizare și extindere a funcționalității

</details>

---

## Exerciții

| # | Pachet | Concept principal | Timp estimat | Teste automate |
|---|--------|-------------------|--------------|----------------|
| 1 | [`exercise1/`](exercise1/Readme.md) | Enum cu metode abstracte, mașină de stări, undo, sistem de tracking comenzi eCommerce | ~35 min | ✓ (3 părți) |
| 2 | [`exercise2/`](exercise2/Readme.md) | Sealed class hierarchy, compoziție, extindere sistem comenzi eCommerce | ~20 min | ✓ (flat) |
| 3 | [`exercise3/`](exercise3/Readme.md) | Analiză avansată: rapoarte, statistici și workflow-uri automate pentru comenzi | ~45 min | manual |
| 4 *(bonus)* | [`exercise4/Readme.md`](exercise4/Readme.md) | Enum singleton, validator chain Java 9 | ~30 min | manual |

> **Total estimat:** ~1h40 min (fără bonus) · ~2h10 min (cu bonus)

---

## Cum rulezi testele automate

Deschide `exercise1/Test.java` sau `exercise2/Checker.java` în IntelliJ și apasă **Run**.

Directorul de lucru trebuie să fie **rădăcina proiectului** (`paoj-2026/`):
`Run → Edit Configurations → Working directory → $PROJECT_DIR$`

- Pentru **exercise1**, testele sunt organizate pe părți (`partA`, `partB`, `partC`).
- Pentru **exercise2**, testele sunt fișiere `.in`/`.out` direct în `tests/` (nu există subdirectoare partA/partB/partC).

---

## Fișiere din acest laborator

| Fișier                                     | Rol                           |
|--------------------------------------------|-------------------------------|
| [exercise1/Readme.md](exercise1/Readme.md) | Cerința completă Ex 1         |
| [exercise1/Main.java](exercise1/Main.java) | Punct de intrare Ex 1         |
| [exercise1/Test.java](exercise1/Test.java) | Runner teste automate Ex 1    |
| [exercise2/Readme.md](exercise2/Readme.md) | Cerința completă Ex 2         |
| [exercise2/Main.java](exercise2/Main.java) | Punct de intrare Ex 2         |
| [exercise2/Checker.java](exercise2/Checker.java) | Runner teste automate Ex 2    |
| [exercise3/Readme.md](exercise3/Readme.md) | Cerința completă Ex 3         |
| [exercise3/Main.java](exercise3/Main.java) | Punct de intrare Ex 3         |
