# Proiect Individual — Programare Avansată pe Obiecte în Java (2026)

> **Pondere în nota finală: 25%**
> Fiecare student lucrează la un proiect individual, dezvoltat în două etape pe parcursul semestrului.

---

## Termene de predare

| Etapă    | Deadline                    | Branch Git     |
|----------|-----------------------------|----------------|
| Etapa I  | **joi, 24 aprilie, 23:59**  | `proiect-etapa1` |
| Etapa II | **joi, 5 iunie, 23:59**     | `proiect-etapa2` |

Predarea se face prin push pe branch-ul dedicat din fork-ul personal de pe GitHub, înainte de termenul limită.

```bash
# Etapa I
git checkout -b proiect-etapa1
git add .
git commit -m "Proiect Etapa I: implementare completa"
git push origin proiect-etapa1

# Etapa II (pornind de pe etapa1)
git checkout -b proiect-etapa2
git add .
git commit -m "Proiect Etapa II: JDBC, audit, tranzactii"
git push origin proiect-etapa2
```

---

## Condiții generale de punctare

- ✅ Proiectul **compilează** fără erori
- ✅ Toate cerințele etapei sunt implementate și demonstrabile din `Main`
- ✅ Codul este organizat în pachete (`com.pao.proiect.<tema_ta>`)
- ✅ Branch-ul este push-uit pe GitHub înainte de deadline

> ⚠️ Proiectele care nu compilează sau nu sunt trimise la timp **nu se punctează**.

---

## Teme sugerate

| #  | Temă                                                                      |
|----|---------------------------------------------------------------------------|
| 1  | Catalog școlar (studenți, materii, profesori, note)                       |
| 2  | Bibliotecă (secțiuni, cărți, autori, cititori, împrumuturi)               |
| 3  | Cabinet medical (pacienți, medici, programări, consultații)               |
| 4  | Gestiune stocuri magazin (categorii, produse, furnizori, comenzi)         |
| 5  | Aplicație bancară (conturi, carduri, tranzacții, extrase de cont)         |
| 6  | Platformă e-learning (cursuri, utilizatori, cursanți, quiz-uri, scoruri)  |
| 7  | Sistem licitații (licitații, oferte, produse, utilizatori)                |
| 8  | Platformă food delivery (restaurante, meniuri, comenzi, șoferi, clienți)  |
| 9  | Platformă împrumuturi cărți — tip Bookster (companii, utilizatori, cărți) |
| 10 | Platformă e-ticketing (evenimente, locații, bilete, clienți)              |

> Poți propune și o altă temă — trimite-o spre aprobare **înainte** de a începe implementarea,
> prin formularul de înregistrare a proiectului.

---

## Etapa I — Modelare și implementare OOP

> **Deadline: joi, 24 aprilie, 23:59**

### 1. Definirea sistemului

Creează un fișier `README.md` în folderul proiectului tău care să conțină:

#### 1.1 — Lista cu cel puțin 10 acțiuni / interogări posibile în sistem

Exemple (pentru tema *Bibliotecă*):
- Adaugă o carte nouă în bibliotecă
- Înregistrează un cititor nou
- Împrumută o carte unui cititor
- Returnează o carte
- Caută cărți după autor
- Listează toate cărțile dintr-o secțiune
- Afișează istoricul împrumuturilor unui cititor
- Verifică disponibilitatea unei cărți
- Afișează cărțile cu cele mai multe împrumuturi
- Elimină un cititor din sistem

#### 1.2 — Lista cu cel puțin 8 tipuri de obiecte din domeniu

Exemple (pentru tema *Bibliotecă*):
`Carte`, `Autor`, `Cititor`, `Sectiune`, `Imprumut`, `Bibliotecă`, `Exemplar`, `Rezervare`

---

### 2. Implementare Java

#### 2.1 — Clase și OOP

- [ ] Cel puțin **8 clase** care modelează obiectele definite la punctul 1
- [ ] Atribute **`private`** sau **`protected`**, cu getteri/setteri acolo unde e necesar
- [ ] Metode `toString()`, `equals()` și `hashCode()` suprascrise la cel puțin **2 clase**
- [ ] Cel puțin **o ierarhie de moștenire** (`extends`) cu minim **2 niveluri**
  _(ex: `Persoana` → `Angajat` → `Manager`, sau `Persoana` → `Student` + `Profesor`)_
- [ ] Cel puțin **o clasă abstractă** sau **o interfață** folosită în ierarhie
  _(ex: clasă abstractă `Persoana` cu metodă abstractă `getRol()`)_
- [ ] Cel puțin **o clasă imutabilă**: atribute `final`, fără setteri, inițializate complet în constructor
  _(ex: `ISBN`, `CodProdus`, `TransactionRecord` — un tip de identificator sau înregistrare read-only)_
- [ ] Cel puțin **2 excepții custom** aruncate și tratate în cod
  _(ex: `CarteNedisponibilaException`, `CititorNegasitException`)_

#### 2.2 — Colecții

- [ ] Cel puțin **2 tipuri diferite de colecții** (`List`, `Set`, `Map`, `Queue`, etc.)
- [ ] Cel puțin **una sortată** — prin implementarea `Comparable` pe clasă sau prin `Comparator`
  _(ex: `TreeSet<Carte>` sortate după titlu, sau `List<Student>` sortată după medie cu `Collections.sort`)_
- [ ] Cel puțin **un `Map`** folosit pentru indexare sau grupare
  _(ex: `Map<String, List<Carte>>` — cărți grupate pe autor, `Map<String, Cont>` — conturi indexate după IBAN)_

#### 2.3 — Servicii

- [ ] Cel puțin **2 clase de serviciu** care expun operațiile sistemului
  _(ex: `CarteService`, `CititorService` — fiecare gestionează operații pentru un tip de obiect)_
- [ ] Fiecare serviciu implementat ca **Singleton** (constructor privat + metodă statică `getInstance()`)
- [ ] Serviciile expun cel puțin operațiile: **adaugă, șterge, caută după id/nume, listează toate**
- [ ] O clasă **`Main`** care apelează **toate cele 10 acțiuni** definite la punctul 1,
  demonstrând funcționarea completă a sistemului

#### 2.4 — Organizare și calitate

- [ ] Codul organizat în **sub-pachete** logice:
  ```
  com.pao.proiect.<tema>/
  ├── model/        ← clasele de domeniu
  ├── service/      ← serviciile singleton
  ├── exception/    ← excepțiile custom
  └── Main.java
  ```
- [ ] Fără cod duplicat — logica comună extrasă în metode sau clase de bază
- [ ] Fără `NullPointerException` la rulare — validează inputurile în servicii

---

## Etapa II — Persistență JDBC, Tranzacții și Audit

> **Deadline: joi, 5 iunie, 23:59**
> Etapa II extinde proiectul din Etapa I — nu rescrii de la zero, ci adaugi straturi noi.

### 1. Bază de date relațională + JDBC

#### 1.1 — Schema bazei de date

- [ ] Fișier **`schema.sql`** inclus în rădăcina proiectului, care conține:
  - `CREATE TABLE` pentru fiecare entitate persistată
  - **Chei primare** (`PRIMARY KEY`) pentru toate tabelele
  - **Cel puțin 2 relații** de tip `FOREIGN KEY` între tabele
  - `DROP TABLE IF EXISTS` la început (pentru re-rulare curată)

- [ ] Fișier **`db.properties`** în `resources/` pentru configurarea conexiunii:
  ```properties
  db.url=jdbc:mysql://localhost:3306/paoj_proiect
  db.user=root
  db.password=parola_ta
  ```
  > Nu hardcoda credențialele direct în cod Java.

#### 1.2 — Conexiunea la baza de date

- [ ] Clasa **`DatabaseConnection`** implementată ca **Singleton**,
  care citește configurația din `db.properties` și expune un `Connection` reutilizabil

#### 1.3 — Interfață generică Repository

- [ ] Definește interfața generică:
  ```java
  public interface Repository<T, ID> {
      void save(T entity);
      Optional<T> findById(ID id);
      List<T> findAll();
      void update(T entity);
      void delete(ID id);
  }
  ```
- [ ] Implementează câte un **repository concret** pentru cel puțin **4 dintre clasele** din Etapa I
  _(ex: `CarteRepository`, `CititorRepository`, `ImprumutRepository`, `AutorRepository`)_
- [ ] Toate interogările SQL folosesc **`PreparedStatement`** — nu `Statement` cu concatenare de string-uri
- [ ] Toate resursele (`Connection`, `PreparedStatement`, `ResultSet`) sunt închise corect cu **`try-with-resources`**

### 2. Tranzacții JDBC

- [ ] Cel puțin **o operație care afectează mai multe tabele** trebuie executată
  într-o **tranzacție JDBC explicită**, cu `commit` la succes și `rollback` la eroare:

  ```java
  connection.setAutoCommit(false);
  try {
      // operatie 1 pe tabela A
      // operatie 2 pe tabela B
      connection.commit();
  } catch (SQLException e) {
      connection.rollback();
      throw e;
  } finally {
      connection.setAutoCommit(true);
  }
  ```

  > Exemple: plasarea unui împrumut (inserează în `Imprumuturi` + actualizează `disponibil` în `Carti`),
  > procesarea unei plăți (debitează un cont + creditează altul), plasarea unei comenzi (inserează comanda + scade stocul).

### 3. Interogări avansate cu JOIN

- [ ] Implementează cel puțin **3 interogări SQL cu JOIN** care combină date din mai multe tabele,
  expuse ca metode în servicii sau repository-uri

  > Exemple (adaptează la tema ta):
  > - Listează toți cititorii cu numărul de cărți împrumutate în prezent
  > - Afișează cărțile împrumutate cel mai des, cu numele autorului
  > - Returnează toate împrumuturile active (nereturnate), cu datele cititorului și cărții
  > - Top 5 produse vândute, cu categoria lor
  > - Toate comenzile unui client, cu totalul calculat din produsele aferente

### 4. Serviciu de audit

- [ ] Implementează clasa **`AuditService`** (Singleton) care loghează fiecare acțiune executată
  într-un fișier `audit.csv`:

  ```
  nume_actiune,timestamp
  adauga_carte,2026-04-21T10:35:42
  cauta_cititor,2026-04-21T10:36:01
  imprumuta_carte,2026-04-21T10:36:15
  ```

- [ ] **Toate cele 10 acțiuni** definite în Etapa I trebuie să apeleze `AuditService` la execuție
- [ ] Fișierul se deschide în modul **append** — nu se suprascrie la fiecare rulare a aplicației
- [ ] `AuditService` este **thread-safe**: folosește `synchronized` sau `ReentrantLock`
  pe metoda de scriere

---

## Structura recomandată a proiectului

```
src/
└── com/pao/proiect/<tema_ta>/
    ├── Main.java
    ├── model/
    │   ├── Carte.java
    │   ├── Cititor.java
    │   └── ...
    ├── service/
    │   ├── CarteService.java
    │   ├── CititorService.java
    │   └── AuditService.java
    ├── repository/
    │   ├── Repository.java              ← interfața generică
    │   ├── CarteRepository.java
    │   └── ...
    ├── exception/
    │   ├── CarteNedisponibilaException.java
    │   └── ...
    └── util/
        └── DatabaseConnection.java
resources/
    ├── schema.sql
    └── db.properties
README.md                                ← definirea sistemului (Etapa I, punctul 1)
```

---

## Criterii de evaluare

### Etapa I — 12 puncte din 25

| Criteriu                                                         | Punctaj |
|------------------------------------------------------------------|---------|
| README: 10 acțiuni + 8 tipuri de obiecte                         | 1p      |
| ≥8 clase cu atribute private, getteri/setteri, `toString`        | 2p      |
| Ierarhie moștenire (≥2 niveluri) + clasă abstractă / interfață   | 2p      |
| Clasă imutabilă + ≥2 excepții custom                             | 1p      |
| ≥2 colecții diferite (una sortată) + ≥1 Map                      | 2p      |
| ≥2 servicii Singleton cu operații CRUD în memorie                | 2p      |
| `Main` demonstrativ care apelează toate cele 10 acțiuni          | 1p      |
| Organizare în pachete, fără duplicat, fără NPE                   | 1p      |
| **Total Etapa I**                                                | **12p** |

### Etapa II — 13 puncte din 25

| Criteriu                                                              | Punctaj |
|-----------------------------------------------------------------------|---------|
| `schema.sql` complet (PK, ≥2 FK) + `db.properties` + `DatabaseConnection` singleton | 1p      |
| Interfață generică `Repository<T, ID>`                                | 1p      |
| CRUD complet (save, findById, findAll, update, delete) pentru ≥4 entități | 4p      |
| Toate SQL-urile folosesc `PreparedStatement` + `try-with-resources`   | 2p      |
| ≥1 tranzacție JDBC explicită cu `commit` / `rollback`                 | 2p      |
| ≥3 interogări SQL cu `JOIN`                                           | 2p      |
| `AuditService` CSV thread-safe, apelat din toate cele 10 acțiuni      | 1p      |
| **Total Etapa II**                                                    | **13p** |

> **Total maxim: 25p**
>
> Punctele rămase până la 25 față de totalul etapelor (12 + 13 = 25) pot fi acoperite și din
> [bonusurile de la laboratoare](../../../../../../README.md#-bonus-până-la-5----adăugat-la-scorul-combinat-laborator--proiect)
> (+0.5% per bonus, max +5% adăugat la scorul combinat laborator + proiect).

---

## Întrebări frecvente

### Pot folosi un ORM (Hibernate, JPA)?
Nu. Scopul Etapei II este înțelegerea JDBC direct. Utilizarea unui ORM înseamnă că cerința nu este îndeplinită.

### Pot folosi SQLite în loc de MySQL / PostgreSQL?
Da, SQLite este acceptat și mai simplu de configurat local (nu necesită server). Asigură-te că incluzi
driverul JDBC în proiect și că `schema.sql` rulează corect cu SQLite.

### Trebuie să am interfață grafică (GUI)?
Nu. O interfață consolă (`Scanner` + meniu text) este complet suficientă.

### Cum aleg tema?
Alegi din lista de mai sus sau propui o temă nouă prin formularul de înregistrare. Odată tema înregistrată,
o poți schimba doar cu acordul asistentului.

### Pot lucra pe același branch cu laboratoarele?
Nu. Proiectul se trimite pe branch-uri separate (`proiect-etapa1`, `proiect-etapa2`),
distinct față de branch-urile de laborator (`lab5`, `lab6`, etc.).

