# Exercise 2 — Tranzacții JDBC, JOIN-uri și AuditService

> Pachet: `com.pao.laboratory12`
> Acoperă rândurile **5, 6, 7** din baremul Etapa II (2p + 2p + 1p = **5p din 13p**).

---

## Structura adăugată față de Exercise 1

```
com/pao/laboratory12/
├── service/
│   ├── LibraryService.java      ← tranzacții + JOIN queries (rând 5 + 6)
│   └── AuditService.java        ← CSV thread-safe (rând 7)
└── Main.java                    ← demonstrează toate 10 acțiuni, fiecare cu audit
```

---

# Rând 5 — Tranzacție JDBC explicită cu `commit` / `rollback`

## Conceptul de tranzacție

O **tranzacție** grupează mai multe operații SQL astfel încât:
- dacă **toate reușesc** → se execută `commit()` și modificările devin permanente în BD.
- dacă **oricare eșuează** → se execută `rollback()` și BD revine la starea anterioară.

Implicit, JDBC are `autoCommit = true`: fiecare instrucțiune SQL e un commit automat.  
Pentru tranzacție explicită, dezactivezi autoCommit:

```
autoCommit = false  →  [SQL 1]  [SQL 2]  →  commit()   ✅ ambele salvate
                   →  [SQL 1]  [SQL 2 eșuează] →  rollback()  ↩ niciuna salvată
```

## Exemplu concret: `borrowBook(readerId, bookId)`

Operația de împrumut afectează **două tabele**:
1. Inserează un rând nou în `loan`.
2. Actualizează `book.available = 0` (cartea nu mai e disponibilă).

Dacă pasul 2 eșuează (ex: cartea nu există), pasul 1 trebuie anulat — altfel avem un împrumut fără carte indisponibilă (inconsistență).

```java
package com.pao.laboratory12.service;

import com.pao.laboratory12.model.Loan;
import com.pao.laboratory12.util.DatabaseConnection;

import java.io.IOException;
import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class LibraryService {

    private static LibraryService instance;

    private LibraryService() {}

    public static LibraryService getInstance() {
        if (instance == null) instance = new LibraryService();
        return instance;
    }

    private Connection getConn() throws SQLException, IOException {
        return DatabaseConnection.getInstance().getConnection();
    }

    // =========================================================
    // RAND BAREM 5 — Tranzactie explicita
    // =========================================================

    /**
     * Imprumuta o carte unui cititor.
     * Operatia e atomica: fie ambele SQL-uri reusesc, fie niciunul.
     *
     * @param readerId ID-ul cititorului
     * @param bookId   ID-ul cartii (trebuie sa fie disponibila)
     * @return ID-ul imprumutului creat
     * @throws SQLException daca cartea nu este disponibila sau apare o eroare de BD
     */
    public long borrowBook(long readerId, long bookId) throws SQLException, IOException {
        Connection conn = getConn();
        conn.setAutoCommit(false);    // dezactivam commit automat
        try {
            // --- SQL 1: verifica disponibilitatea cartii ---
            String checkSql = "SELECT available FROM book WHERE id = ?";
            try (PreparedStatement checkPs = conn.prepareStatement(checkSql)) {
                checkPs.setLong(1, bookId);
                try (ResultSet rs = checkPs.executeQuery()) {
                    if (!rs.next()) {
                        throw new SQLException("Carte cu id=" + bookId + " nu exista.");
                    }
                    if (rs.getInt("available") == 0) {
                        throw new SQLException("Cartea cu id=" + bookId + " nu este disponibila.");
                    }
                }
            }

            // --- SQL 2: insereaza imprumutul ---
            String insertSql = "INSERT INTO loan (book_id, reader_id, loan_date) VALUES (?, ?, ?)";
            long loanId;
            try (PreparedStatement insertPs = conn.prepareStatement(insertSql,
                    Statement.RETURN_GENERATED_KEYS)) {
                insertPs.setLong(1, bookId);
                insertPs.setLong(2, readerId);
                insertPs.setString(3, LocalDate.now().toString());
                insertPs.executeUpdate();
                try (ResultSet keys = insertPs.getGeneratedKeys()) {
                    keys.next();
                    loanId = keys.getLong(1);
                }
            }

            // --- SQL 3: marcheaza cartea ca indisponibila ---
            String updateSql = "UPDATE book SET available = 0 WHERE id = ?";
            try (PreparedStatement updatePs = conn.prepareStatement(updateSql)) {
                updatePs.setLong(1, bookId);
                updatePs.executeUpdate();
            }

            conn.commit();    // toate 3 SQL-uri au reusit → salvam definitiv
            System.out.println("[TX] borrowBook comis cu succes. Loan ID=" + loanId);
            return loanId;

        } catch (SQLException e) {
            conn.rollback();  // ceva a esuat → anulam tot
            System.out.println("[TX] borrowBook — rollback datorita: " + e.getMessage());
            throw e;          // re-aruncam pentru a anunta apelantul
        } finally {
            conn.setAutoCommit(true);  // restauram comportamentul implicit
        }
    }

    /**
     * Returneaza o carte (inchide imprumutul activ).
     * Alta tranzactie: actualizeaza loan.return_date + book.available = 1.
     */
    public void returnBook(long loanId) throws SQLException, IOException {
        Connection conn = getConn();
        conn.setAutoCommit(false);
        try {
            // Gasim book_id din imprumut
            long bookId;
            String findSql = "SELECT book_id FROM loan WHERE id = ?";
            try (PreparedStatement ps = conn.prepareStatement(findSql)) {
                ps.setLong(1, loanId);
                try (ResultSet rs = ps.executeQuery()) {
                    if (!rs.next()) throw new SQLException("Imprumut cu id=" + loanId + " nu exista.");
                    bookId = rs.getLong("book_id");
                }
            }

            // Actualizam data returnarii
            String updateLoan = "UPDATE loan SET return_date = ? WHERE id = ?";
            try (PreparedStatement ps = conn.prepareStatement(updateLoan)) {
                ps.setString(1, LocalDate.now().toString());
                ps.setLong(2, loanId);
                ps.executeUpdate();
            }

            // Marcam cartea ca disponibila
            String updateBook = "UPDATE book SET available = 1 WHERE id = ?";
            try (PreparedStatement ps = conn.prepareStatement(updateBook)) {
                ps.setLong(1, bookId);
                ps.executeUpdate();
            }

            conn.commit();
            System.out.println("[TX] returnBook comis. Book ID=" + bookId + " disponibila din nou.");
        } catch (SQLException e) {
            conn.rollback();
            throw e;
        } finally {
            conn.setAutoCommit(true);
        }
    }

    // =========================================================
    // RAND BAREM 6 — Cel putin 3 interogari SQL cu JOIN
    // =========================================================

    /**
     * JOIN #1: Toate imprumuturile active (nereturnate),
     * cu detaliile cartii si ale cititorului.
     * Returneaza o lista de siruri formatate pentru afisare.
     */
    public List<String> getActiveLoansWithDetails() throws SQLException, IOException {
        String sql = """
                SELECT l.id        AS loan_id,
                       b.title     AS book_title,
                       r.name      AS reader_name,
                       l.loan_date
                FROM loan l
                JOIN book   b ON l.book_id   = b.id
                JOIN reader r ON l.reader_id  = r.id
                WHERE l.return_date IS NULL
                ORDER BY l.loan_date DESC
                """;
        List<String> results = new ArrayList<>();
        try (PreparedStatement ps = getConn().prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                results.add(String.format("Loan#%d | '%s' -> %s | din %s",
                        rs.getLong("loan_id"),
                        rs.getString("book_title"),
                        rs.getString("reader_name"),
                        rs.getString("loan_date")));
            }
        }
        return results;
    }

    /**
     * JOIN #2: Top carti imprumutate, cu numele autorului.
     * Grupeaza dupa carte si numara imprumuturile.
     */
    public List<String> getTopBorrowedBooksWithAuthor() throws SQLException, IOException {
        String sql = """
                SELECT b.title      AS book_title,
                       a.name       AS author_name,
                       COUNT(l.id)  AS borrow_count
                FROM book b
                JOIN author a ON b.author_id = a.id
                LEFT JOIN loan l ON l.book_id = b.id
                GROUP BY b.id, b.title, a.name
                ORDER BY borrow_count DESC
                LIMIT 10
                """;
        List<String> results = new ArrayList<>();
        try (PreparedStatement ps = getConn().prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                results.add(String.format("'%s' de %s — %d imprumuturi",
                        rs.getString("book_title"),
                        rs.getString("author_name"),
                        rs.getLong("borrow_count")));
            }
        }
        return results;
    }

    /**
     * JOIN #3: Numar de imprumuturi per cititor (inclusiv cei cu 0).
     */
    public List<String> getLoansCountPerReader() throws SQLException, IOException {
        String sql = """
                SELECT r.name       AS reader_name,
                       COUNT(l.id)  AS total_loans
                FROM reader r
                LEFT JOIN loan l ON l.reader_id = r.id
                GROUP BY r.id, r.name
                ORDER BY total_loans DESC
                """;
        List<String> results = new ArrayList<>();
        try (PreparedStatement ps = getConn().prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                results.add(String.format("%s: %d imprumuturi",
                        rs.getString("reader_name"),
                        rs.getLong("total_loans")));
            }
        }
        return results;
    }
}
```

### Notă despre `LEFT JOIN` vs `JOIN`

| Tip JOIN | Comportament |
|----------|-------------|
| `JOIN` (INNER JOIN) | Afișează **doar** rândurile cu potrivire în ambele tabele |
| `LEFT JOIN` | Afișează **toate** rândurile din tabela stângă, chiar fără potrivire (valori NULL pe dreapta) |

La `getTopBorrowedBooksWithAuthor`: folosim `LEFT JOIN loan` ca să apară și cărțile care nu au niciun împrumut (cu `borrow_count = 0`).

---

# Rând 7 — `AuditService` CSV thread-safe

## Cerințe barem

- Singleton.
- Scrie în fișier `audit.csv` în modul **append** (nu suprascrie la fiecare rulare).
- **Thread-safe**: metoda de scriere protejată cu `synchronized` sau `ReentrantLock`.
- **Toate cele 10 acțiuni** din `Main` apelează `auditService.log(...)`.

## Format `audit.csv`

```
action_name,timestamp
add_author,2026-05-18T10:30:01
add_book,2026-05-18T10:30:01
add_reader,2026-05-18T10:30:02
borrow_book,2026-05-18T10:30:02
...
```

## Implementare

```java
package com.pao.laboratory12.service;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.locks.ReentrantLock;

public final class AuditService {

    private static AuditService instance;

    // Fisierul de audit (relativ la working directory = radacina proiectului)
    private static final String AUDIT_FILE = "audit.csv";

    // ReentrantLock protejeaza scrierea in fisier daca mai multe thread-uri
    // apeleaza log() simultan (ex: intr-o aplicatie web sau multi-threaded)
    private final ReentrantLock lock = new ReentrantLock();

    private final DateTimeFormatter formatter =
            DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    private AuditService() {
        // La prima creare, scriem header-ul daca fisierul e gol / nou
        // Folosim append=true ca sa nu stergem loguri existente din rulari precedente
    }

    public static AuditService getInstance() {
        if (instance == null) {
            instance = new AuditService();
        }
        return instance;
    }

    /**
     * Logheaza o actiune in audit.csv.
     * Metoda este thread-safe prin ReentrantLock.
     *
     * @param actionName Numele actiunii (ex: "add_book", "borrow_book")
     */
    public void log(String actionName) {
        lock.lock();                              // blocare exclusiva
        try (PrintWriter pw = new PrintWriter(
                new FileWriter(AUDIT_FILE, true))) { // true = append mode
            String timestamp = LocalDateTime.now().format(formatter);
            pw.println(actionName + "," + timestamp);
        } catch (IOException e) {
            System.err.println("[AUDIT] Eroare la scriere: " + e.getMessage());
        } finally {
            lock.unlock();                        // eliberare garantata
        }
    }
}
```

### De ce `ReentrantLock` și nu `synchronized`?

Ambele sunt corecte pentru proiect. Diferența:

| | `synchronized` | `ReentrantLock` |
|---|---|---|
| Sintaxă | `synchronized(this) { ... }` | `lock.lock()` + `lock.unlock()` |
| Try-finally | Nu neapărat | **Obligatoriu** pentru `unlock()` |
| Flexibilitate | Simplă | Mai mult control (tryLock, timeout) |
| Barem | Acceptat | Acceptat |

---

# `Main.java` — Demonstrarea celor 10 acțiuni + audit

```java
package com.pao.laboratory12;

import com.pao.laboratory12.model.*;
import com.pao.laboratory12.repository.*;
import com.pao.laboratory12.service.AuditService;
import com.pao.laboratory12.service.LibraryService;

import java.util.List;

public class Main {
    public static void main(String[] args) throws Exception {
        AuditService audit = AuditService.getInstance();
        AuthorRepository authorRepo = new AuthorRepository();
        BookRepository bookRepo     = new BookRepository();
        ReaderRepository readerRepo = new ReaderRepository();
        LoanRepository loanRepo     = new LoanRepository();
        LibraryService libraryService = LibraryService.getInstance();

        System.out.println("=== BIBLIOTECA JDBC — Demo Lab12 ===\n");

        // ---- Actiunea 1: Adauga autor ----
        Author author = new Author("Gabriel Garcia Marquez", "CO");
        authorRepo.save(author);
        audit.log("add_author");
        System.out.println("1. Autor adaugat: " + author);

        // ---- Actiunea 2: Adauga carte ----
        Book book1 = new Book("100 de ani de singuratate", author.getId());
        Book book2 = new Book("Dragostea in vremea holerei", author.getId());
        bookRepo.save(book1);
        bookRepo.save(book2);
        audit.log("add_book");
        System.out.println("2. Carti adaugate: " + book1 + ", " + book2);

        // ---- Actiunea 3: Adauga cititor ----
        Reader reader = new Reader("Ion Popescu", "ion.popescu@email.com");
        readerRepo.save(reader);
        audit.log("add_reader");
        System.out.println("3. Cititor adaugat: " + reader);

        // ---- Actiunea 4: Listeaza toate cartile ----
        List<Book> allBooks = bookRepo.findAll();
        audit.log("list_books");
        System.out.println("4. Toate cartile (" + allBooks.size() + "):");
        allBooks.forEach(b -> System.out.println("   " + b));

        // ---- Actiunea 5: Cauta carte dupa id ----
        bookRepo.findById(book1.getId()).ifPresentOrElse(
            b -> System.out.println("5. Carte gasita: " + b),
            () -> System.out.println("5. Carte negasita.")
        );
        audit.log("find_book_by_id");

        // ---- Actiunea 6: Actualizeaza carte ----
        book1.setTitle("100 de ani de singuratate (Ed. speciala)");
        bookRepo.update(book1);
        audit.log("update_book");
        System.out.println("6. Carte actualizata: " + book1);

        // ---- Actiunea 7: Imprumuta carte (TRANZACTIE) ----
        long loanId = libraryService.borrowBook(reader.getId(), book1.getId());
        audit.log("borrow_book");
        System.out.println("7. Imprumut creat cu ID=" + loanId);

        // ---- Actiunea 8: Returneaza carte (TRANZACTIE) ----
        libraryService.returnBook(loanId);
        audit.log("return_book");
        System.out.println("8. Carte returnata.");

        // ---- Actiunea 9: Raport imprumuturi active cu JOIN ----
        List<String> activeLoans = libraryService.getActiveLoansWithDetails();
        audit.log("report_active_loans");
        System.out.println("9. Imprumuturi active: " + (activeLoans.isEmpty() ? "niciun" : ""));
        activeLoans.forEach(s -> System.out.println("   " + s));

        // ---- Actiunea 10: Sterge cititor ----
        readerRepo.delete(reader.getId());
        audit.log("delete_reader");
        System.out.println("10. Cititor sters cu ID=" + reader.getId());

        System.out.println("\n=== Demo finalizat. Verifica audit.csv ===");
        DatabaseConnection.getInstance().close();  // inchidem conexiunea
    }
}
```

> **Notă**: Fix eroare de compilare — importul `DatabaseConnection` trebuie adăugat:
> `import com.pao.laboratory12.util.DatabaseConnection;`

---

## Output așteptat la rulare

```
=== BIBLIOTECA JDBC — Demo Lab12 ===

1. Autor adaugat: Author{id=1, name='Gabriel Garcia Marquez', country='CO'}
2. Carti adaugate: Book{id=1, ...}, Book{id=2, ...}
3. Cititor adaugat: Reader{id=1, name='Ion Popescu', ...}
4. Toate cartile (2):
   Book{id=1, title='100 de ani de singuratate', ...}
   Book{id=2, title='Dragostea in vremea holerei', ...}
5. Carte gasita: Book{id=1, ...}
6. Carte actualizata: Book{id=1, title='100 de ani de singuratate (Ed. speciala)', ...}
[TX] borrowBook comis cu succes. Loan ID=1
7. Imprumut creat cu ID=1
[TX] returnBook comis. Book ID=1 disponibila din nou.
8. Carte returnata.
9. Imprumuturi active: niciun
10. Cititor sters cu ID=1
=== Demo finalizat. Verifica audit.csv ===
```

## Conținut `audit.csv` așteptat

```
add_author,2026-05-18T10:30:01
add_book,2026-05-18T10:30:01
add_reader,2026-05-18T10:30:01
list_books,2026-05-18T10:30:01
find_book_by_id,2026-05-18T10:30:01
update_book,2026-05-18T10:30:01
borrow_book,2026-05-18T10:30:02
return_book,2026-05-18T10:30:02
report_active_loans,2026-05-18T10:30:02
delete_reader,2026-05-18T10:30:02
```

---

## Acceptance Checklist — Exercise 2

- [ ] Metoda `borrowBook(readerId, bookId)` conține `setAutoCommit(false)`, `commit()`, `rollback()`, `setAutoCommit(true)` în `finally`.
- [ ] Dacă cartea nu este disponibilă, `borrowBook` aruncă excepție și BD rămâne nemodificată (testează dând același `bookId` de două ori).
- [ ] Există **≥3 metode SQL** cu `JOIN` în `LibraryService` (sau repository-uri).
- [ ] `AuditService` este Singleton + Singleton nu conține `static` pe lock.
- [ ] `audit.csv` este deschis cu `new FileWriter(AUDIT_FILE, true)` — al doilea argument `true` = append.
- [ ] `lock.unlock()` este în blocul `finally` — nu se poate omite chiar dacă apare excepție la scriere.
- [ ] `Main` apelează `audit.log(...)` după fiecare dintre cele **10 acțiuni**.
- [ ] La a doua rulare a `Main`, `audit.csv` conține **20 de linii** (nu se suprascrie).

---

## Demonstrarea rollback (test manual)

Adaugă temporar în `Main` după actiunea 7:

```java
// Test rollback: incearca sa imprumuti aceeasi carte (nu e disponibila)
try {
    libraryService.borrowBook(reader.getId(), book1.getId()); // book1 e deja imprumutat
} catch (SQLException e) {
    System.out.println("[ROLLBACK demonstrat] " + e.getMessage());
    // Verifica in BD: loan nu a primit un rand nou, book.available ramane 0
}
```

Dacă tranzacția funcționează corect, mesajul `[TX] borrowBook — rollback datorita: Cartea cu id=1 nu este disponibila.` apare în consolă și baza de date rămâne intactă.

---

## Greșeli frecvente

| Greșeală | Consecință | Fix |
|----------|------------|-----|
| `setAutoCommit(false)` fără `finally { setAutoCommit(true) }` | Conexiunea rămâne blocată în tranzacție | Pune `setAutoCommit(true)` în `finally` |
| `commit()` înainte de toate SQL-urile | Modificări parțiale salvate | `commit()` se apelează **după** ultimul SQL reușit |
| `FileWriter(file, false)` la AuditService | Fișierul e suprascris la fiecare rulare | Al doilea parametru **trebuie** să fie `true` |
| `lock.unlock()` în afara `finally` | Dacă `FileWriter` aruncă excepție, lock-ul nu se eliberează niciodată | Pune `unlock()` în `finally` |
| JOIN fără alias | `SELECT name` ambiguu dacă `name` apare în două tabele | Folosește aliasuri: `b.title AS book_title` |

