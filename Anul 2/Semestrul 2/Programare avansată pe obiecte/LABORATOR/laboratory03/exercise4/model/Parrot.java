package com.pao.laboratory03.exercise4.model;

/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  TODO — Implementează clasa Parrot                                     │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Parrot extinde Animal.
 *
 * Atribute SUPLIMENTARE:
 *   - knownWords (int) — câte cuvinte știe papagalul
 *
 * Constructor:
 *   Parrot(String name, int age, int knownWords)
 *   - Apelează super(name, age)
 *   - Asignează this.knownWords = knownWords
 *
 * Implementează sound():
 *   - Returnează "Squawk! (știe X cuvinte)" unde X = knownWords
 *   - Exemplu: "Squawk! (știe 50 cuvinte)"
 *
 * Adaugă getter: getKnownWords()
 *
 * Exemplu:
 *   Parrot p = new Parrot("Coco", 2, 50);
 *   p.sound()    → "Squawk! (știe 50 cuvinte)"
 *   p.describe() → "Coco (varsta: 2 ani) face: Squawk! (știe 50 cuvinte)"
 *   p.toString() → "Parrot{name='Coco', age=2}"
 */
public class Parrot extends Animal {

    // TODO: adaugă atributul private int knownWords

    public Parrot(String name, int age, int knownWords) {
        super(name, age);
        // TODO: asignează this.knownWords = knownWords
    }

    // TODO: adaugă getKnownWords()

    @Override
    public String sound() {
        return ""; // TODO: returnează "Squawk! (știe X cuvinte)"
        // Hint: return "Squawk! (știe " + knownWords + " cuvinte)";
    }
}

