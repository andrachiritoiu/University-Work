package com.pao.laboratory03.equalshashcode;

import java.util.HashSet;
import java.util.Set;

/** Demo: == vs .equals(), comportament HashSet cu/fără override. */
public class Main {
    public static void main(String[] args) {

        Book book1 = new Book("Java", 500);
        Book book2 = new Book("Java", 300);
        Book book3 = book1;
        Book book4 = new Book("Python", 400);

        System.out.println("=== 1. Comparare cu == (referințe) ===");
        System.out.println("book1 == book2 ? " + (book1 == book2));
        System.out.println("book1 == book3 ? " + (book1 == book3));

        System.out.println("\n=== 2. Comparare cu .equals() (conținut) ===");
        System.out.println("book1.equals(book2) ? " + book1.equals(book2));
        System.out.println("book1.equals(book4) ? " + book1.equals(book4));

        System.out.println("\n=== 3. HashSet — eliminare duplicate ===");
        Set<Book> set = new HashSet<>();
        set.add(book1);
        set.add(book2);
        System.out.println("Set conține: " + set);
        System.out.println("Dimensiune set: " + set.size());

        System.out.println("\n=== 4. Ce s-ar întâmpla FĂRĂ equals/hashCode? ===");
        System.out.println("Fără override, set-ul ar avea 2 elemente (obiecte diferite în memorie).");
    }
}
