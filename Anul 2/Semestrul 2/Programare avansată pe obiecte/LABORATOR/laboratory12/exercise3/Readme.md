# Exercise 3 (Bonus) — MySQL vs SQLite vs H2 și Checklist Proiect-Ready

> Pachet: `com.pao.laboratory12`
> Bonus = puncte extra la proiect; nu este obligatoriu pentru nota de laborator.
> Evaluare: manuală — demonstrează rularea pe ≥2 baze de date diferite cu același cod Java.

---

## Obiective

1. Înțelege diferențele concrete între MySQL, SQLite și H2 din perspectiva JDBC.
2. Configurezi proiectul să comute între BD schimbând doar `db.properties` + schema.
3. Bifezi checklist-ul complet "proiect Etapa II ready" înainte de deadline.

---

# Parte 1 — Diferențe MySQL vs SQLite vs H2

## Tabel comparativ

| Aspect | MySQL | SQLite | H2 in-memory |
|--------|-------|--------|--------------|
| **Instalare** | Server separat (XAMPP, Docker) | Fișier local `.db` — zero instalare | Jar inclus în classpath |
| **Persistență** | Permanentă pe server | Permanentă în fișier `.db` | Dispare la restart (`mem:`) |
| **Driver class** | `com.mysql.cj.jdbc.Driver` | `org.sqlite.JDBC` | `org.h2.Driver` |
| **URL format** | `jdbc:mysql://host:3306/db?params` | `jdbc:sqlite:./fisier.db` | `jdbc:h2:mem:lab12;DB_CLOSE_DELAY=-1` |
| **User/pass** | Necesari | Goale (`""`) | `sa` / `""` |
| **AUTO_INCREMENT** | `BIGINT AUTO_INCREMENT PRIMARY KEY` | `INTEGER PRIMARY KEY AUTOINCREMENT` |  `BIGINT AUTO_INCREMENT PRIMARY KEY` |
| **FK activare** | Implicite (InnoDB) | `PRAGMA foreign_keys = ON` | Implicite |
| **Text blocks SQL** | Da (Java 15+) | Da | Da |
| **`getGeneratedKeys()`** | Da | Da | Da |
| **`LIMIT` în SQL** | Da | Da | Da |
| **Date/time nativ** | `DATE`, `DATETIME`, `TIMESTAMP` | Stocare ca `TEXT` (`YYYY-MM-DD`) sau `INTEGER` (epoch) | `DATE`, `TIMESTAMP` |
| **Ideal pentru** | Proiect final, producție | Dezvoltare locală fără server | Testare automată / CI |

---

## Diferențe de schema SQL

### AUTO_INCREMENT

```sql
-- MySQL
CREATE TABLE author (
    id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- SQLite
CREATE TABLE author (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(200) NOT NULL
);

-- H2 (sintaxa MySQL-compatibila — H2 accepta ambele)
CREATE TABLE author (
    id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL
);
```

### FOREIGN KEY

```sql
-- MySQL: FK definit inline sau la sfarsit, ambele se respecta automat cu InnoDB
-- SQLite: FK-urile exista in schema, dar sunt IGNORATE daca nu activezi pragma:
--   PRAGMA foreign_keys = ON;
-- H2: FK-urile se respecta automat ca in MySQL.
```

### Date / timp

```sql
-- MySQL: tip dedicat
loan_date  DATE NOT NULL,
return_date DATE,

-- SQLite: stocat ca TEXT (ISO format) — functii SQL ca DATE() functioneaza totusi
loan_date  TEXT NOT NULL,    -- "2026-05-18"
return_date TEXT,

-- H2: accepta DATE ca tip nativ
loan_date  DATE NOT NULL,
```

---

## Cum comuti între baze de date fără să schimbi codul Java

### Pasul 1 — Schimbă `db.properties`

```properties
# Pentru MySQL:
db.url=jdbc:mysql://localhost:3306/paoj_lab12?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
db.user=root
db.password=parola_ta

# Pentru SQLite (comenteaza MySQL, decomenta SQLite):
# db.url=jdbc:sqlite:./lab12.db
# db.user=
# db.password=

# Pentru H2 in-memory:
# db.url=jdbc:h2:mem:lab12;DB_CLOSE_DELAY=-1
# db.user=sa
# db.password=
```

### Pasul 2 — Rulează schema corespunzătoare

Sau folosește un `SchemaInitializer` care detectează dialectul:

```java
package com.pao.laboratory12.util;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.*;

/**
 * Ruleaza schema SQL la startup, util pentru H2 in-memory sau recreare SQLite.
 * Apeleaza din Main inainte de orice operatie pe BD.
 */
public class SchemaInitializer {

    /**
     * Detecteaza dialectul din URL si ruleaza schema corespunzatoare.
     * Fisierele de schema se afla in resources/.
     */
    public static void init(Connection conn) throws SQLException, IOException {
        String url = conn.getMetaData().getURL();
        String schemaFile;

        if (url.contains("mysql")) {
            schemaFile = "schema-mysql.sql";
        } else if (url.contains("sqlite")) {
            schemaFile = "schema-sqlite.sql";
        } else {
            schemaFile = "schema-mysql.sql";  // H2 e compatibil MySQL
        }

        // Citim fisierul din resources/ (classpath)
        try (InputStream is = SchemaInitializer.class
                .getClassLoader().getResourceAsStream(schemaFile)) {
            if (is == null) {
                throw new IOException("Schema file not found: " + schemaFile);
            }
            String sql = new String(is.readAllBytes());
            // Executam fiecare statement separat (split dupa ";")
            for (String stmt : sql.split(";")) {
                String trimmed = stmt.trim();
                if (!trimmed.isEmpty()) {
                    try (Statement s = conn.createStatement()) {
                        s.execute(trimmed);
                    }
                }
            }
        }
        System.out.println("[DB] Schema initializata din " + schemaFile);
    }
}
```

Utilizare în `Main`:

```java
Connection conn = DatabaseConnection.getInstance().getConnection();
SchemaInitializer.init(conn);  // ruleaza schema la startup (idempotent datorita DROP IF EXISTS)
```

---

# Parte 2 — Checklist complet Proiect Etapa II

Verifică fiecare rând **înainte de push** pe `proiect-etapa2`.

## Rând 1 — `schema.sql` + `db.properties` + `DatabaseConnection` (1p)

- [ ] Există `schema.sql` în rădăcina proiectului sau în `resources/`.
- [ ] `schema.sql` conține `DROP TABLE IF EXISTS` **în ordine inversă FK** (tabele dependente primele).
- [ ] `schema.sql` conține `CREATE TABLE` cu `PRIMARY KEY` pentru **fiecare** tabelă.
- [ ] `schema.sql` conține **≥2 FOREIGN KEY** explicite.
- [ ] Există `db.properties` în `resources/` cu `db.url`, `db.user`, `db.password`.
- [ ] **NICIO** clasă Java nu conține credențiale hardcodate (fără `"root"`, `"password"` direct în cod).
- [ ] `DatabaseConnection` are constructor `private`, metodă `static getInstance()`, expune `getConnection()`.
- [ ] `DatabaseConnection.getInstance()` citește din `db.properties` (nu din variabile hardcodate).

## Rând 2 — Interfață generică `Repository<T, ID>` (1p)

- [ ] Există interfața `Repository<T, ID>` cu exact aceste 5 metode:
  ```java
  void save(T entity);
  Optional<T> findById(ID id);
  List<T> findAll();
  void update(T entity);
  void delete(ID id);
  ```
- [ ] Interfața este în pachetul `repository/` (nu direct în root).

## Rând 3 — CRUD complet pentru ≥4 entități (4p, ~1p/entitate)

Pentru **fiecare** din cele ≥4 repository-uri:
- [ ] Implementează `Repository<EntitateX, Long>`.
- [ ] `save()` — INSERT + populează câmpul `id` din `getGeneratedKeys()`.
- [ ] `findById()` — SELECT WHERE id = ? → `Optional`.
- [ ] `findAll()` — SELECT toate, returnează `List`.
- [ ] `update()` — UPDATE cu toți câmpii tabelei.
- [ ] `delete()` — DELETE WHERE id = ?.

## Rând 4 — `PreparedStatement` + `try-with-resources` (2p)

- [ ] Zero apeluri de `createStatement()` — **toate** SQL-urile sunt `prepareStatement(sql)`.
- [ ] Zero SQL-uri cu concatenare de string: **niciun** `"SELECT ... WHERE id = " + id`.
- [ ] Fiecare `PreparedStatement` este declarat în `try (PreparedStatement ps = ...)`.
- [ ] Fiecare `ResultSet` este declarat în `try (ResultSet rs = ...)` sau `try` imbricat.

## Rând 5 — ≥1 tranzacție JDBC explicită (2p)

- [ ] Există cel puțin o metodă cu:
  ```java
  conn.setAutoCommit(false);
  try {
      // SQL 1 pe tabela A
      // SQL 2 pe tabela B
      conn.commit();
  } catch (SQLException e) {
      conn.rollback();
      throw e;
  } finally {
      conn.setAutoCommit(true);
  }
  ```
- [ ] Tranzacția afectează **≥2 tabele** (nu doar un singur INSERT).
- [ ] `rollback()` este în `catch`, nu în `finally`.
- [ ] `setAutoCommit(true)` este **în `finally`** (se execută indiferent de excepție).

## Rând 6 — ≥3 interogări SQL cu `JOIN` (2p)

- [ ] Există **≥3 metode** distincte cu SQL care conțin cuvântul `JOIN`.
- [ ] Cel puțin una folosește `JOIN` pe 3 tabele simultan.
- [ ] Cel puțin una folosește `LEFT JOIN` (sau `GROUP BY` cu agregare).
- [ ] Toate folosesc `PreparedStatement` (nu `Statement`).
- [ ] Metodele sunt expuse prin servicii sau repository-uri — **nu** direct în `Main`.

## Rând 7 — `AuditService` CSV thread-safe (1p)

- [ ] `AuditService` este Singleton.
- [ ] Fișierul `audit.csv` se deschide cu `new FileWriter(file, true)` (**append mode**).
- [ ] Metoda `log()` este protejată cu `synchronized` sau `ReentrantLock`.
- [ ] `unlock()` (dacă folosești `ReentrantLock`) este în `finally`.
- [ ] **Toate cele 10 acțiuni** din `Main` apelează `auditService.log(...)`.
- [ ] La a doua rulare a aplicației, `audit.csv` conține 20 de linii (nu 10 — nu se suprascrie).

## General — condiții de compilare și rulare

- [ ] Proiectul **compilează** fără erori (nu warnings, ci erori).
- [ ] `Main` rulează de la capăt la sfârșit fără `NullPointerException` sau `SQLException` negestionate.
- [ ] Pachetul este `com.pao.proiect.<tema_ta>` (nu `com.pao.laboratory12` — adaptează pentru proiect).
- [ ] Branch-ul `proiect-etapa2` este push-uit pe GitHub **înainte de 5 iunie 23:59**.

---

# Parte 3 — Sfaturi de adaptare la tema proprie

## Înlocuiește entitățile laboratorului cu cele din tema ta

Domeniu laborator → Tema ta (exemplu):

| Lab 12 | Tema "Cabinet medical" |
|--------|------------------------|
| `Author` | `Doctor` |
| `Book` | `Patient` |
| `Reader` | `Appointment` |
| `Loan` | `Consultation` |
| `borrowBook()` | `scheduleConsultation()` |

Structura repository, `DatabaseConnection`, `AuditService` — **identică**, schimbi doar:
- Numele claselor.
- Câmpurile din model.
- SQL-urile (tabele + coloane).
- Numele acțiunilor în `audit.log(...)`.

## Nu rescrie de la zero — extinde Etapa I

```
Etapa I (existent):                    Etapa II (adaugi):
com.pao.proiect.<tema>/                com.pao.proiect.<tema>/
├── model/         ✅ existent          ├── repository/     ← NOU
├── service/       ✅ extins            │   ├── Repository.java
├── exception/     ✅ existent          │   ├── ...Repository.java
└── Main.java      ✅ extins            ├── util/           ← NOU
                                        │   └── DatabaseConnection.java
                                        resources/          ← NOU
                                        ├── schema.sql
                                        └── db.properties
                                        audit.csv           ← generat la rulare
```

Serviciile din Etapa I (Singleton, operații în memorie) **rămân** — pe lângă ele adaugi repository-urile care persistă în BD. `Main` apelează ambele: demo-ul din Etapa I + operații JDBC din Etapa II.

## Recomandare finală

Cel mai simplu path pentru Etapa II:
1. Alege **SQLite** — fără instalare server, funcționează 100% cu codul din acest laborator.
2. Copiază `DatabaseConnection`, `AuditService`, interfața `Repository` 1:1 din lab12.
3. Scrie 4 repository-uri pe modelele tale.
4. Adaugă `borrowBook`-ul echivalent din tema ta (tranzacția).
5. Rulează, verifică `audit.csv`, push.

