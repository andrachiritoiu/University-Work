package com.pao.laboratory10.exercise3;

import com.pao.laboratory10.exercise1.TipTranzactie;

public class TranzactieStream {
    int id;
    double suma;
    String data;
    TipTranzactie tip;
    String contSursa;

    public TranzactieStream(int id, double suma, String data, TipTranzactie tip, String contSursa) {
        this.id = id;
        this.suma = suma;
        this.data = data;
        this.tip = tip;
        this.contSursa = contSursa;
    }

    public int getId() {
        return id;
    }

    public double getSuma() {
        return suma;
    }

    public String getData() {
        return data;
    }

    public TipTranzactie getTip() {
        return tip;
    }

    public String getContSursa() {
        return contSursa;
    }

    @Override
    public String toString() {
        return String.format("[%d] %s %s: %.2f RON, cont sursa: %s",
                id, data, tip, suma, contSursa);
    }
}
