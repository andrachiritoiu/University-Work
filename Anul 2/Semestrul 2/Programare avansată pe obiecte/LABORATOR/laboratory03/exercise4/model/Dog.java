package com.pao.laboratory03.exercise4.model;

/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  TODO — Implementează clasa Dog                                        │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Dog extinde Animal.
 *
 * Constructor:
 *   Dog(String name, int age)
 *   - Apelează super(name, age)
 *
 * Implementează sound():
 *   - Returnează "Ham!"
 *
 * Exemplu:
 *   Dog d = new Dog("Rex", 5);
 *   d.sound()    → "Ham!"
 *   d.describe() → "Rex (varsta: 5 ani) face: Ham!"
 *   d.toString() → "Dog{name='Rex', age=5}"
 */
public class Dog extends Animal {

    public Dog(String name, int age) {
        super(name, age);
    }

    @Override
    public String sound() {
        return ""; // TODO: returnează "Ham!"
    }
}

