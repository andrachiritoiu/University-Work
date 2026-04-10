package com.pao.laboratory03.exercise2;

import java.util.HashSet;
import java.util.Set;

/** Testează equals/hashCode din Student. NU modifica. */
public class Main {
    public static void main(String[] args) {

        Student s1 = new Student(1, "Ana");
        Student s2 = new Student(1, "Ana Popescu"); // același id
        Student s3 = s1;                             // aceeași referință
        Student s4 = new Student(2, "Maria");

        System.out.println("=== 1. Comparare cu == ===");
        System.out.println("s1 == s2 ? " + (s1 == s2));
        System.out.println("s1 == s3 ? " + (s1 == s3));

        System.out.println("\n=== 2. Comparare cu equals (după id) ===");
        System.out.println("s1.equals(s2) ? " + s1.equals(s2));
        System.out.println("s1.equals(s4) ? " + s1.equals(s4));

        System.out.println("\n=== 3. HashSet — deduplicare ===");
        Set<Student> set = new HashSet<>();
        set.add(s1);
        set.add(s2);
        System.out.println("Set: " + set);
        System.out.println("Dimensiune: " + set.size());

        System.out.println("\n=== 4. HashSet cu studenți diferiți ===");
        Set<Student> all = new HashSet<>();
        all.add(new Student(1, "Ana"));
        all.add(new Student(2, "Maria"));
        all.add(new Student(3, "Ion"));
        all.add(new Student(1, "Ana Duplicat"));
        System.out.println("Set: " + all);
        System.out.println("Dimensiune: " + all.size());

        System.out.println("\n=== VERIFICARE ===");
        System.out.println("Test 1 (equals):   " + (s1.equals(s2) && !s1.equals(s4) ? "PASSED ✓" : "FAILED ✗"));
        System.out.println("Test 2 (hashCode):  " + (s1.hashCode() == s2.hashCode() ? "PASSED ✓" : "FAILED ✗"));
        System.out.println("Test 3 (HashSet):   " + (set.size() == 1 ? "PASSED ✓" : "FAILED ✗"));
    }
}
