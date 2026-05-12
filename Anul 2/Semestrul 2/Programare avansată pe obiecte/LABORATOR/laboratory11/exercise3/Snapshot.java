package com.pao.laboratory11.exercise3;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public final class Snapshot {
    private final Map<String, Long> countByCountry;
    private final Map<String, Long> countByChannel;
    private final BigDecimal totalAmount;
    private final List<Transaction> topTransactions;

    public Snapshot(Map<String, Long> byCountry, Map<String, Long> byChannel, BigDecimal total, List<Transaction> top) {
        this.countByCountry = Collections.unmodifiableMap(new HashMap<>(byCountry));
        this.countByChannel = Collections.unmodifiableMap(new HashMap<>(byChannel));
        this.totalAmount = total;
        this.topTransactions = List.copyOf(top);
    }

    public Map<String, Long> getCountByChannel() {
        return countByChannel;
    }

    public Map<String, Long> getCountByCountry() {
        return countByCountry;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public List<Transaction> getTopTransactions() {
        return topTransactions;
    }

}
