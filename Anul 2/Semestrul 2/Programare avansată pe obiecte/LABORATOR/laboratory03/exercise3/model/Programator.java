package com.pao.laboratory03.exercise3.model;

/**
 * TODO: Implementează Programator extends Angajat.
 * - Atribut: private String limbajPreferat
 * - Constructor: super(name, salariuBaza), this.limbajPreferat = limbajPreferat
 * - salariuTotal() = getSalariuBaza() * 1.5
 */
public class Programator extends Angajat {

    // TODO: private String limbajPreferat

    public Programator(String name, double salariuBaza, String limbajPreferat) {
        super(name, salariuBaza);
        // TODO: this.limbajPreferat = limbajPreferat
    }

    @Override
    public double salariuTotal() {
        return 0; // TODO: getSalariuBaza() * 1.5
    }
}
