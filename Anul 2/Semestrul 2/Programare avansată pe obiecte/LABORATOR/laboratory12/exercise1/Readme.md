# Exercise 1 — Schema, Conexiune și CRUD complet

> Pachet: `com.pao.laboratory12`
> Acoperă rândurile **1, 2, 3, 4** din baremul Etapa II (1p + 1p + 4p + 2p = **8p din 13p**).

---

## Structura recomandată

```
com/pao/laboratory12/
├── model/
│   ├── Author.java
│   ├── Book.java
│   ├── Reader.java
│   └── Loan.java
├── repository/
│   ├── Repository.java           ← interfața generică
│   ├── AuthorRepository.java
│   ├── BookRepository.java
│   ├── ReaderRepository.java
│   └── LoanRepository.java
└── util/
    └── DatabaseConnection.java
resources/
    ├── schema.sql                ← (copiezi din resources/ al laboratorului)
    └── db.properties             ← (copiezi template-ul și completezi)
```

---

# Part A — Schema, `db.properties` și `DatabaseConnection` (Rânduri barem 1 + 2)

## A1 — `schema.sql`

Cerințe **obligatorii** pentru barem:
- `DROP TABLE IF EXISTS` la **începutul** fișierului, în ordine inversă FK (întâi tabelele dependente).
- `PRIMARY KEY` pe **fiecare** tabelă.
- **≥2 FOREIGN KEY** între tabele.
- `CREATE TABLE` pentru fiecare entitate persistată.

### Template `schema.sql` (adaptează în proiect la tema ta)

```sql
-- Ordine DROP: întâi tabelele care au FK, apoi cele referite
DROP TABLE IF EXISTS loan;
DROP TABLE IF EXISTS book;
DROP TABLE IF EXISTS reader;
DROP TABLE IF EXISTS author;

CREATE TABLE author (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,   -- SQLite
    -- id   BIGINT AUTO_INCREMENT PRIMARY KEY,   -- MySQL: înlocuiește linia de deasupra
    name    VARCHAR(200) NOT NULL,
    country VARCHAR(100)
);

CREATE TABLE book (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    title     VARCHAR(300) NOT NULL,
    author_id INTEGER NOT NULL,
    available INTEGER NOT NULL DEFAULT 1,        -- 1 = disponibil, 0 = împrumutat
    FOREIGN KEY (author_id) REFERENCES author(id)  -- FK #1
);

CREATE TABLE reader (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    name  VARCHAR(200) NOT NULL,
    email VARCHAR(200)
);

CREATE TABLE loan (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id     INTEGER NOT NULL,
    reader_id   INTEGER NOT NULL,
    loan_date   VARCHAR(20) NOT NULL,             -- ISO format: YYYY-MM-DD
    return_date VARCHAR(20),                      -- NULL = împrumut activ
    FOREIGN KEY (book_id)   REFERENCES book(id),  -- FK #2
    FOREIGN KEY (reader_id) REFERENCES reader(id) -- FK #3 (bonus față de minim)
);
```

> **Pentru MySQL**: înlocuiește `INTEGER PRIMARY KEY AUTOINCREMENT` cu `BIGINT AUTO_INCREMENT PRIMARY KEY`
> și adaugă `ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;` la sfârșitul fiecărui `CREATE TABLE`.
> Fișierele separate `schema-mysql.sql` și `schema-sqlite.sql` din `resources/` sunt gata de folosit.

---

## A2 — `db.properties`

Plasează fișierul în `resources/db.properties`. **Nu îl adăuga în `.gitignore`** dacă nu conține parole reale — sau adaugă un `db.properties.example` în repo fără parolă.

```properties
# Alege una din variantele de mai jos si sterge celelalte

# --- MySQL ---
db.url=jdbc:mysql://localhost:3306/paoj_lab12?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
db.user=root
db.password=parola_ta

# --- SQLite ---
# db.url=jdbc:sqlite:./lab12.db
# db.user=
# db.password=
```

---

## A3 — `DatabaseConnection` Singleton (Rând barem 1)

Singleton = o singură instanță pentru toată durata aplicației. Nu crea conexiuni la fiecare operație CRUD.

```java
package com.pao.laboratory12.util;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public final class DatabaseConnection {

    private static DatabaseConnection instance;
    private Connection connection;

    // Constructor privat — nimeni din afară nu poate face "new DatabaseConnection()"
    private DatabaseConnection() throws IOException, SQLException {
        Properties props = new Properties();
        // Citim db.properties din classpath (resources/)
        try (InputStream is = getClass().getClassLoader()
                .getResourceAsStream("db.properties")) {
            if (is == null) {
                throw new IOException("Nu gasesc db.properties in resources/");
            }
            props.load(is);
        }
        String url  = props.getProperty("db.url");
        String user = props.getProperty("db.user");
        String pass = props.getProperty("db.password");

        // Pentru SQLite: user si pass pot fi goale — DriverManager accepta null
        this.connection = DriverManager.getConnection(url, user, pass);

        // SQLite: activam foreign key constraints (ignorat de MySQL)
        try (var stmt = connection.createStatement()) {
            stmt.execute("PRAGMA foreign_keys = ON");
        } catch (SQLException ignored) {
            // Pe MySQL, PRAGMA nu exista — ignoram silentios
        }
    }

    /**
     * Returneaza unica instanta DatabaseConnection.
     * Thread-safe cu synchronized (suficient pentru proiect single-threaded).
     */
    public static synchronized DatabaseConnection getInstance()
            throws IOException, SQLException {
        if (instance == null || instance.connection.isClosed()) {
            instance = new DatabaseConnection();
        }
        return instance;
    }

    /** Expune conexiunea pentru repository-uri. */
    public Connection getConnection() {
        return connection;
    }

    /** Inchide conexiunea la finalul aplicatiei. */
    public void close() throws SQLException {
        if (connection != null && !connection.isClosed()) {
            connection.close();
        }
    }
}
```

### De ce Singleton?

- O singură conexiune la DB este suficientă pentru o aplicație consolă single-threaded.
- Evitați să pasați `Connection` ca parametru în fiecare metodă — folosiți `DatabaseConnection.getInstance().getConnection()` direct în repository.
- Într-o aplicație reală multi-threaded se folosește un **connection pool** (ex: HikariCP), dar pentru proiect Singleton este acceptat și este ceea ce se cere explicit în barem.

---

## A4 — Interfața generică `Repository<T, ID>` (Rând barem 2)

```java
package com.pao.laboratory12.repository;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

/**
 * Interfata generica de repository CRUD.
 * T  = tipul entitatii  (ex: Author, Book)
 * ID = tipul cheii primare (ex: Long, Integer)
 */
public interface Repository<T, ID> {
    void save(T entity)               throws SQLException;
    Optional<T> findById(ID id)       throws SQLException;
    List<T> findAll()                 throws SQLException;
    void update(T entity)             throws SQLException;
    void delete(ID id)                throws SQLException;
}
```

> Interfața este identică cu cea din cerința proiectului — copiaz-o 1:1 în tema ta.

---

## A5 — Modelele (POJO-uri simple)

```java
// Author.java
package com.pao.laboratory12.model;

public class Author {
    private long id;
    private String name;
    private String country;

    public Author() {}
    public Author(String name, String country) {
        this.name = name; this.country = country;
    }
    // getteri / setteri / toString
    public long getId()          { return id; }
    public void setId(long id)   { this.id = id; }
    public String getName()      { return name; }
    public void setName(String n){ this.name = n; }
    public String getCountry()   { return country; }
    public void setCountry(String c) { this.country = c; }
    @Override public String toString() {
        return "Author{id=" + id + ", name='" + name + "', country='" + country + "'}";
    }
}
```

```java
// Book.java
package com.pao.laboratory12.model;

public class Book {
    private long id;
    private String title;
    private long authorId;
    private boolean available;

    public Book() {}
    public Book(String title, long authorId) {
        this.title = title; this.authorId = authorId; this.available = true;
    }
    // getteri / setteri / toString — similar cu Author
    public long getId()              { return id; }
    public void setId(long id)       { this.id = id; }
    public String getTitle()         { return title; }
    public void setTitle(String t)   { this.title = t; }
    public long getAuthorId()        { return authorId; }
    public void setAuthorId(long a)  { this.authorId = a; }
    public boolean isAvailable()     { return available; }
    public void setAvailable(boolean v) { this.available = v; }
    @Override public String toString() {
        return "Book{id=" + id + ", title='" + title + "', authorId=" + authorId
               + ", available=" + available + "}";
    }
}
```

```java
// Reader.java
package com.pao.laboratory12.model;

public class Reader {
    private long id;
    private String name;
    private String email;

    public Reader() {}
    public Reader(String name, String email) { this.name = name; this.email = email; }
    public long getId()            { return id; }
    public void setId(long id)     { this.id = id; }
    public String getName()        { return name; }
    public void setName(String n)  { this.name = n; }
    public String getEmail()       { return email; }
    public void setEmail(String e) { this.email = e; }
    @Override public String toString() {
        return "Reader{id=" + id + ", name='" + name + "', email='" + email + "'}";
    }
}
```

```java
// Loan.java
package com.pao.laboratory12.model;

public class Loan {
    private long id;
    private long bookId;
    private long readerId;
    private String loanDate;    // "YYYY-MM-DD"
    private String returnDate;  // null = activ

    public Loan() {}
    public Loan(long bookId, long readerId, String loanDate) {
        this.bookId = bookId; this.readerId = readerId; this.loanDate = loanDate;
    }
    public long getId()                   { return id; }
    public void setId(long id)            { this.id = id; }
    public long getBookId()               { return bookId; }
    public void setBookId(long b)         { this.bookId = b; }
    public long getReaderId()             { return readerId; }
    public void setReaderId(long r)       { this.readerId = r; }
    public String getLoanDate()           { return loanDate; }
    public void setLoanDate(String d)     { this.loanDate = d; }
    public String getReturnDate()         { return returnDate; }
    public void setReturnDate(String d)   { this.returnDate = d; }
    @Override public String toString() {
        return "Loan{id=" + id + ", bookId=" + bookId + ", readerId=" + readerId
               + ", loanDate='" + loanDate + "', returnDate='" + returnDate + "'}";
    }
}
```

---

# Part B — CRUD complet pentru 4 entități (Rânduri barem 3 + 4)

## Reguli stricte (barem)

1. **Toate** SQL-urile folosesc `PreparedStatement` — **niciodată** `Statement` cu concatenare de șiruri.
2. **Toate** resursele sunt închise cu `try-with-resources`: `Connection`, `PreparedStatement`, `ResultSet`.
3. Fiecare repository implementează toate **5 metode**: `save`, `findById`, `findAll`, `update`, `delete`.

### De ce `PreparedStatement` și nu `Statement`?

```java
// ❌ GRESIT — vulnerabil la SQL Injection
String sql = "SELECT * FROM author WHERE name = '" + userInput + "'";
Statement stmt = con.createStatement();
ResultSet rs = stmt.executeQuery(sql);
// Daca userInput = "'; DROP TABLE author; --" => dezastru

// ✅ CORECT — parametru separat, escapat automat
String sql = "SELECT * FROM author WHERE name = ?";
PreparedStatement ps = con.prepareStatement(sql);
ps.setString(1, userInput);  // "?" este inlocuit sigur
ResultSet rs = ps.executeQuery();
```

### De ce `try-with-resources`?

```java
// ❌ GRESIT — daca apare exceptie, rs si ps nu se inchid niciodata => memory leak
PreparedStatement ps = con.prepareStatement(sql);
ResultSet rs = ps.executeQuery();
// ...cod care arunca exceptie...
rs.close();   // nu se ajunge niciodata aici
ps.close();

// ✅ CORECT — se inchid automat chiar si la exceptie
try (PreparedStatement ps = con.prepareStatement(sql);
     ResultSet rs = ps.executeQuery()) {
    // ...
}  // ps.close() si rs.close() apelate automat
```

---

## B1 — `AuthorRepository`

```java
package com.pao.laboratory12.repository;

import com.pao.laboratory12.model.Author;
import com.pao.laboratory12.util.DatabaseConnection;

import java.io.IOException;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class AuthorRepository implements Repository<Author, Long> {

    private Connection getConn() throws SQLException, IOException {
        return DatabaseConnection.getInstance().getConnection();
    }

    /** Mapeaza un rand din ResultSet intr-un obiect Author. */
    private Author mapRow(ResultSet rs) throws SQLException {
        Author a = new Author();
        a.setId(rs.getLong("id"));
        a.setName(rs.getString("name"));
        a.setCountry(rs.getString("country"));
        return a;
    }

    @Override
    public void save(Author author) throws SQLException {
        String sql = "INSERT INTO author (name, country) VALUES (?, ?)";
        try (PreparedStatement ps = getConn().prepareStatement(sql,
                Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, author.getName());
            ps.setString(2, author.getCountry());
            ps.executeUpdate();
            // Preluam ID-ul generat automat de baza de date
            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (keys.next()) {
                    author.setId(keys.getLong(1));
                }
            }
        } catch (IOException e) {
            throw new SQLException("Eroare la obtinerea conexiunii: " + e.getMessage(), e);
        }
    }

    @Override
    public Optional<Author> findById(Long id) throws SQLException {
        String sql = "SELECT id, name, country FROM author WHERE id = ?";
        try (PreparedStatement ps = getConn().prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return Optional.of(mapRow(rs));
                return Optional.empty();
            }
        } catch (IOException e) {
            throw new SQLException(e);
        }
    }

    @Override
    public List<Author> findAll() throws SQLException {
        String sql = "SELECT id, name, country FROM author ORDER BY id";
        List<Author> list = new ArrayList<>();
        try (PreparedStatement ps = getConn().prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) list.add(mapRow(rs));
        } catch (IOException e) {
            throw new SQLException(e);
        }
        return list;
    }

    @Override
    public void update(Author author) throws SQLException {
        String sql = "UPDATE author SET name = ?, country = ? WHERE id = ?";
        try (PreparedStatement ps = getConn().prepareStatement(sql)) {
            ps.setString(1, author.getName());
            ps.setString(2, author.getCountry());
            ps.setLong(3, author.getId());
            ps.executeUpdate();
        } catch (IOException e) {
            throw new SQLException(e);
        }
    }

    @Override
    public void delete(Long id) throws SQLException {
        String sql = "DELETE FROM author WHERE id = ?";
        try (PreparedStatement ps = getConn().prepareStatement(sql)) {
            ps.setLong(1, id);
            ps.executeUpdate();
        } catch (IOException e) {
            throw new SQLException(e);
        }
    }
}
```

---

## B2 — `BookRepository`

```java
package com.pao.laboratory12.repository;

import com.pao.laboratory12.model.Book;
import com.pao.laboratory12.util.DatabaseConnection;

import java.io.IOException;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class BookRepository implements Repository<Book, Long> {

    private Connection getConn() throws SQLException, IOException {
        return DatabaseConnection.getInstance().getConnection();
    }

    private Book mapRow(ResultSet rs) throws SQLException {
        Book b = new Book();
        b.setId(rs.getLong("id"));
        b.setTitle(rs.getString("title"));
        b.setAuthorId(rs.getLong("author_id"));
        b.setAvailable(rs.getInt("available") == 1);
        return b;
    }

    @Override
    public void save(Book book) throws SQLException {
        String sql = "INSERT INTO book (title, author_id, available) VALUES (?, ?, ?)";
        try (PreparedStatement ps = getConn().prepareStatement(sql,
                Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, book.getTitle());
            ps.setLong(2, book.getAuthorId());
            ps.setInt(3, book.isAvailable() ? 1 : 0);
            ps.executeUpdate();
            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (keys.next()) book.setId(keys.getLong(1));
            }
        } catch (IOException e) {
            throw new SQLException(e);
        }
    }

    @Override
    public Optional<Book> findById(Long id) throws SQLException {
        String sql = "SELECT id, title, author_id, available FROM book WHERE id = ?";
        try (PreparedStatement ps = getConn().prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return Optional.of(mapRow(rs));
                return Optional.empty();
            }
        } catch (IOException e) {
            throw new SQLException(e);
        }
    }

    @Override
    public List<Book> findAll() throws SQLException {
        String sql = "SELECT id, title, author_id, available FROM book ORDER BY id";
        List<Book> list = new ArrayList<>();
        try (PreparedStatement ps = getConn().prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) list.add(mapRow(rs));
        } catch (IOException e) {
            throw new SQLException(e);
        }
        return list;
    }

    @Override
    public void update(Book book) throws SQLException {
        String sql = "UPDATE book SET title = ?, author_id = ?, available = ? WHERE id = ?";
        try (PreparedStatement ps = getConn().prepareStatement(sql)) {
            ps.setString(1, book.getTitle());
            ps.setLong(2, book.getAuthorId());
            ps.setInt(3, book.isAvailable() ? 1 : 0);
            ps.setLong(4, book.getId());
            ps.executeUpdate();
        } catch (IOException e) {
            throw new SQLException(e);
        }
    }

    @Override
    public void delete(Long id) throws SQLException {
        String sql = "DELETE FROM book WHERE id = ?";
        try (PreparedStatement ps = getConn().prepareStatement(sql)) {
            ps.setLong(1, id);
            ps.executeUpdate();
        } catch (IOException e) {
            throw new SQLException(e);
        }
    }
}
```

---

## B3 — `ReaderRepository`

```java
package com.pao.laboratory12.repository;

import com.pao.laboratory12.model.Reader;
import com.pao.laboratory12.util.DatabaseConnection;

import java.io.IOException;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class ReaderRepository implements Repository<Reader, Long> {

    private Connection getConn() throws SQLException, IOException {
        return DatabaseConnection.getInstance().getConnection();
    }

    private Reader mapRow(ResultSet rs) throws SQLException {
        Reader r = new Reader();
        r.setId(rs.getLong("id"));
        r.setName(rs.getString("name"));
        r.setEmail(rs.getString("email"));
        return r;
    }

    @Override
    public void save(Reader reader) throws SQLException {
        String sql = "INSERT INTO reader (name, email) VALUES (?, ?)";
        try (PreparedStatement ps = getConn().prepareStatement(sql,
                Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, reader.getName());
            ps.setString(2, reader.getEmail());
            ps.executeUpdate();
            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (keys.next()) reader.setId(keys.getLong(1));
            }
        } catch (IOException e) {
            throw new SQLException(e);
        }
    }

    @Override
    public Optional<Reader> findById(Long id) throws SQLException {
        String sql = "SELECT id, name, email FROM reader WHERE id = ?";
        try (PreparedStatement ps = getConn().prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return Optional.of(mapRow(rs));
                return Optional.empty();
            }
        } catch (IOException e) {
            throw new SQLException(e);
        }
    }

    @Override
    public List<Reader> findAll() throws SQLException {
        String sql = "SELECT id, name, email FROM reader ORDER BY id";
        List<Reader> list = new ArrayList<>();
        try (PreparedStatement ps = getConn().prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) list.add(mapRow(rs));
        } catch (IOException e) {
            throw new SQLException(e);
        }
        return list;
    }

    @Override
    public void update(Reader reader) throws SQLException {
        String sql = "UPDATE reader SET name = ?, email = ? WHERE id = ?";
        try (PreparedStatement ps = getConn().prepareStatement(sql)) {
            ps.setString(1, reader.getName());
            ps.setString(2, reader.getEmail());
            ps.setLong(3, reader.getId());
            ps.executeUpdate();
        } catch (IOException e) {
            throw new SQLException(e);
        }
    }

    @Override
    public void delete(Long id) throws SQLException {
        String sql = "DELETE FROM reader WHERE id = ?";
        try (PreparedStatement ps = getConn().prepareStatement(sql)) {
            ps.setLong(1, id);
            ps.executeUpdate();
        } catch (IOException e) {
            throw new SQLException(e);
        }
    }
}
```

---

## B4 — `LoanRepository`

```java
package com.pao.laboratory12.repository;

import com.pao.laboratory12.model.Loan;
import com.pao.laboratory12.util.DatabaseConnection;

import java.io.IOException;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class LoanRepository implements Repository<Loan, Long> {

    private Connection getConn() throws SQLException, IOException {
        return DatabaseConnection.getInstance().getConnection();
    }

    private Loan mapRow(ResultSet rs) throws SQLException {
        Loan l = new Loan();
        l.setId(rs.getLong("id"));
        l.setBookId(rs.getLong("book_id"));
        l.setReaderId(rs.getLong("reader_id"));
        l.setLoanDate(rs.getString("loan_date"));
        l.setReturnDate(rs.getString("return_date"));  // poate fi NULL
        return l;
    }

    @Override
    public void save(Loan loan) throws SQLException {
        String sql = "INSERT INTO loan (book_id, reader_id, loan_date, return_date) VALUES (?, ?, ?, ?)";
        try (PreparedStatement ps = getConn().prepareStatement(sql,
                Statement.RETURN_GENERATED_KEYS)) {
            ps.setLong(1, loan.getBookId());
            ps.setLong(2, loan.getReaderId());
            ps.setString(3, loan.getLoanDate());
            ps.setString(4, loan.getReturnDate());   // null este trimis corect
            ps.executeUpdate();
            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (keys.next()) loan.setId(keys.getLong(1));
            }
        } catch (IOException e) {
            throw new SQLException(e);
        }
    }

    @Override
    public Optional<Loan> findById(Long id) throws SQLException {
        String sql = "SELECT id, book_id, reader_id, loan_date, return_date FROM loan WHERE id = ?";
        try (PreparedStatement ps = getConn().prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return Optional.of(mapRow(rs));
                return Optional.empty();
            }
        } catch (IOException e) {
            throw new SQLException(e);
        }
    }

    @Override
    public List<Loan> findAll() throws SQLException {
        String sql = "SELECT id, book_id, reader_id, loan_date, return_date FROM loan ORDER BY id";
        List<Loan> list = new ArrayList<>();
        try (PreparedStatement ps = getConn().prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) list.add(mapRow(rs));
        } catch (IOException e) {
            throw new SQLException(e);
        }
        return list;
    }

    @Override
    public void update(Loan loan) throws SQLException {
        String sql = "UPDATE loan SET book_id = ?, reader_id = ?, loan_date = ?, return_date = ? WHERE id = ?";
        try (PreparedStatement ps = getConn().prepareStatement(sql)) {
            ps.setLong(1, loan.getBookId());
            ps.setLong(2, loan.getReaderId());
            ps.setString(3, loan.getLoanDate());
            ps.setString(4, loan.getReturnDate());
            ps.setLong(5, loan.getId());
            ps.executeUpdate();
        } catch (IOException e) {
            throw new SQLException(e);
        }
    }

    @Override
    public void delete(Long id) throws SQLException {
        String sql = "DELETE FROM loan WHERE id = ?";
        try (PreparedStatement ps = getConn().prepareStatement(sql)) {
            ps.setLong(1, id);
            ps.executeUpdate();
        } catch (IOException e) {
            throw new SQLException(e);
        }
    }
}
```

---

## Acceptance Checklist — Part A

- [ ] Fișierul `schema.sql` există și conține `DROP TABLE IF EXISTS` + `CREATE TABLE` pentru 4 tabele.
- [ ] Schema are PK pe **toate** 4 tabelele.
- [ ] Schema are **≥2 FOREIGN KEY** (book→author, loan→book).
- [ ] `db.properties` există în `resources/` și NU conține credențiale hardcodate în clasele Java.
- [ ] `DatabaseConnection` este Singleton (constructor privat + `getInstance()` static).
- [ ] `DatabaseConnection.getInstance().getConnection()` returnează o conexiune deschisă (fără excepție).
- [ ] Interfața `Repository<T, ID>` există cu toate 5 metode semnate.

## Acceptance Checklist — Part B

- [ ] `AuthorRepository` — toate 5 metode implementate, compilează, rulează fără excepție.
- [ ] `BookRepository`  — toate 5 metode implementate, compilează, rulează fără excepție.
- [ ] `ReaderRepository`— toate 5 metode implementate, compilează, rulează fără excepție.
- [ ] `LoanRepository`  — toate 5 metode implementate, compilează, rulează fără excepție.
- [ ] **Zero** apeluri de `Statement` cu concatenare de șiruri — toate SQL-urile folosesc `?` cu `PreparedStatement`.
- [ ] **Zero** resurse neclosed — toate `PreparedStatement` și `ResultSet` sunt în `try-with-resources`.
- [ ] `save()` populează câmpul `id` pe entitate din cheia generată de BD (`RETURN_GENERATED_KEYS`).
- [ ] `findById()` returnează `Optional.empty()` dacă înregistrarea nu există (nu aruncă excepție).

---

## Greșeli frecvente

| Greșeală | Consecință | Fix |
|----------|------------|-----|
| `Statement` cu concatenare | SQL Injection + 0 puncte la criteriul 4 | Folosește `PreparedStatement` + `?` |
| `ResultSet` neclosed | Memory leak, erori la rulare îndelungată | Pune `ResultSet` în `try-with-resources` |
| `new DatabaseConnection()` la fiecare operație | O conexiune nouă la DB per apel = lent | Folosește `getInstance().getConnection()` |
| `id` setat manual înainte de `save` | ID poate colida cu cel din BD | Lasă BD să genereze ID-ul, citește-l din `getGeneratedKeys()` |
| FK-uri în ordine greșită la DROP | `DROP TABLE author` înainte de `DROP TABLE book` → eroare FK | Ordinea DROP: book/loan înainte de author/reader |

