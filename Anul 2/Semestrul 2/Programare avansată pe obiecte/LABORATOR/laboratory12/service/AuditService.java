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