package com.pao.laboratory03.exercise4.model;

/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  TODO — Implementează clasa Cat                                        │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Cat extinde Animal.
 *
 * Constructor:
 *   Cat(String name, int age)
 *   - Apelează super(name, age)
 *
 * Implementează sound():
 *   - Returnează "Miau!"
 *
 * Exemplu:
 *   Cat c = new Cat("Miti", 3);
 *   c.sound()    → "Miau!"
 *   c.describe() → "Miti (varsta: 3 ani) face: Miau!"
 *   c.toString() → "Cat{name='Miti', age=3}"
 */
public class Cat extends Animal {

    public Cat(String name, int age) {
        super(name, age);
    }

    @Override
    public String sound() {
        return ""; // TODO: returnează "Miau!"
    }
}

