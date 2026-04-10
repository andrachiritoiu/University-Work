package com.pao.laboratory03.strings;

/**
 * Demo: String (imutabil) vs StringBuilder (mutabil, rapid) vs StringBuffer (mutabil, thread-safe).
 */
public class Main {
    public static void main(String[] args) {

        // String — IMUTABIL
        System.out.println("=== 1. String — IMUTABIL ===");
        String s = "hello";
        String result = s.concat(" world");
        System.out.println("Rezultat concat: " + result);
        System.out.println("Originalul:      " + s); // neschimbat

        // StringBuilder — MUTABIL, rapid
        System.out.println("\n=== 2. StringBuilder — MUTABIL ===");
        StringBuilder sb = new StringBuilder("hello");
        sb.append(" world");
        System.out.println("După append: " + sb);
        sb.insert(5, ",").append("!");
        System.out.println("Alte operații: " + sb);
        sb.reverse();
        System.out.println("Reverse: " + sb);

        // StringBuffer — MUTABIL, thread-safe
        System.out.println("\n=== 3. StringBuffer — thread-safe ===");
        StringBuffer sbf = new StringBuffer("hello");
        sbf.append(" world");
        System.out.println("Rezultat: " + sbf);

        // Benchmark
        System.out.println("\n=== 4. Performanță ===");
        int n = 10000;

        long t1 = System.currentTimeMillis();
        String slow = "";
        for (int i = 0; i < n; i++) slow = slow + "a";
        t1 = System.currentTimeMillis() - t1;

        long t2 = System.currentTimeMillis();
        StringBuilder fast = new StringBuilder();
        for (int i = 0; i < n; i++) fast.append("a");
        t2 = System.currentTimeMillis() - t2;

        System.out.println("String +:      " + t1 + " ms");
        System.out.println("StringBuilder: " + t2 + " ms");
    }
}
