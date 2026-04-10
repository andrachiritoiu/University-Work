package com.pao.laboratory07.exercise2;

public final class ComandaGratuita extends Comanda{
    public ComandaGratuita(String nume) {
        super(nume);
    }

    public double pretFinal(){return 0.0;}
    public String descriere(){
        return "GIFT: " + this.nume + ", gratuit [PLACED]";
    }
}
