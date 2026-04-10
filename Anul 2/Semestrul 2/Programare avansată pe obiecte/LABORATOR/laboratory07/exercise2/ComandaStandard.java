package com.pao.laboratory07.exercise2;

import com.pao.laboratory07.exercise1.OrderState;

public final class ComandaStandard extends Comanda{
    protected Double pret;

    public ComandaStandard(String nume, Double pret) {
        super(nume);
        this.pret = pret;
    }

    public double pretFinal(){return this.pret;}
    public String descriere(){
        return "STANDARD: " + this.nume + ", pret: %.2f lei [%s]".formatted(pretFinal(), stare);
    }
}
