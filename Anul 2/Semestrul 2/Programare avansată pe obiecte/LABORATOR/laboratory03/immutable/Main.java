package com.pao.laboratory03.immutable;

/** Demo: imutabilitate — nu există setteri, String se comportă la fel. */
public class Main {
    public static void main(String[] args) {

        ImmutableDog dog = new ImmutableDog("Rex", 5);
        System.out.println("=== Obiect imutabil ===");
        System.out.println(dog);
        // dog.setName("Luna");  // EROARE — metoda nu există

        ImmutableDog dog2 = new ImmutableDog("Luna", 3);
        System.out.println("Obiect nou: " + dog2);
        System.out.println("Originalul neschimbat: " + dog);

        System.out.println("\n=== String — tot imutabil ===");
        String text = "hello";
        text.concat(" world");
        System.out.println("După concat: " + text); // tot "hello"
    }
}
