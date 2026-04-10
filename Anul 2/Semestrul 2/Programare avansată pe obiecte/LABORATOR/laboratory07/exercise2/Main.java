package com.pao.laboratory07.exercise2;

import java.util.*;
import com.pao.laboratory07.exercise1.OrderState;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        List<Comanda> comenzi = new ArrayList<>();
        int nrStandard = 0, nrDiscounted = 0, nrGift = 0;
        double sumaStandard = 0, sumaDiscounted = 0;
        for (int i = 0; i < n; i++) {
            String line = sc.nextLine().trim();
            String[] tokens = line.split(" ");
            if (tokens[0].equals("STANDARD")) {
                String nume = tokens[1];
                double pret = Double.parseDouble(tokens[2]);
                Comanda c = new ComandaStandard(nume, pret);
                comenzi.add(c);
                nrStandard++;
                sumaStandard += c.pretFinal();
            } else if (tokens[0].equals("DISCOUNTED")) {
                String nume = tokens[1];
                double pret = Double.parseDouble(tokens[2]);
                int discount = Integer.parseInt(tokens[3]);
                Comanda c = new ComandaRedusa(nume, pret, discount);
                comenzi.add(c);
                nrDiscounted++;
                sumaDiscounted += c.pretFinal();
            } else if (tokens[0].equals("GIFT")) {
                String nume = tokens[1];
                Comanda c = new ComandaGratuita(nume);
                comenzi.add(c);
                nrGift++;
            }
        }
        for (Comanda c : comenzi) {
            System.out.println(c.descriere());
        }
        System.out.println();
        System.out.println("Statistici:");
        if (nrStandard > 0)
            System.out.printf("STANDARD: suma = %.2f lei, numar = %d\n", sumaStandard, nrStandard);
        if (nrDiscounted > 0)
            System.out.printf("DISCOUNTED: suma = %.2f lei, numar = %d\n", sumaDiscounted, nrDiscounted);
        if (nrGift > 0)
            System.out.printf("GIFT: suma = 0.00 lei, numar = %d\n", nrGift);
        System.out.printf("Total platit: %.2f lei\n", sumaStandard + sumaDiscounted);
    }
}
