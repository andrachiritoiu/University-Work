package com.pao.laboratory03.exercise3;

import com.pao.laboratory03.exercise3.model.Manager;
import com.pao.laboratory03.exercise3.model.Programator;
import com.pao.laboratory03.exercise3.service.AngajatService;

/** Testează Programator, Manager, AngajatService. NU modifica. */
public class Main {
    public static void main(String[] args) {

        AngajatService service = new AngajatService();

        System.out.println("=== Adăugare angajați ===");
        Programator ana = new Programator("Ana", 5000, "Java");
        Programator mihai = new Programator("Mihai", 4500, "Python");
        Manager ion = new Manager("Ion", 6000, 10);
        Manager elena = new Manager("Elena", 7000, 5);

        service.addAngajat(ana);
        service.addAngajat(mihai);
        service.addAngajat(ion);
        service.addAngajat(elena);

        System.out.println("\n=== Lista angajaților ===");
        service.listAll();

        System.out.println("\n=== Total salarii ===");
        double total = service.totalSalarii();
        System.out.printf("Suma salariilor: %.2f RON%n", total);

        // Verificare automată
        System.out.println("\n=== VERIFICARE ===");
        boolean progOk = Math.abs(ana.salariuTotal() - 7500.0) < 0.01;
        boolean managerOk = Math.abs(ion.salariuTotal() - 13000.0) < 0.01;
        boolean totalOk = Math.abs(total - 41750.0) < 0.01;
        System.out.println("Test 1 (Programator): " + (progOk ? "PASSED ✓" : "FAILED ✗"));
        System.out.println("Test 2 (Manager):     " + (managerOk ? "PASSED ✓" : "FAILED ✗"));
        System.out.println("Test 3 (Total):       " + (totalOk ? "PASSED ✓" : "FAILED ✗"));
    }
}
