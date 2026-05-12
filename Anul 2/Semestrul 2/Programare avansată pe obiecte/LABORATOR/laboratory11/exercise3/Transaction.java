package com.pao.laboratory11.exercise3;

import java.math.BigDecimal;
import java.time.LocalDate;

public final class Transaction {
    private final int id;
    private final BigDecimal amount;
    private final LocalDate date;

    public String getCountry() {
        return country;
    }

    public int getId() {
        return id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public LocalDate getDate() {
        return date;
    }

    public String getChannel() {
        return channel;
    }

    private final String country;
    private final String channel;

    public Transaction(int id, BigDecimal amount, LocalDate date, String country, String channel) {
        this.id = id; this.amount = amount; this.date = date; this.country = country; this.channel = channel;
    }

    @Override
    public String toString() {
        return "[" + id + "] " + amount + " " + date + " " + country + " " + channel;
    }
}