package com.pao.laboratory07.exercise3;

public final class ComandaGratuita extends Comanda {

    public ComandaGratuita(String nume, String client) {
        super(nume, client);
    }

    @Override
    public double pretFinal() {
        return 0.0;
    }

    @Override
    public String descriere() {
        return "GIFT: %s, gratuit [%s] - client: %s"
                .formatted(nume, stare, client);
    }

    @Override
    public String descriereFaraStare() {
        return "GIFT: %s, gratuit - client: %s"
                .formatted(nume, client);
    }

    @Override
    public String tipComanda() {
        return "GIFT";
    }
}