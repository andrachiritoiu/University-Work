package com.pao.laboratory12;

import com.pao.laboratory12.model.*;
import com.pao.laboratory12.repository.*;
import com.pao.laboratory12.service.AuditService;
import com.pao.laboratory12.service.LibraryService;
import com.pao.laboratory12.util.DatabaseConnection;

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
        // Inainte de a sterge cititorul, eliminam imprumutul asociat pentru a respecta FK-ul loan.reader_id -> reader.id.
        loanRepo.delete(loanId);
        readerRepo.delete(reader.getId());
        audit.log("delete_reader");
        System.out.println("10. Cititor sters cu ID=" + reader.getId());

        System.out.println("\n=== Demo finalizat. Verifica audit.csv ===");
        DatabaseConnection.getInstance().close();  // inchidem conexiunea
    }
}
