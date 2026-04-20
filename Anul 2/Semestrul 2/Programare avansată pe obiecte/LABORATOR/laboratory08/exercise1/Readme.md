# Exercițiul 1 — Clonare și citire din fișier

> **Pachet:** `com.pao.laboratory08.exercise1`
> **Timp estimat:** ~1h · **Teste automate:** da (`Checker.java`, 3 părți)

---

## Scop

Vei citi date despre studenți dintr-un fișier text folosind `BufferedReader`, vei construi obiecte `Student` și `Adresa`, apoi vei demonstra diferența dintre **clonarea superficială** (shallow) și **clonarea profundă** (deep) folosind interfața marker `Cloneable`.

---

## Fișierul de date

Programul citește **întotdeauna** din `src/com/pao/laboratory08/tests/studenti.txt`.
Calea este relativă la rădăcina proiectului (working directory = `paoj-2026/`).

Format CSV — fiecare linie: `Nume,Varsta,Oras,Strada`

```
Ana,19,București,Calea Victoriei
Mihai,22,Cluj,Strada Mărășești
...
```

---

## Clase de creat

### `Adresa`

```java
public class Adresa implements Cloneable {
    private String oras;
    private String strada;

    // constructor(String oras, String strada)
    // getteri, setteri
    // toString() → "Adresa{oras='...', strada='...'}"

    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
```

### `Student`

```java
public class Student implements Cloneable {
    private String nume;
    private int varsta;
    private Adresa adresa;

    // constructor(String nume, int varsta, Adresa adresa)
    // getteri, setteri
    // toString() → "Student{nume='...', varsta=..., adresa=Adresa{oras='...', strada='...'}}"

    // clone() — implementare diferită pentru shallow vs. deep (vezi mai jos)
}
```

---

## Protocolul de intrare (stdin)

Programul citește **o singură linie** din stdin, care este o comandă:

| Comandă | Descriere |
|---------|-----------|
| `PRINT` | Afișează toți studenții citiți din fișier |
| `SHALLOW <nume>` | Shallow clone pe studentul cu numele dat, modifică orașul clonei, afișează |
| `DEEP <nume>` | Deep clone pe studentul cu numele dat, modifică orașul clonei, afișează |

---

## Partea A — Citire din fișier și afișare

**Comandă (stdin):** `PRINT`

**Ce faci:**
1. Deschide `studenti.txt` cu `new BufferedReader(new FileReader(...))`
2. Citește linie cu linie, parsează CSV-ul, creează obiecte `Student` + `Adresa`
3. Închide fișierul
4. Afișează toți studenții, câte unul pe linie

**Output:**
```
Student{nume='Ana', varsta=19, adresa=Adresa{oras='București', strada='Calea Victoriei'}}
Student{nume='Mihai', varsta=22, adresa=Adresa{oras='Cluj', strada='Strada Mărășești'}}
Student{nume='Elena', varsta=20, adresa=Adresa{oras='Iași', strada='Bulevardul Independenței'}}
Student{nume='Ion', varsta=17, adresa=Adresa{oras='Timișoara', strada='Strada Florilor'}}
Student{nume='Maria', varsta=23, adresa=Adresa{oras='Brașov', strada='Strada Republicii'}}
Student{nume='Andrei', varsta=21, adresa=Adresa{oras='Constanța', strada='Bulevardul Mamaia'}}
```

---

## Partea B — Shallow clone

**Comandă (stdin):** `SHALLOW Ana`

**Ce faci:**
1. Citește studenții din fișier (ca la Partea A)
2. Parsează comanda — extrage numele `Ana`
3. Găsește studentul cu acel nume
4. Implementează `clone()` în `Student` **doar cu `super.clone()`** (shallow)
5. Clonează studentul găsit
6. Modifică **orașul clonei** la `"MODIFICAT"`
7. Afișează originalul și clona

**Output (shallow — ambele afișează `MODIFICAT`):**
```
Original: Student{nume='Ana', varsta=19, adresa=Adresa{oras='MODIFICAT', strada='Calea Victoriei'}}
Clona: Student{nume='Ana', varsta=19, adresa=Adresa{oras='MODIFICAT', strada='Calea Victoriei'}}
```

> ⚠️ Observă: originalul a fost afectat! Aceasta este problema clonării superficiale.

---

## Partea C — Deep clone

**Comandă (stdin):** `DEEP Ana`

**Ce faci:**
1. Citește studenții din fișier (ca la Partea A)
2. Parsează comanda — extrage numele `Ana`
3. Găsește studentul, dar acum `Student.clone()` face **deep clone**:
   ```java
   @Override
   public Object clone() throws CloneNotSupportedException {
       Student clona = (Student) super.clone();
       clona.setAdresa((Adresa) this.adresa.clone());
       return clona;
   }
   ```
4. Clonează, modifică orașul clonei la `"MODIFICAT"`
5. Afișează originalul și clona

**Output (deep — originalul păstrează orașul inițial):**
```
Original: Student{nume='Ana', varsta=19, adresa=Adresa{oras='București', strada='Calea Victoriei'}}
Clona: Student{nume='Ana', varsta=19, adresa=Adresa{oras='MODIFICAT', strada='Calea Victoriei'}}
```

> ✅ Originalul nu a fost afectat — clonarea profundă funcționează corect.

---

## Cum diferă Partea B de Partea C?

Singura diferență este implementarea metodei `clone()` din clasa `Student`:

| Parte | `Student.clone()` | Rezultat |
|-------|-------------------|----------|
| B | `return super.clone();` | Shallow — originalul se modifică |
| C | `super.clone()` + `clona.setAdresa((Adresa) adresa.clone())` | Deep — originalul rămâne intact |

> 💡 **Indicație practică:** Poți folosi `Main.java` cu un singur program care decide comportamentul pe baza comenzii (`SHALLOW` vs. `DEEP`). Când comanda este `SHALLOW`, metoda `clone()` din `Student` face doar `super.clone()`. Când este `DEEP`, face și clonarea adresei. O modalitate simplă: două metode diferite (`shallowClone()` și `deepClone()`) sau un parametru boolean.

---

## Indicații

- Folosește `line.split(",")` pentru a parsa fiecare linie CSV
- `Integer.parseInt(parts[1].trim())` pentru vârstă
- Stochează studenții într-un `ArrayList<Student>`
- `Adresa` trebuie să implementeze `Cloneable` și să aibă `clone()` public — altfel deep clone nu funcționează
- Parsează comanda cu `split(" ", 2)` — primul element e tipul, al doilea e numele

---

## Testare automată

Deschide `Checker.java` și apasă **Run** în IntelliJ.
Testele se află în `tests/partA/`, `tests/partB/`, `tests/partC/`.
Directorul de lucru trebuie să fie rădăcina proiectului (`paoj-2026/`).
