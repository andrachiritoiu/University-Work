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