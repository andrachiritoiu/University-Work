# Laboratory 11 - Functional Rules and Stream Analytics

> Pachet: `com.pao.laboratory11`
> Tip: laborator complet (2 exercitii obligatorii + 1 bonus)

---

## Obiective

1. Compozitie de reguli cu `Predicate`, `Function`, `Consumer`.
2. Rapoarte avansate cu Stream API si colectori.
3. Bonus: colector custom si snapshot imutabil.

---

## Exercitii

| # | Pachet | Concept principal | Timp estimat | Teste automate |
|---|---|---|---|---|
| 1 | [exercise1/](exercise1/Readme.md) | Motor de reguli antifrauda (`Predicate` composition) | ~50 min | yes (runParts) |
| 2 | [exercise2/](exercise2/Readme.md) | Raportare stream avansata (`groupingBy`, agregari) | ~40 min | yes (runFlat) |
| 3 (bonus) | [exercise3/](exercise3/Readme.md) | Colector custom + snapshot imutabil | ~30 min | manual |

---

## Cum rulezi testele automate

Deschide `Checker.java` din:
- `exercise1/Checker.java` pentru teste pe parti (`runParts`)
- `exercise2/Checker.java` pentru teste flat (`runFlat`)

Working directory: radacina proiectului (`paoj-2026`).

---

## Diferenta intre runParts si runFlat

- `exercise1` foloseste `tests/partA`, `tests/partB`, `tests/partC` si `IOTest.runParts(...)`.
- `exercise2` foloseste fisiere flat `tests/N.in` + `tests/N.out` si `IOTest.runFlat(...)`.
