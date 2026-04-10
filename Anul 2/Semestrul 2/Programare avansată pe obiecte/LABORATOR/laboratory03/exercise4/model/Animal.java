package com.pao.laboratory03.exercise4.model;

/**
 * Clasă abstractă: implementează Describable, dar lasă sound() abstract.
 * DATĂ — nu modifica.
 */
public abstract class Animal implements Describable {
    private String name;
    private int age;

    public Animal(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() { return name; }
    public int getAge() { return age; }

    /** Fiecare subclasă definește sunetul: Dog → "Ham!", Cat → "Miau!", etc. */
    public abstract String sound();

    @Override
    public String describe() {
        return name + " (varsta: " + age + " ani) face: " + sound();
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "{name='" + name + "', age=" + age + "}";
    }
}
