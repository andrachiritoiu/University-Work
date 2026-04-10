# Laboratory 05 — Records, Comparable aprofundat, Comparator multiplu

> **Pachet:** `com.pao.laboratory05` · **Curs:** 01–04 · 
> **Data limită:** miercuri 25 martie 2026, ora 23:59

---

<details open>
<summary><h2>Obiective</h2></summary>

1. **`record`** — sintaxă, ce generează compilatorul automat, când îl folosești
2. **`record` + interfețe** — un `record` poate implementa `Comparable`
3. **`Comparable<T>`** — sortare naturală (una singură per clasă, `compareTo`)
4. **`Comparator<T>`** — sortări alternative (oricâte, clase externe)
5. **`Arrays.sort`** — cu sortare naturală și cu `Comparator`
6. **Singleton + array resize** — recapitulare pattern-ul din Lab 01

> 🎯 **De data aceasta scrii TOATE fișierele `.java` de la zero.**
> `Main.java` din fiecare pachet este doar punctul de pornire — înlocuiește
> `System.out.println(...)` cu codul real după ce ai creat clasele necesare.

</details>

---

## Fișiere din acest laborator

| Fișier | Rol |
|--------|-----|
| [playlist/Readme.md](playlist/Readme.md) | Java Records quick reference — citește înainte de Exercise 1 |
| [playlist/Main.java](playlist/Main.java) | Exercise 1 — punct de intrare, creezi restul |
| [biblioteca/Main.java](biblioteca/Main.java) | Exercise 2 — punct de intrare, creezi restul |
| [angajati/Main.java](angajati/Main.java) | Exercise 3 — punct de intrare, creezi restul |
| [audit/Main.java](audit/Main.java) | Exercise 4 Bonus — punct de intrare, creezi restul |

---

## Exerciții

| # | Pachet | Domeniu | Concept principal | Timp estimat |
|---|--------|---------|-------------------|--------------|
| 1 | `playlist/` | Playlist muzică | `record` + `Comparable` + `Comparator` | ~30 min |
| 2 | `biblioteca/` | Bibliotecă | clasă obișnuită + `Comparable` + 2 `Comparator`-uri + Singleton | ~35 min |
| 3 | `angajati/` | Angajați | `record` pentru date simple + `Comparable` + Singleton + meniu | ~40 min |
| 4 *(bonus)* | `audit/` | Audit log | `record` imutabil ca înregistrare de audit | ~30 min |

---

## Exercise 1 — Playlist

📄 **Pachet:** [playlist/](playlist/) · 📖 **Pre-citire:** [playlist/Readme.md](playlist/Readme.md) — Java Records quick reference (Levels 1–4)

### Ce creezi (toate fișierele în `com.pao.laboratory05.playlist`)

#### `Song.java` — record
```java
public record Song(String title, String artist, int durationSeconds)
        implements Comparable<Song> {
    // compareTo: sortare după titlu (alfabetic)
    // Hint: String are deja compareTo — folosește-l
}
```

Un `record` generează **automat**:
- constructor cu toți parametrii
- getteri cu același nume ca parametrii (`title()`, `artist()`, `durationSeconds()`)
- `toString()`, `equals()`, `hashCode()`

Tu adaugi doar `implements Comparable<Song>` și `compareTo`.

#### `SongDurationComparator.java` — Comparator extern
```java
public class SongDurationComparator implements Comparator<Song> {
    // compare: sortare după durationSeconds crescător
}
```

#### `Playlist.java` — clasă cu array de Song-uri
Câmpuri:
- `private String name`
- `private Song[] songs` (inițializat ca `new Song[0]`)

Metode:
- `Playlist(String name)` — constructor
- `void addSong(Song song)` — adaugă cu pattern-ul de resize (`System.arraycopy`)
- `void printSortedByTitle()` — clonează array-ul, `Arrays.sort(copy)`, afișează
- `void printSortedByDuration()` — clonează, `Arrays.sort(copy, new SongDurationComparator())`, afișează
- `int getTotalDuration()` — suma `durationSeconds` din toate song-urile

> ⚠️ Clonează întotdeauna înainte de sort (`Song[] copy = songs.clone()`)
> ca să nu modifici ordinea originală din playlist.

#### `Main.java` — completează cu:
```java
Playlist playlist = new Playlist("Road Trip");
playlist.addSong(new Song("Waterloo", "ABBA", 174));
playlist.addSong(new Song("Bohemian Rhapsody", "Queen", 354));
playlist.addSong(new Song("Imagine", "John Lennon", 187));
playlist.addSong(new Song("Smells Like Teen Spirit", "Nirvana", 301));

System.out.println("=== " + playlist.getName() + " ===");
System.out.println("Durata totală: " + playlist.getTotalDuration() + "s\n");

System.out.println("--- Sortate după titlu ---");
playlist.printSortedByTitle();

System.out.println("\n--- Sortate după durată ---");
playlist.printSortedByDuration();
```

<details>
<summary><b>Output așteptat</b></summary>

```
=== Road Trip ===
Durata totală: 1016s

--- Sortate după titlu ---
Song[title=Bohemian Rhapsody, artist=Queen, durationSeconds=354]
Song[title=Imagine, artist=John Lennon, durationSeconds=187]
Song[title=Smells Like Teen Spirit, artist=Nirvana, durationSeconds=301]
Song[title=Waterloo, artist=ABBA, durationSeconds=174]

--- Sortate după durată ---
Song[title=Waterloo, artist=ABBA, durationSeconds=174]
Song[title=Imagine, artist=John Lennon, durationSeconds=187]
Song[title=Smells Like Teen Spirit, artist=Nirvana, durationSeconds=301]
Song[title=Bohemian Rhapsody, artist=Queen, durationSeconds=354]
```

> 📌 `toString()` pentru record arată exact `Song[title=..., artist=..., durationSeconds=...]`
> — e generat automat, nu trebuie să-l scrii tu.

</details>

---

## Exercise 2 — Bibliotecă

📄 **Pachet:** [biblioteca/](biblioteca/)

### Ce creezi (toate fișierele în `com.pao.laboratory05.biblioteca`)

#### `Carte.java` — clasă obișnuită cu `Comparable`
Câmpuri private: `String titlu`, `String autor`, `int an`, `double rating`

- Constructor complet
- Getteri pentru toate câmpurile
- `toString()` → `"Carte{titlu='...', autor='...', an=..., rating=...}"`
- `implements Comparable<Carte>` — **sortare după `rating` descrescător**
  (cel mai bine cotat apare primul)

#### `CarteAnComparator.java` — Comparator extern
Sortare după `an` crescător (cea mai veche apare prima).

#### `CarteAutorComparator.java` — Comparator extern
Sortare după `autor` alfabetic.

#### `BibliotecaService.java` — Singleton
- Constructor privat, `getInstance()` cu Holder intern (pattern din Lab 01)
- Câmp: `private Carte[] carti` (inițializat `new Carte[0]`)
- `void addCarte(Carte carte)` — resize + adaugă + printează confirmare
- `void listSortedByRating()` — clonează, `Arrays.sort(copy)` (natural = `Comparable`), afișează
- `void listSortedBy(Comparator<Carte> comparator)` — clonează, `Arrays.sort(copy, comparator)`, afișează

#### `Main.java` — completează cu:
```java
BibliotecaService biblioteca = BibliotecaService.getInstance();
biblioteca.addCarte(new Carte("Ion", "Liviu Rebreanu", 1920, 4.5));
biblioteca.addCarte(new Carte("Moromeții", "Marin Preda", 1955, 4.8));
biblioteca.addCarte(new Carte("Enigma Otiliei", "George Călinescu", 1938, 4.3));
biblioteca.addCarte(new Carte("Baltagul", "Mihail Sadoveanu", 1930, 4.6));

System.out.println("\n--- După rating (descrescător) ---");
biblioteca.listSortedByRating();

System.out.println("\n--- După an (crescător) ---");
biblioteca.listSortedBy(new CarteAnComparator());

System.out.println("\n--- După autor (alfabetic) ---");
biblioteca.listSortedBy(new CarteAutorComparator());
```

<details>
<summary><b>Output așteptat</b></summary>

```
Carte adăugată: Ion
Carte adăugată: Moromeții
Carte adăugată: Enigma Otiliei
Carte adăugată: Baltagul

--- După rating (descrescător) ---
1. Carte{titlu='Moromeții', autor='Marin Preda', an=1955, rating=4.8}
2. Carte{titlu='Baltagul', autor='Mihail Sadoveanu', an=1930, rating=4.6}
3. Carte{titlu='Ion', autor='Liviu Rebreanu', an=1920, rating=4.5}
4. Carte{titlu='Enigma Otiliei', autor='George Călinescu', an=1938, rating=4.3}

--- După an (crescător) ---
1. Carte{titlu='Ion', autor='Liviu Rebreanu', an=1920, rating=4.5}
2. Carte{titlu='Baltagul', autor='Mihail Sadoveanu', an=1930, rating=4.6}
3. Carte{titlu='Enigma Otiliei', autor='George Călinescu', an=1938, rating=4.3}
4. Carte{titlu='Moromeții', autor='Marin Preda', an=1955, rating=4.8}

--- După autor (alfabetic) ---
1. Carte{titlu='Enigma Otiliei', autor='George Călinescu', an=1938, rating=4.3}
2. Carte{titlu='Ion', autor='Liviu Rebreanu', an=1920, rating=4.5}
3. Carte{titlu='Moromeții', autor='Marin Preda', an=1955, rating=4.8}
4. Carte{titlu='Baltagul', autor='Mihail Sadoveanu', an=1930, rating=4.6}
```

</details>

---

## Exercise 3 — Angajați

📄 **Pachet:** [angajati/](angajati/)

### Ce creezi (toate fișierele în `com.pao.laboratory05.angajati`)

#### `Departament.java` — record
```java
public record Departament(String nume, String locatie) { }
```
Record-ul generează automat `toString()` → `Departament[nume=..., locatie=...]`,
`equals()` (compară câmpurile), getteri `nume()` și `locatie()`.

**Observație:** `findByDepartament` din service va folosi `departament.nume()` pentru a compara,
deci `equals()` pe record este folosit indirect (sau poți compara cu `equalsIgnoreCase`).

#### `Angajat.java` — clasă obișnuită cu `Comparable`
Câmpuri private: `String nume`, `Departament departament`, `double salariu`

- Constructor complet
- Getteri
- `toString()` → `"Angajat{nume='...', departament=Departament[nume=..., locatie=...], salariu=...}"`
- `implements Comparable<Angajat>` — **sortare după `salariu` descrescător**
  (cel mai bine plătit apare primul)

#### `AngajatService.java` — Singleton
- Constructor privat, `getInstance()` cu Holder intern
- Câmp: `private Angajat[] angajati` (inițializat `new Angajat[0]`)
- `void addAngajat(Angajat a)` — resize + adaugă + printează confirmare
- `void printAll()` — afișează toți angajații (ordinea din array, nesortat)
- `void listBySalary()` — clonează, `Arrays.sort(copy)`, afișează (descrescător, natural)
- `void findByDepartament(String numeDept)` — parcurge array-ul, afișează toți angajații
  al căror `angajat.getDepartament().nume().equalsIgnoreCase(numeDept)`; dacă nu găsește
  niciun angajat, afișează `"Niciun angajat în departamentul: <numeDept>"`

#### `Main.java` — meniu interactiv cu `Scanner`

```java
while (true) {
    System.out.println("\n===== Gestionare Angajați =====");
    System.out.println("1. Adaugă angajat");
    System.out.println("2. Listare după salariu");
    System.out.println("3. Caută după departament");
    System.out.println("0. Ieșire");
    System.out.print("Opțiune: ");
    // citește opțiunea și execută acțiunea
}
```

Opțiunea 1 citește: `nume` (String), `numeDepartament` (String), `locatieDepartament` (String),
`salariu` (double) — construiește `Departament` și `Angajat`, apelează `addAngajat`.

<details>
<summary><b>Exemplu interacțiune</b></summary>

```
===== Gestionare Angajați =====
1. Adaugă angajat
2. Listare după salariu
3. Caută după departament
0. Ieșire
Opțiune: 1
Nume: Ana
Departament (nume): IT
Departament (locatie): Cluj
Salariu: 7500
Angajat adăugat: Ana

===== Gestionare Angajați =====
Opțiune: 1
Nume: Mihai
Departament (nume): HR
Departament (locatie): București
Salariu: 5200
Angajat adăugat: Mihai

===== Gestionare Angajați =====
Opțiune: 1
Nume: Elena
Departament (nume): IT
Departament (locatie): Cluj
Salariu: 8900
Angajat adăugat: Elena

===== Gestionare Angajați =====
Opțiune: 2
--- Angajați după salariu (descrescător) ---
1. Angajat{nume='Elena', departament=Departament[nume=IT, locatie=Cluj], salariu=8900.0}
2. Angajat{nume='Ana', departament=Departament[nume=IT, locatie=Cluj], salariu=7500.0}
3. Angajat{nume='Mihai', departament=Departament[nume=HR, locatie=București], salariu=5200.0}

===== Gestionare Angajați =====
Opțiune: 3
Departament: IT
--- Angajați din IT ---
Angajat{nume='Ana', departament=Departament[nume=IT, locatie=Cluj], salariu=7500.0}
Angajat{nume='Elena', departament=Departament[nume=IT, locatie=Cluj], salariu=8900.0}

===== Gestionare Angajați =====
Opțiune: 0
La revedere!
```

</details>

---

## Exercise 4 (Bonus) — Audit Log

📄 **Pachet:** [audit/](audit/)

> ⏱️ Pre-rechizit: termină Exercise 3 mai întâi.

### Ce creezi (toate fișierele în `com.pao.laboratory05.audit`)

Copiază clasele `Departament.java`, `Angajat.java` din `angajati/` în pachetul `audit/`
(ajustează declarația `package`). Vei extinde `AngajatService` cu audit.

#### `AuditEntry.java` — record
```java
public record AuditEntry(String action, String target, String timestamp) { }
```
- `action` — ce s-a făcut (ex: `"ADD"`, `"FIND_BY_DEPT"`)
- `target` — obiectul afectat (ex: numele angajatului sau numele departamentului)
- `timestamp` — momentul acțiunii; folosește `java.time.LocalDateTime.now().toString()`

#### `AngajatService.java` — Singleton cu audit
Același ca la Ex3, plus:
- Câmp suplimentar: `private AuditEntry[] auditLog` (inițializat `new AuditEntry[0]`)
- Metodă privată `logAction(String action, String target)` — creează un `AuditEntry`
  cu `LocalDateTime.now().toString()` și îl adaugă în `auditLog` (resize pattern)
- `addAngajat` → apelează `logAction("ADD", angajat.getNume())` după adăugare
- `findByDepartament` → apelează `logAction("FIND_BY_DEPT", numeDept)` la început
- `void printAuditLog()` — parcurge și afișează toate intrările

#### `Main.java` — meniu extins față de Ex3, cu opțiunea extra:
```
4. Afișează audit log
```

<details>
<summary><b>Exemplu output audit</b></summary>

```
===== Gestionare Angajați (cu Audit) =====
Opțiune: 4
--- Audit Log ---
AuditEntry[action=ADD, target=Ana, timestamp=2026-03-23T10:15:32.123]
AuditEntry[action=ADD, target=Mihai, timestamp=2026-03-23T10:15:45.456]
AuditEntry[action=ADD, target=Elena, timestamp=2026-03-23T10:16:01.789]
AuditEntry[action=FIND_BY_DEPT, target=IT, timestamp=2026-03-23T10:16:10.012]
```

> 📌 `toString()` al `AuditEntry` este generat automat de `record` —
> arată exact `AuditEntry[action=..., target=..., timestamp=...]`.

</details>

---

<details open>
<summary><h2>Cheat Sheet</h2></summary>

### `record` — sintaxă și ce primești gratuit

```java
public record Song(String title, String artist, int durationSeconds) { }
```

| Ce generează compilatorul | Echivalent manual |
|--------------------------|-------------------|
| `Song(String title, String artist, int durationSeconds)` | constructor complet |
| `title()`, `artist()`, `durationSeconds()` | getteri (fără `get` prefix!) |
| `toString()` | `"Song[title=..., artist=..., durationSeconds=...]"` |
| `equals(Object o)` | compară câmp cu câmp |
| `hashCode()` | consistent cu `equals` |

**Record + interfață:**
```java
public record Song(String title, String artist, int durationSeconds)
        implements Comparable<Song> {
    @Override
    public int compareTo(Song other) {
        return this.title.compareTo(other.title);
    }
}
```

**Când folosești `record` vs clasă obișnuită:**

| `record` | clasă obișnuită |
|----------|----------------|
| Date simple, imutabile | Nevoie de setteri / stare mutabilă |
| Nu vrei să scrii boilerplate | Vrei să controlezi `toString`, `equals` |
| Valori de transport (DTO, log entry) | Logică de business complexă |

---

### `Comparable<T>` vs `Comparator<T>`

| | `Comparable<T>` | `Comparator<T>` |
|---|-----------------|-----------------|
| **Unde** | în clasa modelului | clasă externă separată |
| **Metoda** | `compareTo(T o)` | `compare(T o1, T o2)` |
| **Câte** | una singură | oricâte |
| **Utilizare** | `Arrays.sort(arr)` | `Arrays.sort(arr, comparator)` |
| **Numire** | sortare **naturală** | sortare **alternativă** |

**Regula de returnare:**

| Returnează | Semnificație |
|-----------|-------------|
| negativ | `this` (sau `o1`) vine **înainte** |
| `0` | egale |
| pozitiv | `this` (sau `o1`) vine **după** |

**Descrescător** — inversezi semnul:
```java
// Descrescător după salariu:
@Override
public int compareTo(Angajat other) {
    return Double.compare(other.salariu, this.salariu); // other - this = descrescător
}
```

**Comparare String:** `this.title.compareTo(other.title)` — alfabetic crescător.

---

### `Arrays.sort` — variante

```java
Arrays.sort(arr);                          // natural (Comparable)
Arrays.sort(arr, new MyComparator());      // Comparator extern
Arrays.sort(arr, (a, b) -> ...);           // lambda (Comparator anonim)
```

**Clonare înainte de sort** (ca să păstrezi ordinea originală):
```java
Song[] copy = songs.clone();
Arrays.sort(copy);
```

---

### Pattern Singleton + resize (recapitulare din Lab 01)

```java
public class BibliotecaService {
    private Carte[] carti = new Carte[0];

    private BibliotecaService() {}

    private static class Holder {
        private static final BibliotecaService INSTANCE = new BibliotecaService();
    }

    public static BibliotecaService getInstance() {
        return Holder.INSTANCE;
    }

    public void addCarte(Carte carte) {
        Carte[] tmp = new Carte[carti.length + 1];
        System.arraycopy(carti, 0, tmp, 0, carti.length);
        tmp[tmp.length - 1] = carte;
        carti = tmp;
    }
}
```

</details>

---

## Ce urmează la Laboratory 05?
- Generics (`<T>`, bounded types, wildcards)
- Stream API & lambdas (introducere)
- Colecții generice (`List<T>`, `Set<T>`)

---

## FAQ

<details>
<summary><b>1. De ce getterul unui record se cheamă <code>title()</code> și nu <code>getTitle()</code>?</b></summary>

`record` urmează o convenție diferită față de clasele obișnuite — accesorul are **același nume cu câmpul**.
Clasele obișnuite folosesc `getTitle()` prin convenție JavaBeans (pentru frameworks ca Spring/JPA).
`record` nu urmează JavaBeans — e o structură de date simplă, nu un bean.

```java
Song s = new Song("Imagine", "John Lennon", 187);
s.title();           // ✅ record accessor
s.getTitle();        // ❌ nu există!
```

</details>

<details>
<summary><b>2. Pot modifica câmpurile unui record după creare?</b></summary>

**Nu.** Record-urile sunt **imutabile** — câmpurile sunt `final` implicit.
Nu există setteri. Dacă ai nevoie de un obiect modificabil, folosește o clasă obișnuită.

```java
Song s = new Song("Imagine", "John Lennon", 187);
// s.title = "altceva";   // ❌ eroare de compilare — câmp final
```

</details>

<details>
<summary><b>3. Pot adăuga metode custom unui record?</b></summary>

**Da.** Poți adăuga orice metodă, constructor compact, sau implementa interfețe:

```java
public record Song(String title, String artist, int durationSeconds)
        implements Comparable<Song> {

    // metodă custom
    public String formattedDuration() {
        return durationSeconds / 60 + ":" + String.format("%02d", durationSeconds % 60);
    }

    // interfață implementată
    @Override
    public int compareTo(Song other) {
        return this.title.compareTo(other.title);
    }
}
```

</details>

<details>
<summary><b>4. De ce clonez array-ul înainte de sort?</b></summary>

`Arrays.sort` sortează **in-place** — modifică array-ul original.
Dacă vrei să afișezi de mai multe ori în ordini diferite fără să pierzi ordinea de inserare, clonezi:

```java
Song[] copy = songs.clone();   // array nou, referințe la aceleași obiecte
Arrays.sort(copy);             // sortează copia, originalul rămâne intact
```

`clone()` pe array face o **copie superficială** (shallow) — obiectele nu sunt duplicate,
doar referințele. E suficient pentru sortare.

</details>

<details>
<summary><b>5. Cum compar <code>double</code> în <code>compareTo</code>?</b></summary>

Evită scăderea (`a - b`) pentru `double` — poate da rezultate greșite din cauza preciziei floating-point.
Folosește `Double.compare`:

```java
// Descrescător după rating:
@Override
public int compareTo(Carte other) {
    return Double.compare(other.getRating(), this.getRating());
}

// Crescător:
return Double.compare(this.getRating(), other.getRating());
```

</details>

<details>
<summary><b>6. Cum funcționează Singleton Holder? De ce nu <code>static INSTANCE</code> direct?</b></summary>

```java
// ❌ Varianta simplă — instanța se creează la încărcarea clasei (eager)
private static final BibliotecaService INSTANCE = new BibliotecaService();

// ✅ Holder — instanța se creează doar la primul apel (lazy), thread-safe
private static class Holder {
    private static final BibliotecaService INSTANCE = new BibliotecaService();
}
```

Holder-ul este o clasă internă statică — JVM o încarcă **doar când e accesată prima dată**,
adică la primul `getInstance()`. E garantat thread-safe de specificația JVM.

</details>

<details>
<summary><b>7. Legătura cu proiectul individual</b></summary>

| Ce faci în Lab 04 | Ce vei folosi în proiect |
|-------------------|--------------------------|
| `record` pentru date simple | DTO-uri, intrări de audit |
| `Comparable` pe model | sortare naturală în serviciu |
| `Comparator` extern | sortări alternative la cerere |
| Singleton + array resize | servicii de gestiune obiecte |
| Meniu interactiv | interfața utilizator (Main) |
| Audit log cu `record` | **Etapa II** — serviciu de audit CSV |

</details>







