package com.pao.laboratory07.exercise3;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.stream.Collectors;

public class Main {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Comanda> comenzi = new ArrayList<>();

        int n = Integer.parseInt(sc.nextLine().trim());

        for (int i = 0; i < n; i++) {
            String linie = sc.nextLine().trim();
            Comanda comanda = parseComanda(linie);
            comenzi.add(comanda);
        }

        for (Comanda c : comenzi) {
            System.out.println(c.descriere());
        }

        while (sc.hasNextLine()) {
            String linie = sc.nextLine().trim();

            if (linie.equals("QUIT")) {
                break;
            } else if (linie.equals("STATS")) {
                afiseazaStats(comenzi);
            } else if (linie.startsWith("FILTER ")) {
                double prag = Double.parseDouble(linie.split("\\s+")[1]);
                afiseazaFilter(comenzi, prag);
            } else if (linie.equals("SORT")) {
                afiseazaSort(comenzi);
            } else if (linie.equals("SPECIAL")) {
                afiseazaSpecial(comenzi);
            } else if (!linie.isEmpty()) {
                throw new InvalidCommandException("Comanda necunoscuta: " + linie);
            }
        }

        sc.close();
    }

    private static Comanda parseComanda(String linie) {
        String[] parti = linie.split("\\s+");

        if (parti.length == 0) {
            throw new InvalidCommandException("Linie vida");
        }

        String tip = parti[0];

        try {
            return switch (tip) {
                case "STANDARD" -> {
                    if (parti.length != 4) {
                        throw new InvalidCommandException("Format invalid pentru STANDARD");
                    }
                    String nume = parti[1];
                    double pret = Double.parseDouble(parti[2]);
                    String client = parti[3];
                    yield new ComandaStandard(nume, pret, client);
                }
                case "DISCOUNTED" -> {
                    if (parti.length != 5) {
                        throw new InvalidCommandException("Format invalid pentru DISCOUNTED");
                    }
                    String nume = parti[1];
                    double pret = Double.parseDouble(parti[2]);
                    int discount = Integer.parseInt(parti[3]);
                    String client = parti[4];
                    yield new ComandaRedusa(nume, pret, discount, client);
                }
                case "GIFT" -> {
                    if (parti.length != 3) {
                        throw new InvalidCommandException("Format invalid pentru GIFT");
                    }
                    String nume = parti[1];
                    String client = parti[2];
                    yield new ComandaGratuita(nume, client);
                }
                default -> throw new InvalidCommandException("Tip de comanda invalid: " + tip);
            };
        } catch (NumberFormatException e) {
            throw new InvalidCommandException("Valoare numerica invalida in linia: " + linie);
        }
    }

    private static void afiseazaStats(List<Comanda> comenzi) {
        System.out.println();
        System.out.println("--- STATS ---");

        Map<String, Double> medii = comenzi.stream()
                .collect(Collectors.groupingBy(
                        Comanda::tipComanda,
                        Collectors.averagingDouble(Comanda::pretFinal)
                ));

        System.out.println("STANDARD: medie = %.2f lei".formatted(
                medii.getOrDefault("STANDARD", 0.0)));
        System.out.println("DISCOUNTED: medie = %.2f lei".formatted(
                medii.getOrDefault("DISCOUNTED", 0.0)));
        System.out.println("GIFT: medie = %.2f lei".formatted(
                medii.getOrDefault("GIFT", 0.0)));
    }

    private static void afiseazaFilter(List<Comanda> comenzi, double prag) {
        System.out.println();
        System.out.println("--- FILTER (>= %.2f) ---".formatted(prag));

        List<Comanda> filtrate = comenzi.stream()
                .filter(c -> c.pretFinal() >= prag)
                .toList();

        for (Comanda c : filtrate) {
            System.out.println(c.descriereFaraStare());
        }
    }

    private static void afiseazaSort(List<Comanda> comenzi) {
        System.out.println();
        System.out.println("--- SORT (by client, then by pret) ---");

        List<Comanda> sortate = comenzi.stream()
                .sorted(
                        Comparator.comparing(Comanda::getClient)
                                .thenComparing(Comanda::pretFinal)
                )
                .toList();

        for (Comanda c : sortate) {
            System.out.println(c.descriereFaraStare());
        }
    }

    private static void afiseazaSpecial(List<Comanda> comenzi) {
        System.out.println();
        System.out.println("--- SPECIAL (discount > 15%) ---");

        List<Comanda> speciale = comenzi.stream()
                .filter(c -> c instanceof ComandaRedusa cr && cr.getDiscountProcent() > 15)
                .toList();

        for (Comanda c : speciale) {
            System.out.println(c.descriereFaraStareSpecial());
        }
    }
}