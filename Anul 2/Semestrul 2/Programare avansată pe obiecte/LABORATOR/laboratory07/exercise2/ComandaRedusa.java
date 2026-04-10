package com.pao.laboratory07.exercise2;

public final class ComandaRedusa extends Comanda{
    protected Double pret;
    protected int discountProcent;

    public ComandaRedusa(String nume, Double pret, int discountProcent) {
        super(nume);
        this.pret = pret;
        this.discountProcent = discountProcent;
    }

    public double pretFinal(){return this.pret * (1 - this.discountProcent / 100.0);}
    public String descriere(){
        return "DISCOUNTED: " + this.nume + ", pret: %.2f lei (-%d%%) [%s]".formatted(pretFinal(),discountProcent,stare);
    }
}
