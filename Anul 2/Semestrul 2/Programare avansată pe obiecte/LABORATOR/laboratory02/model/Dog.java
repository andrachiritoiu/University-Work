package com.pao.laboratory02.model;

/**
 * Exemplu de clasă cu încapsulare.
 *
 * Regulile încapsulării:
 * - Atributele sunt PRIVATE (nu pot fi accesate direct din exterior).
 * - Accesul se face prin metode publice: getteri (citire) și setteri (scriere).
 * - Constructorul inițializează obiectul.
 * - toString() oferă o reprezentare text a obiectului.
 */
public class Dog {
    private String name;
    private String color;

    // Constructor parametrizat — obligatoriu când vrem să creăm un obiect cu valori
    public Dog(String name, String color) {
        this.name = name;    // this.name = atributul clasei, name = parametrul
        this.color = color;
    }

    // Constructor fără parametri (default) — util când vrem un obiect "gol"
    public Dog() {
    }

    // === Getteri — citire atribute ===

    public String getName() {
        return name;
    }

    public String getColor() {
        return color;
    }

    // === Setteri — modificare atribute ===

    public void setName(String name) {
        this.name = name;
    }

    public void setColor(String color) {
        this.color = color;
    }

    // === toString — afișare formatată ===
    // Se apelează automat când facem System.out.println(dog)

    @Override
    public String toString() {
        return "Dog{" +
                "name='" + name + '\'' +
                ", color='" + color + '\'' +
                '}';
    }
}

