# Laboratory 04 — Colecții (`Map`), Enum-uri, Excepții

> **Pachet:** `com.pao.laboratory04` · **Curs:** 07–08 · **Pre-rechizite:** [Laboratory 03](src/com/pao/laboratory04/Readme.md)

---

<details open>
<summary><h2>Obiective</h2></summary>

1. **`Map`** — `HashMap`, `TreeMap`: perechi cheie-valoare
2. **Enum-uri** — constante cu câmpuri, constructori, metode abstracte per constantă
3. **Excepții** — ierarhia `Throwable`, checked vs unchecked, `try-catch-finally`, excepții custom
4. **Exercițiu integrator** — `Map` + `enum` + excepții custom + Singleton

> ⚠️ De data aceasta **NU primiți clase model gata făcute**. Creați totul de la zero — simulează munca pe proiectul individual.

</details>

---

## Exerciții

| # | Exercițiu | Timp | Ce creezi |
|---|-----------|------|-----------|
| 1 | HashMap + TreeMap | ~20 min | Totul în [collections/Main.java](src/com/pao/laboratory04/collections/Main.java) |
| 2 | Enum-uri | ~20 min | `Priority.java` + [enums/Main.java](src/com/pao/laboratory04/enums/Main.java) |
| 3 | Excepții custom | ~25 min | `InvalidAgeException.java`, `DuplicateEntryException.java` + [exceptions/Main.java](src/com/pao/laboratory04/exceptions/Main.java) |
| 4 | Integrator: Studenți + Note | ~35 min | 6 clase de la zero + [exercise/Main.java](src/com/pao/laboratory04/exercise/Main.java) |
| 5 | **Bonus:** Task Manager + Audit | ~45 min | ~8 clase de la zero + [bonus/Main.java](src/com/pao/laboratory04/bonus/Main.java) |

---

### Exercițiul 1 — HashMap și TreeMap

> 📖 **Exemplu:** Rulează mai întâi [collections/ExampleMap.java](src/com/pao/laboratory04/collections/ExampleMap.java) pentru a vedea cum funcționează Map-urile.

Lucrează în [collections/Main.java](src/com/pao/laboratory04/collections/Main.java) — cerințele sunt în Javadoc.

**Concepte cheie:**
- `HashMap<K, V>` — acces O(1), ordine nepredictibilă
- `TreeMap<K, V>` — chei **sortate**, acces O(log n)
- `put`, `get`, `getOrDefault`, `keySet`, `values`, `entrySet`
- `Map<String, List<String>>` — map cu liste ca valori

<details>
<summary><b>Output așteptat</b></summary>

```
=== PARTEA A: HashMap — frecvența cuvintelor ===
Frecvență: {python=2, c++=2, java=3, rust=1, go=1}
Conține 'rust'? true
Chei: [python, c++, java, rust, go]
Valori: [2, 2, 3, 1, 1]
python -> 2
c++ -> 2
java -> 3
rust -> 1
go -> 1

=== PARTEA B: TreeMap — sortare automată ===
Sortat: {c++=2, go=1, java=3, python=2, rust=1}
Prima cheie: c++
Ultima cheie: rust

=== PARTEA C: Map cu obiecte ===
Studenți la PAOJ: [Ana, Mihai, Ion]
Studenți la BD (actualizat): [Ana, Elena, George]
```

</details>

---

### Exercițiul 2 — Enum-uri cu câmpuri și metode

> 📖 **Exemplu:** Rulează mai întâi [enums/ExampleEnum.java](src/com/pao/laboratory04/enums/ExampleEnum.java) pentru a vedea enum-uri simple și cu metode abstracte.

Creează `Priority.java` în [enums/](src/com/pao/laboratory04/enums) apoi completează [enums/Main.java](src/com/pao/laboratory04/enums/Main.java).

**Reține:**
- Enum = set fix de constante singleton
- Pot avea câmpuri, constructor **privat**, getteri, metode abstracte
- `values()`, `valueOf("STRING")`, `name()`, `ordinal()`
- Comparare cu `==` (nu `.equals()`)

<details>
<summary><b>Output așteptat</b></summary>

```
=== Toate prioritățile ===
🟢 LOW (level=1, color=green)
🟡 MEDIUM (level=2, color=yellow)
🟠 HIGH (level=3, color=orange)
🔴 CRITICAL (level=4, color=red)

=== Switch pe prioritate ===
⚠️ Atenție! Prioritate ridicată!

=== valueOf ===
Priority.valueOf("HIGH") = HIGH

=== Comparare enum ===
HIGH == HIGH? true
HIGH == LOW? false

=== name() și ordinal() ===
LOW: name=LOW, ordinal=0
MEDIUM: name=MEDIUM, ordinal=1
HIGH: name=HIGH, ordinal=2
CRITICAL: name=CRITICAL, ordinal=3
```

</details>

---

### Exercițiul 3 — Excepții custom

> 📖 **Exemplu:** Rulează mai întâi [exceptions/ExampleExceptions.java](src/com/pao/laboratory04/exceptions/ExampleExceptions.java) pentru a vedea try-catch, custom exceptions, multi-catch.

Creează `InvalidAgeException.java` și `DuplicateEntryException.java` în [exceptions/](src/com/pao/laboratory04/exceptions), apoi completează [exceptions/Main.java](src/com/pao/laboratory04/exceptions/Main.java).

<details>
<summary><b>Ierarhia excepțiilor</b></summary>

```
                    Throwable
                   /         \
             Exception       Error (NU se prind)
              /       \
  checked exceptions   RuntimeException (unchecked)
  (IOException)         /      |       \
                  NullPointer  IndexOutOf  IllegalArgument
                                            \
                                     excepțiile tale custom
```

| Tip | Compilatorul forțează? | Exemple |
|-----|----------------------|---------|
| **Checked** | ✅ Da | `IOException`, `SQLException` |
| **Unchecked** | ❌ Nu | `NullPointerException`, `IllegalArgumentException` |
| **Error** | ❌ Nu se prind | `OutOfMemoryError`, `StackOverflowError` |

</details>

**Reține:**
- `throw new MyException("mesaj")` — aruncă
- `throws MyException` — declară în semnătură
- `catch (Ex1 | Ex2 e)` — multi-catch
- Ordinea: **specific → general**
- `finally` — se execută **mereu**

<details>
<summary><b>Output așteptat</b></summary>

```
=== a) Unchecked — NullPointerException ===
Prins: Cannot invoke "String.length()" because "s" is null
Finally se execută mereu!

=== b) Custom exceptions ===
InvalidAgeException: Vârsta -5 nu este validă (0-150)
DuplicateEntryException: 'Ana' există deja în listă

=== c) Multi-catch ===
Excepție prinsă: Vârsta 200 nu este validă (0-150)

=== d) Catch ordering (specific → general) ===
InvalidAgeException prinsă specific: Vârsta -1 nu este validă (0-150)

=== e) Throw vs throws ===
Metoda process() a aruncat: Vârsta 999 nu este validă (0-150)
```

</details>

---

### Exercițiul 4 (Integrator) — Gestiune studenți + note

Creează **6 clase de la zero** apoi completează TODO-urile din [exercise/Main.java](src/com/pao/laboratory04/exercise/Main.java). Specs complete în Javadoc.

| # | Clasă | Pachet | Tip |
|---|-------|--------|-----|
| 1 | `Subject.java` | [exercise/model/](src/com/pao/laboratory04/exercise/model) | Enum (PAOJ, BD, SO, RC) cu `fullName` + `credits` |
| 2 | `Student.java` | [exercise/model/](src/com/pao/laboratory04/exercise/model) | Clasă cu `Map<Subject, Double> grades` |
| 3 | `InvalidStudentException.java` | [exercise/exception/](src/com/pao/laboratory04/exercise/exception) | extends RuntimeException |
| 4 | `InvalidGradeException.java` | [exercise/exception/](src/com/pao/laboratory04/exercise/exception) | extends RuntimeException |
| 5 | `StudentNotFoundException.java` | [exercise/exception/](src/com/pao/laboratory04/exercise/exception) | extends RuntimeException |
| 6 | `StudentService.java` | [exercise/service/](src/com/pao/laboratory04/exercise/service) | Singleton cu `List<Student>` + 6 metode |

<details>
<summary><b>Exemplu interacțiune</b></summary>

```
=== Sistem Gestiune Studenți ===

--- Meniu ---
1. Adaugă student
2. Adaugă notă
3. Afișează toți studenții
4. Top studenți (după medie)
5. Media pe materie
0. Ieșire
Opțiune: 1
Nume: Ana
Vârsta: 20
Student adăugat cu succes!

Opțiune: 2
Nume student: Ana
Materie (PAOJ, BD, SO, RC): PAOJ
Nota (1-10): 9.5
Notă adăugată!

Opțiune: 3
1. Student{name='Ana', age=20, avg=8.75}
   PAOJ = 9.5
   BD = 8.0

Opțiune: 4
=== Top studenți ===
1. Ana — media: 8.75
2. Mihai — media: 7.00

Opțiune: 5
=== Media pe materie ===
PAOJ: 8.25
BD: 8.00

Opțiune: 1
Nume: Invalid
Vârsta: -5
Eroare: Vârsta -5 nu este validă (18-60)

Opțiune: 0
La revedere!
```

</details>

<details>
<summary><b>Hint-uri</b></summary>

**Subject.java (enum):**
```java
public enum Subject {
    PAOJ("Programare Avansată pe Obiecte", 6),
    BD("Baze de Date", 5),
    // ...
    ;
    // câmpuri, constructor, getteri
}
```

**Student.java — getAverage():**
```java
public double getAverage() {
    if (grades.isEmpty()) return 0;
    double sum = 0;
    for (double g : grades.values()) sum += g;
    return sum / grades.size();
}
```

**StudentService.java — Singleton:**
```java
private static StudentService instance;
private StudentService() { ... }
public static StudentService getInstance() { ... }
```

**StudentService.java — getAveragePerSubject():**
```java
Map<Subject, Double> result = new HashMap<>();
for (Subject subject : Subject.values()) {
    // colectează note de la toți studenții care au notă la 'subject'
}
```

</details>

---

### Exercițiul 5 (Bonus) — Task Manager cu Audit Log

Construiește un sistem complet **fără schelet de cod** — primești doar cerințele în [bonus/Main.java](src/com/pao/laboratory04/bonus/Main.java). Tu decizi structura claselor și organizarea pachetelor.

**Ce trebuie creat (~8 clase):**

| Tip | Clase | Ce e diferit față de Ex. 4 |
|-----|-------|---------------------------|
| Model | `Task` (id, title, status, priority, assignee) | ID generat automat ("T001", "T002"...) |
| Enum | `Status` cu metodă abstractă `canTransitionTo(Status)` | **State machine**: TODO→IN_PROGRESS→DONE, nu poți merge înapoi |
| Enum | `Priority` cu `calculateScore(int baseDays)` | Enum cu **logică de calcul**, nu doar date |
| Excepții | `DuplicateTaskException`, `TaskNotFoundException`, `InvalidTransitionException` | `InvalidTransitionException` are **câmpuri extra** (fromStatus, toStatus) |
| Serviciu | `TaskService` (Singleton) cu **2 Map-uri** + **audit log** | `Map<String, Task>` + `Map<Priority, List<Task>>` + `List<String>` |

**Ce face acest exercițiu mai dificil:**
- Enum cu **state machine** (tranziții valide/invalide)
- Excepție custom cu **câmpuri suplimentare** (nu doar message)
- Serviciu cu **structuri de date multiple** sincronizate
- **Audit log** — pattern real din aplicații enterprise
- **Scor de urgență** calculat din enum
- **Organizare liberă** — tu decizi pachetele

<details>
<summary><b>Hint-uri</b></summary>

**Status enum cu canTransitionTo:**
```java
public enum Status {
    TODO {
        @Override public boolean canTransitionTo(Status next) {
            return next == IN_PROGRESS || next == CANCELLED;
        }
    },
    IN_PROGRESS {
        @Override public boolean canTransitionTo(Status next) {
            return next == DONE || next == CANCELLED;
        }
    },
    DONE {
        @Override public boolean canTransitionTo(Status next) { return false; }
    },
    CANCELLED {
        @Override public boolean canTransitionTo(Status next) { return false; }
    };

    public abstract boolean canTransitionTo(Status next);
}
```

**ID automat:**
```java
private int nextId = 1;
String id = String.format("T%03d", nextId++);  // "T001", "T002"...
```

**Audit log:**
```java
private final List<String> auditLog = new ArrayList<>();
// la fiecare operație:
auditLog.add("[ADD] " + task.getId() + ": '" + task.getTitle() + "' (" + task.getPriority() + ")");
```

**getStatusSummary() — numără pe fiecare status:**
```java
Map<Status, Long> summary = new HashMap<>();
for (Status s : Status.values()) {
    long count = tasksById.values().stream()
        .filter(t -> t.getStatus() == s).count();
    // sau cu for clasic
    summary.put(s, count);
}
```

</details>

---

<details open>
<summary><h2>Cheat Sheet</h2></summary>

| Concept | Sintaxă |
|---------|---------|
| `HashMap<K,V>` | O(1), ordine nepredictibilă |
| `TreeMap<K,V>` | **Sortat** după cheie |
| `map.getOrDefault(k, def)` | Returnează valoare sau default |
| `map.entrySet()` | `for (Map.Entry<K,V> e : map.entrySet())` |
| `enum` cu câmpuri | Constructor **privat**, getteri, metode abstracte |
| `values()` / `valueOf("X")` | Toate constantele / String → enum |
| `try-catch-finally` | `try { } catch (Ex e) { } finally { }` |
| `throw` / `throws` | Aruncă excepție / Declară în semnătură |
| Multi-catch | `catch (Ex1 \| Ex2 e)` |
| Custom exception | `class MyEx extends RuntimeException { MyEx(String m) { super(m); } }` |

</details>

---

## Ce urmează la Laboratory 05?
- Generics (`<T>`, bounded types, wildcards)
- Stream API & lambdas (introducere)
- Design patterns (Factory, Strategy)

---

## FAQ

<details>
<summary><b>1. <code>HashMap</code> vs <code>TreeMap</code> — când pe care?</b></summary>

| | `HashMap` | `TreeMap` |
|---|----------|-----------|
| **Ordine** | Nepredictibilă | Chei **sortate** |
| **Performanță** | O(1) | O(log n) |
| **Null keys** | ✅ 1 cheie null | ❌ Nu |

**Frecvența elementelor:**
```java
Map<String, Integer> freq = new HashMap<>();
for (String word : words) {
    freq.put(word, freq.getOrDefault(word, 0) + 1);
}
```

**Map cu liste:**
```java
Map<String, List<String>> groups = new HashMap<>();
groups.computeIfAbsent("PAOJ", k -> new ArrayList<>()).add("Ana");
```

Cheile trebuie să aibă `equals()`/`hashCode()` corecte — vezi [Lab 02 FAQ #4](src/com/pao/laboratory02/Readme.md).

</details>

<details>
<summary><b>2. Ce este un enum și când îl folosesc?</b></summary>

Enum = set **fix și finit** de constante singleton.

**Folosește când:** set fix de valori (zile, stări, priorități), vrei type safety, vrei date/comportament pe constantă.

**Enum cu câmpuri și metode abstracte:**
```java
public enum Priority {
    LOW(1) {
        @Override public String getEmoji() { return "🟢"; }
    },
    HIGH(3) {
        @Override public String getEmoji() { return "🔴"; }
    };

    private final int level;
    Priority(int level) { this.level = level; }
    public int getLevel() { return level; }
    public abstract String getEmoji();
}
```

**Reguli:** Constructor implicit privat · Comparare cu `==` · `values()` = toate constantele · `valueOf("HIGH")` = String → enum.

</details>

<details>
<summary><b>3. Checked vs unchecked exceptions?</b></summary>

| | Checked | Unchecked |
|---|---------|-----------|
| **Superclasă** | `Exception` (dar NU `RuntimeException`) | `RuntimeException` |
| **Compilatorul forțează** | ✅ Da | ❌ Nu |
| **Cauza** | Condiții externe (fișier, rețea) | Bug-uri (null, index greșit) |
| **Custom** | `extends Exception` | `extends RuntimeException` |

**Practică:** Pentru excepții custom, de obicei `extends RuntimeException` — mai simplu, nu poluează semnăturile.

</details>

<details>
<summary><b>4. Când creez o excepție custom?</b></summary>

**Da:** excepțiile standard nu exprimă problema · vrei catch diferențiat · vrei câmpuri extra.

**Nu:** `IllegalArgumentException` exprimă deja problema.

```java
public class StudentNotFoundException extends RuntimeException {
    public StudentNotFoundException(String message) {
        super(message);  // super(msg) → Throwable.getMessage()
    }
}
```

Pattern-ul `super(message)` e același ca `super(name, age)` din [Lab 02 Dog.java](src/com/pao/laboratory02/exercise4/model/Dog.java).

</details>

<details>
<summary><b>5. Ce face <code>finally</code>?</b></summary>

Se execută **mereu** — și dacă `try` reușește, și dacă `catch` prinde ceva, și chiar dacă ai `return`!

```java
try {
    return;
} finally {
    System.out.println("se execută oricum!");
}
```

**Alternativă modernă:** `try-with-resources` — `try (FileReader r = ...) { }`.

</details>

<details>
<summary><b>6. De ce contează ordinea catch-urilor?</b></summary>

Java intră în **primul** catch care se potrivește. Specific → general, altfel eroare de compilare.

```java
// ✅ Corect
catch (InvalidAgeException e) { ... }    // specific
catch (RuntimeException e) { ... }       // general

// ❌ Greșit — nu compilează
catch (RuntimeException e) { ... }       // prinde TOT
catch (InvalidAgeException e) { ... }    // unreachable!
```

Multi-catch: `catch (Ex1 | Ex2 e)` — doar dacă NU sunt în relație părinte-copil.

</details>

<details>
<summary><b>7. <code>throw</code> vs <code>throws</code>?</b></summary>

| | `throw` | `throws` |
|---|---------|----------|
| **Ce face** | Aruncă excepție | Declară că metoda poate arunca |
| **Unde** | Corpul metodei | Semnătura metodei |
| **Sintaxă** | `throw new MyEx("msg")` | `void m() throws MyEx` |

`throws` obligatoriu doar pentru checked exceptions.

</details>

<details>
<summary><b>8. Utilizări <code>super</code> în Lab 03</b></summary>

`super` apare în excepții custom — transmite mesajul către `RuntimeException`:

| Clasă | Apel | Părinte |
|-------|------|---------|
| `InvalidAgeException` | `super(message)` | `RuntimeException` |
| `DuplicateEntryException` | `super(message)` | `RuntimeException` |
| `InvalidStudentException` | `super(message)` | `RuntimeException` |
| `InvalidGradeException` | `super(message)` | `RuntimeException` |
| `StudentNotFoundException` | `super(message)` | `RuntimeException` |

Același pattern ca `super(name, age)` din Lab 02. Lista completă → [Lab 02 FAQ #1](src/com/pao/laboratory02/Readme.md).

</details>

<details>
<summary><b>9. Enum ca cheie în <code>HashMap</code>?</b></summary>

**Da!** Enum-urile sunt ideale — `hashCode()`/`equals()` corecte, imutabile. Java oferă și `EnumMap` optimizat:

```java
Map<Subject, Double> grades = new EnumMap<>(Subject.class);
grades.put(Subject.PAOJ, 9.5);
```

</details>

<details>
<summary><b>10. <code>List</code> vs <code>Set</code> vs <code>Map</code>?</b></summary>

```
Perechi cheie → valoare?  → Map (HashMap / TreeMap)
Unicitate?                → Set (HashSet / TreeSet)
Ordine + duplicate?       → ArrayList
Sortare automată?         → TreeSet / TreeMap
```

**Proiect:** minim 2 colecții diferite, una sortată → `ArrayList` + `TreeMap`/`TreeSet`.

</details>

---

<details>
<summary><h2>Legătura cu proiectul individual</h2></summary>

| Cerință proiect | Ce ai învățat |
|----------------|---------------|
| 2 colecții diferite, 1 sortată | `HashMap`/`TreeMap` + `ArrayList` |
| 8 tipuri de obiecte | Enum-uri = tipuri noi |
| 10 acțiuni/interogări | Serviciu CRUD + validare cu excepții |
| Clasă serviciu | Singleton din Lab 01-03 |
| Validare date | Excepții custom |

**După Lab 03 poți începe Etapa I a proiectului!**

</details>

