    # Laboratory 12 — JDBC: Persistență, Tranzacții și Audit

> Pachet: `com.pao.laboratory12`
> Tip: laborator complet (2 exerciții obligatorii + 1 bonus)
> Fără `Checker.java` — testare manuală prin rularea `Main` și inspecție consolă + `audit.csv`.

---

## Obiective

Acest laborator acoperă **100%** din cerințele Etapei II a proiectului individual (13p din 25p):

| Rând barem Etapa II | Exercițiu |
|---------------------|-----------|
| 1. `schema.sql` (PK, ≥2 FK) + `db.properties` + `DatabaseConnection` singleton | Exercise 1 — Part A |
| 2. Interfață generică `Repository<T, ID>` | Exercise 1 — Part A |
| 3. CRUD complet pentru ≥4 entități | Exercise 1 — Part B |
| 4. Toate SQL-urile cu `PreparedStatement` + `try-with-resources` | Exercise 1 — Part B |
| 5. ≥1 tranzacție JDBC explicită cu `commit` / `rollback` | Exercise 2 |
| 6. ≥3 interogări SQL cu `JOIN` | Exercise 2 |
| 7. `AuditService` CSV thread-safe, apelat din 10 acțiuni | Exercise 2 |

---

## Structura laboratorului

```
laboratory12/
├── Readme.md                   ← ești aici
├── exercise1/
│   └── Readme.md               ← Part A (schema + conexiune + Repository<T,ID>)
│                                 Part B (CRUD pentru 4 entități)
├── exercise2/
│   └── Readme.md               ← tranzacții + JOIN + AuditService
├── exercise3/                  ← BONUS
│   └── Readme.md               ← MySQL vs SQLite vs H2, checklist proiect-ready
└── resources/
    ├── schema-mysql.sql        ← template schema MySQL (copy-paste în proiect)
    ├── schema-sqlite.sql       ← template schema SQLite (copy-paste în proiect)
    └── db.properties.template  ← template configurare conexiune
```

---

## Domeniu de lucru — mini-Bibliotecă

Toate exercițiile folosesc același domeniu cu 4 entități persistate:

| Entitate | Tabelă SQL | Relații |
|----------|------------|---------|
| `Author` | `author` | — |
| `Book`   | `book`    | FK → `author` |
| `Reader` | `reader`  | — |
| `Loan`   | `loan`    | FK → `book`, FK → `reader` |

Schema respectă cerința de **≥2 FOREIGN KEY** din barem.

---

## Setup rapid

### Opțiunea A — MySQL (recomandat pentru proiect)

1. Pornește MySQL local (XAMPP / MySQL Server / Docker).
2. Creează baza de date:
   ```sql
   CREATE DATABASE IF NOT EXISTS paoj_lab12 CHARACTER SET utf8mb4;
   ```
3. Rulează `resources/schema-mysql.sql` pe baza `paoj_lab12`.
4. Copiază `resources/db.properties.template` → `resources/db.properties` și completează credențialele.
5. Adaugă driverul MySQL JDBC în classpath (IntelliJ: `File → Project Structure → Modules → Dependencies → + JAR`):
   - Descarcă de la: https://dev.mysql.com/downloads/connector/j/
   - SAU adaugă în `pom.xml` dacă folosești Maven:
     ```xml
     <dependency>
       <groupId>com.mysql</groupId>
       <artifactId>mysql-connector-j</artifactId>
       <version>8.3.0</version>
     </dependency>
     ```

### Opțiunea B — SQLite (cel mai simplu, fără server)

1. Rulează direct — SQLite creează fișierul `lab12.db` automat.
2. Copiază `resources/db.properties.template` → `resources/db.properties` și setează:
   ```properties
   db.url=jdbc:sqlite:./lab12.db
   db.user=
   db.password=
   ```
3. Adaugă driverul SQLite JDBC în classpath:
   - Descarcă `sqlite-jdbc-x.y.z.jar` de la https://github.com/xerial/sqlite-jdbc/releases
   - SAU Maven:
     ```xml
     <dependency>
       <groupId>org.xerial</groupId>
       <artifactId>sqlite-jdbc</artifactId>
       <version>3.45.1.0</version>
     </dependency>
     ```
4. **Important SQLite**: adaugă `PRAGMA foreign_keys = ON;` la deschiderea conexiunii pentru a activa FK-urile.

### Opțiunea C — H2 in-memory (fără instalare, pentru test rapid)

- Driver Maven: `com.h2database:h2:2.2.224`
- URL: `jdbc:h2:mem:lab12;DB_CLOSE_DELAY=-1`
- Schema se rulează programatic la startup (vezi Exercise 3 bonus pentru detalii).
- **Atenție**: datele dispar la închiderea aplicației — nu persistă între rulări.

---

## Cum verifici că exercițiul e corect (fără Checker)

La finalul fiecărui exercițiu există un **Acceptance checklist**. Verifici manual:

1. Rulezi `Main.java` din exercițiul respectiv.
2. Consola afișează rezultatele așteptate (fără excepții negestionate).
3. Fișierul `audit.csv` conține 10 linii cu acțiunile executate (exercițiul 2).
4. Baza de date conține datele inserate (verifică cu un client SQL: DBeaver, TablePlus, SQLiteStudio).

---

## Timp estimat

| Exercițiu | Conținut | Timp |
|-----------|----------|------|
| Exercise 1 — Part A | schema + conexiune + Repository<T,ID> | ~30 min |
| Exercise 1 — Part B | CRUD 4 entități cu PreparedStatement | ~45 min |
| Exercise 2 | Tranzacții + JOIN + AuditService + Main | ~50 min |
| Exercise 3 (bonus) | MySQL vs SQLite vs H2 + checklist proiect | liber |

