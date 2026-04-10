package com.pao.laboratory02;

import com.pao.laboratory02.model.Dog;
import com.pao.laboratory02.model.Cat;

import java.util.Arrays;

/**
 *  Laboratory 01 — Clase, Încapsulare, Array-uri avansate
 *
 *  În acest laborator învățăm:
 *  - Cum definim o clasă proprie (atribute private, constructori, getteri/setteri, toString)
 *  - Cum organizăm clasele în subpachete (model/, utils/, exercise/)
 *  - Cum lucrăm cu array-uri de obiecte (redimensionare dinamică, sortare)
 *
 *  Rezolvați exercițiile din:
 *    1. com.pao.laboratory02.arrays      → ArrayDemo.java
 *    2. com.pao.laboratory02.exercise    → Car.java, CarService.java, Main.java
 *
 *  Începeți prin a citi acest fișier și clasele din model/ — apoi treceți la exerciții.
 */
public class Main {
    public static void main(String[] args) {

        // === 1. Instanțiere obiecte ===
        // Creăm obiecte folosind constructorul parametrizat
        Dog dog1 = new Dog("Rex", "maro");
        Dog dog2 = new Dog("Luna", "alb");

        // toString() este apelat automat la println
        System.out.println(dog1);  // Dog{name='Rex', color='maro'}
        System.out.println(dog2);  // Dog{name='Luna', color='alb'}

        // Getteri — acces la atributele private
        System.out.println("Numele primului câine: " + dog1.getName());

        // Setteri — modificare atribute
        dog1.setColor("negru");
        System.out.println("După modificare: " + dog1);

        // === 2. Al doilea model — importat din același subpachet model/ ===
        Cat cat1 = new Cat("Miti", "portocaliu");
        System.out.println(cat1);

        // === 3. Array de obiecte ===
        Dog[] dogs = {dog1, dog2, new Dog("Azorel", "cenușiu")};

        System.out.println("\n--- Array de câini ---");
        for (Dog d : dogs) {
            System.out.println(d);
        }

        // === 4. Arrays.toString — afișare rapidă a unui array ===
        System.out.println("\nCu Arrays.toString: " + Arrays.toString(dogs));
    }
}

