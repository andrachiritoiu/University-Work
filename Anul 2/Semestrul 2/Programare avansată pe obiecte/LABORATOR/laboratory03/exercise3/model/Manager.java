package com.pao.laboratory03.exercise3.model;

/**
 * TODO: Implementează Manager extends Angajat.
 * - Atribut: private int nrSubordonati
 * - Constructor: super(name, salariuBaza), this.nrSubordonati = nrSubordonati
 * - salariuTotal() = getSalariuBaza() * 2 + nrSubordonati * 100
 */
public class Manager extends Angajat {

    // TODO: private int nrSubordonati

    public Manager(String name, double salariuBaza, int nrSubordonati) {
        super(name, salariuBaza);
        // TODO: this.nrSubordonati = nrSubordonati
    }

    @Override
    public double salariuTotal() {
        return 0; // TODO: getSalariuBaza() * 2 + nrSubordonati * 100
    }
}
