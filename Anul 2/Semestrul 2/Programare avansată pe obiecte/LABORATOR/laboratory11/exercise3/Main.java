package com.pao.laboratory11.exercise3;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        List<Transaction> data = List.of(
                new Transaction(1, new BigDecimal("200.00"), LocalDate.of(2026, 5, 1), "RO", "WEB"),
                new Transaction(2, new BigDecimal("300.00"), LocalDate.of(2026, 5, 2), "RO", "ATM"),
                new Transaction(3, new BigDecimal("300.00"), LocalDate.of(2026, 5, 3), "NL", "APP"),
                new Transaction(4, new BigDecimal("90.00"), LocalDate.of(2026, 6, 1), "RO", "WEB"),
                new Transaction(5, new BigDecimal("500.00"), LocalDate.of(2026, 6, 2), "NG", "CRYPTO"),
                new Transaction(6, new BigDecimal("500.00"), LocalDate.of(2026, 6, 3), "NG", "APP")
        );

        Snapshot snapshot = data.stream()
                .collect(CustomCollectors.toSnapshot(3));

        System.out.println("1) TOTAL");
        System.out.println(snapshot.getTotalAmount());

        System.out.println();

        System.out.println("2) TOP TRANSACTIONS");
        snapshot.getTopTransactions().forEach(System.out::println);

        System.out.println();

        System.out.println("3) COUNT BY COUNTRY");
        snapshot.getCountByCountry().entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue(Comparator.reverseOrder())
                        .thenComparing(Map.Entry.comparingByKey()))
                .forEach(e -> System.out.println(e.getKey() + " " + e.getValue()));

        System.out.println();

        System.out.println("4) COUNT BY CHANNEL");
        snapshot.getCountByChannel().entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue(Comparator.reverseOrder())
                        .thenComparing(Map.Entry.comparingByKey()))
                .forEach(e -> System.out.println(e.getKey() + " " + e.getValue()));
    }
}