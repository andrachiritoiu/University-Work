# Exercițiul 2 — Ierarhie sealed de comenzi

> **Pachet:** `com.pao.laboratory07.exercise2`
> **Timp estimat:** ~20 min · **Teste automate:** da (`Checker.java`)

---

## Scop

Vei modela tipuri de comenzi folosind **sealed classes** și vei reutiliza enum-ul `OrderState` din exercițiul 1 pentru a marca starea inițială a fiecărei comenzi.

---

## Ierarhia sealed

Creează o sealed class `Comanda` care permite exact trei subclase:

```java
public abstract sealed class Comanda permits ComandaStandard, ComandaRedusa, ComandaGratuita {
    protected String nume;
    // ...
    public abstract double pretFinal();
    public abstract String descriere();
}
```

| Subclasă | Câmpuri extra | `pretFinal()` |
|---|---|---|
| `ComandaStandard` | — | `pret` |
| `ComandaRedusa` | `int discountProcent` | `pret * (1 - discountProcent / 100.0)` |
| `ComandaGratuita` | — | `0.0` |

---

## Import din exercițiul 1

Importă enum-ul de stări din exercițiul anterior:

```java
import com.pao.laboratory07.exercise1.OrderState;
```

Fiecare comandă primește automat starea inițială `OrderState.PLACED` la construire. Nu este nevoie să o citești din input — este mereu `PLACED`.

---

## Structura inputului

- Prima linie: numărul de comenzi `N`
- Următoarele `N` linii, fiecare în unul din formatele:
  - `STANDARD <nume> <pret>`
  - `DISCOUNTED <nume> <pret> <discountProcent>`
  - `GIFT <nume>`

---

## Structura outputului

**Pentru fiecare comandă**, pe câte o linie, în ordinea citirii:

```
STANDARD: <nume>, pret: X.XX lei [PLACED]
DISCOUNTED: <nume>, pret: X.XX lei (-D%) [PLACED]
GIFT: <nume>, gratuit [PLACED]
```

> Prețul afișat este **prețul final** (după discount).

**O linie goală**, apoi blocul de statistici:

```
Statistici:
STANDARD: suma = X.XX lei, numar = N
DISCOUNTED: suma = X.XX lei, numar = N
GIFT: suma = 0.00 lei, numar = N
Total platit: X.XX lei
```

> Afișează doar tipurile prezente în input (nu afișa o linie de statistici pentru un tip cu 0 comenzi).  
> Ordinea tipurilor în statistici: `STANDARD`, `DISCOUNTED`, `GIFT` (dacă există).

---

## Exemplu complet

**Input:**
```
4
STANDARD Laptop 2500.0
DISCOUNTED Headphones 200.0 20
GIFT Sticker
STANDARD Mouse 80.0
```

**Output:**
```
STANDARD: Laptop, pret: 2500.00 lei [PLACED]
DISCOUNTED: Headphones, pret: 160.00 lei (-20%) [PLACED]
GIFT: Sticker, gratuit [PLACED]
STANDARD: Mouse, pret: 80.00 lei [PLACED]

Statistici:
STANDARD: suma = 2580.00 lei, numar = 2
DISCOUNTED: suma = 160.00 lei, numar = 1
GIFT: suma = 0.00 lei, numar = 1
Total platit: 2740.00 lei
```

---

## Indicații

- Folosește `pattern matching` cu `instanceof` sau un `switch` pe tipul sealed pentru a genera descrierea.
- Colectează statisticile într-un `Map<String, Double>` pentru sume și un `Map<String, Integer>` pentru numărare, sau simplu cu trei variabile per tip.
- Formatează valorile monetare cu `String.format("%.2f", ...)`.
- `sealed` și `permits` necesită Java 17+.

---

## Testare automată

Deschide `Checker.java` și apasă **Run** în IntelliJ. Testele se află direct în `tests/` (fișiere `1.in`/`1.out` … `4.in`/`4.out`).  
Directorul de lucru trebuie să fie rădăcina proiectului (`paoj-2026/`).
