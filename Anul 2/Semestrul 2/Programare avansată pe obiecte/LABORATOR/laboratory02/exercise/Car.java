package com.pao.laboratory02.exercise;

import java.util.Arrays;

/**
 * Exercițiu — Model Car
 *
 * Această clasă este dată completă — citește-o și înțelege structura.
 *
 * Observă:
 * - 3 atribute private: name, color, reviews
 * - Constructorul primește doar name și color — reviews pornește ca array gol
 * - Getteri și setteri pentru TOATE atributele
 * - toString() afișează și reviews cu Arrays.toString
 */
public class Car {
    private String name;
    private String color;
    private String[] reviews;

    public Car(String name, String color) {
        this.name = name;
        this.color = color;
        this.reviews = new String[0]; // pornește fără review-uri
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String[] getReviews() {
        return reviews;
    }

    public void setReviews(String[] reviews) {
        this.reviews = reviews;
    }

    @Override
    public String toString() {
        return "Car{" +
                "name='" + name + '\'' +
                ", color='" + color + '\'' +
                ", reviews=" + Arrays.toString(reviews) +
                '}';
    }
}

