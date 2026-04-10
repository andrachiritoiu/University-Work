package com.pao.laboratory07.exercise3;

public final class ComandaRedusa extends Comanda {

    private double pret;
    private int discountProcent;

    public ComandaRedusa(String nume, double pret, int discountProcent, String client) {
        super(nume, client);
        this.pret = pret;
        this.discountProcent = discountProcent;
    }

    public int getDiscountProcent() {
        return discountProcent;
    }

    @Override
    public double pretFinal() {
        return pret * (1 - discountProcent / 100.0);
    }

    @Override
    public String descriere() {
        return "DISCOUNTED: %s, pret: %.2f lei (-%d%%) [%s] - client: %s"
                .formatted(nume, pretFinal(), discountProcent, stare, client);
    }

    @Override
    public String descriereFaraStare() {
        return "DISCOUNTED: %s, pret: %.2f lei - client: %s"
                .formatted(nume, pretFinal(), client);
    }

    @Override
    public String descriereFaraStareSpecial() {
        return "DISCOUNTED: %s, pret: %.2f lei (-%d%%) - client: %s"
                .formatted(nume, pretFinal(), discountProcent, client);
    }

    @Override
    public String tipComanda() {
        return "DISCOUNTED";
    }
}