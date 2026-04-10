package com.pao.laboratory03.exercise4.service;

import com.pao.laboratory03.exercise4.model.Animal;

import java.util.ArrayList;
import java.util.List;

/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  TODO — Completează metodele din ZooService                            │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Serviciu Singleton care gestionează animalele din grădina zoologică.
 * Folosește ArrayList<Animal> intern.
 *
 * Pattern: Bill Pugh Singleton (la fel ca CarService din Lab 01).
 * Partea de Singleton este DATĂ — tu completezi doar operațiile (4 metode).
 *
 * Ce trebuie să faci:
 *
 *   1. addAnimal(Animal a)
 *      - Adaugă animalul în lista internă.
 *      - Afișează: "Adăugat: " + a
 *
 *   2. listAll()
 *      - Dacă lista e goală → afișează "Grădina zoologică este goală."
 *      - Altfel, pentru fiecare animal afișează describe() (din interfața Describable).
 *      - Format: "  1. Rex (varsta: 5 ani) face: Ham!"
 *
 *   3. listByType(String type)
 *      - Parcurge lista și afișează doar animalele al căror getClass().getSimpleName()
 *        este egal cu type (ex: "Dog", "Cat", "Parrot").
 *      - Dacă nu găsește niciunul, afișează: "Nu există animale de tipul: " + type
 *      - Hint: folosește animal.getClass().getSimpleName().equals(type)
 *
 *   4. findOldest()
 *      - Dacă lista e goală → afișează "Grădina zoologică este goală."
 *      - Altfel, parcurge lista și găsește animalul cu vârsta maximă.
 *      - Afișează: "Cel mai bătrân animal: " + animal.describe()
 *      - Hint: ține o variabilă Animal oldest = animals.get(0), apoi compară cu fiecare.
 */
public class ZooService {

    private List<Animal> animals;

    // === Singleton (DAT — nu modifica) ===
    private ZooService() {
        this.animals = new ArrayList<>();
    }

    private static class Holder {
        private static final ZooService INSTANCE = new ZooService();
    }

    public static ZooService getInstance() {
        return Holder.INSTANCE;
    }
    // === Sfârșit Singleton ===

    /**
     * TODO: Adaugă un animal în listă.
     *
     * Pași:
     *   1. animals.add(a);
     *   2. System.out.println("Adăugat: " + a);
     */
    public void addAnimal(Animal a) {
        // TODO: implementează aici
    }

    /**
     * TODO: Afișează toate animalele cu describe().
     *
     * Dacă lista e goală:
     *   System.out.println("Grădina zoologică este goală.");
     *
     * Altfel, parcurge cu index (for clasic) și afișează:
     *   System.out.println("  " + (i+1) + ". " + animals.get(i).describe());
     */
    public void listAll() {
        // TODO: implementează aici
    }

    /**
     * TODO: Afișează doar animalele de un anumit tip.
     *
     * Parcurge lista. Pentru fiecare animal verifică:
     *   if (animal.getClass().getSimpleName().equals(type))
     *
     * Dacă nu găsești niciunul:
     *   System.out.println("Nu există animale de tipul: " + type);
     *
     * Hint: folosește un boolean found = false; la început.
     *       Setează found = true când găsești un animal.
     *       La final, verifică if (!found).
     */
    public void listByType(String type) {
        // TODO: implementează aici
    }

    /**
     * TODO: Găsește și afișează cel mai bătrân animal.
     *
     * Dacă lista e goală:
     *   System.out.println("Grădina zoologică este goală.");
     *
     * Altfel:
     *   1. Animal oldest = animals.get(0);
     *   2. Parcurge restul listei: dacă animals.get(i).getAge() > oldest.getAge()
     *      → oldest = animals.get(i);
     *   3. System.out.println("Cel mai bătrân animal: " + oldest.describe());
     */
    public void findOldest() {
        // TODO: implementează aici
    }
}

