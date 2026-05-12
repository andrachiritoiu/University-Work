package com.pao.laboratory11.exercise3;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collector;

public final class CustomCollectors {
    private CustomCollectors() {
    }

    public static Collector<Transaction, ?, Snapshot> toSnapshot(int topN) {
        class Agg {
            private final Map<String, Long> countByCountry = new HashMap<>();
            private final Map<String, Long> countByChannel = new HashMap<>();
            private BigDecimal totalAmount = BigDecimal.ZERO;
            private final List<Transaction> transactions = new ArrayList<>();

            private void add(Transaction tx) {
                countByCountry.merge(tx.getCountry(), 1L, Long::sum);
                countByChannel.merge(tx.getChannel(), 1L, Long::sum);
                totalAmount = totalAmount.add(tx.getAmount());
                transactions.add(tx);
            }

            private Agg combine(Agg other) {
                other.countByCountry.forEach((country, count) ->
                        this.countByCountry.merge(country, count, Long::sum));

                other.countByChannel.forEach((channel, count) ->
                        this.countByChannel.merge(channel, count, Long::sum));

                this.totalAmount = this.totalAmount.add(other.totalAmount);
                this.transactions.addAll(other.transactions);

                return this;
            }

            private Snapshot finish() {
                List<Transaction> top = transactions.stream()
                        .sorted(Comparator
                                .comparing(Transaction::getAmount, Comparator.reverseOrder())
                                .thenComparingInt(Transaction::getId))
                        .limit(topN)
                        .toList();

                return new Snapshot(countByCountry, countByChannel, totalAmount, top);
            }
        }

        return Collector.of(
                Agg::new,
                Agg::add,
                Agg::combine,
                Agg::finish
        );
    }
}