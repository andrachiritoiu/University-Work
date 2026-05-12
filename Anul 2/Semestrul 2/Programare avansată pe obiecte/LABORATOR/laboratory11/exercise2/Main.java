package com.pao.laboratory11.exercise2;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        try {
            run();
        } catch (IOException e) {
            // Keep deterministic checker output.
        }
    }

    private static void run() throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));

        String first = nextNonEmpty(br);
        if (first == null) {
            return;
        }

        int n = Integer.parseInt(first);
        List<Tx> txs = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            String line = nextNonEmpty(br);
            if (line == null) {
                return;
            }

            String[] p = line.split("\\s+");
            txs.add(new Tx(
                    Integer.parseInt(p[0]),
                    Double.parseDouble(p[1]),
                    p[2],
                    p[3],
                    p[4],
                    p[5]));
        }

        int q = Integer.parseInt(nextNonEmpty(br));
        for (int i = 0; i < q; i++) {
            String line = nextNonEmpty(br);
            if (line == null) {
                return;
            }

            String[] p = line.split("\\s+");
            String op = p[0];

            switch (op) {
                case "REPORT_MONTH": {
//                    String month = p[1];
//                    double total = 0.0;
//                    int count = 0;
//                    for (Tx tx : txs) {
//                        if (tx.date.startsWith(month)) {
//                            total += tx.amount;
//                            count++;
//                        }
//                    }
//                    System.out.printf(Locale.US, "MONTH %s total=%.2f count=%d%n", month, total, count);

                    String month = p[1];
                    double total = txs.stream()
                            .filter(t -> t.date.startsWith(month))
                            .mapToDouble(t -> t.amount)
                            .sum();

                    long count = txs.stream()
                                    .filter(t ->t.date.startsWith(month))
                                    .count();

                    System.out.printf(Locale.US, "MONTH %s total=%.2f count=%d%n", month, total, count);

                    break;
                }

                case "REPORT_ACCOUNT": {
//                    String account = p[1];
//                    double total = 0.0;
//                    int count = 0;
//                    for (Tx tx : txs) {
//                        if (tx.account.equals(account)) {
//                            total += tx.amount;
//                            count++;
//                        }
//                    }
//                    System.out.printf(Locale.US, "ACCOUNT %s total=%.2f count=%d%n", account, total, count);

                    String account = p[1];
                    double total = txs.stream()
                            .filter(t -> t.account.equals(account))
                            .mapToDouble(t -> t.amount)
                            .sum();

                    long count = txs.stream()
                            .filter(t -> t.account.equals(account))
                            .count();

                    System.out.printf(Locale.US, "ACCOUNT %s total=%.2f count=%d%n", account, total, count);

                    break;
                }

                case "TOP_CHANNELS": {
//                    int k = Integer.parseInt(p[1]);
//                    Map<String, Integer> counts = new HashMap<>();
//                    for (Tx tx : txs) {
//                        counts.put(tx.channel, counts.getOrDefault(tx.channel, 0) + 1);
//                    }
//
//                    List<Map.Entry<String, Integer>> entries = new ArrayList<>(counts.entrySet());
//                    entries.sort(Comparator
//                            .comparingInt((Map.Entry<String, Integer> e) -> e.getValue()).reversed()
//                            .thenComparing(Map.Entry::getKey));
//
//                    if (entries.isEmpty()) {
//                        System.out.println("NONE");
//                        break;
//                    }
//
//                    int limit = Math.min(k, entries.size());
//                    for (int idx = 0; idx < limit; idx++) {
//                        Map.Entry<String, Integer> e = entries.get(idx);
//                        System.out.println(e.getKey() + " " + e.getValue());
//                    }


                    int k = Integer.parseInt(p[1]);

                    if (txs.isEmpty()) {
                        System.out.println("NONE");
                        break;
                    }

                    Map<String, Long> counts = txs.stream()
                            .collect(Collectors.groupingBy(t -> t.channel, Collectors.counting()));

                    counts.entrySet().stream()
                            .sorted(Map.Entry.<String, Long>comparingByValue(Comparator.reverseOrder())
                            .thenComparing(Map.Entry.comparingByKey()))
                            .limit(k)
                            .forEach(e -> System.out.println(e.getKey() + " " + e.getValue()));

                    break;
                }

                default:
                    // Ignore unknown commands.
                    break;
            }
        }
    }

    private static String nextNonEmpty(BufferedReader br) throws IOException {
        String line;
        while ((line = br.readLine()) != null) {
            if (!line.trim().isEmpty()) {
                return line.trim();
            }
        }
        return null;
    }

    private static final class Tx {
        private final int id;
        private final double amount;
        private final String date;
        private final String country;
        private final String channel;
        private final String account;

        private Tx(int id, double amount, String date, String country, String channel, String account) {
            this.id = id;
            this.amount = amount;
            this.date = date;
            this.country = country;
            this.channel = channel;
            this.account = account;
        }
    }
}
