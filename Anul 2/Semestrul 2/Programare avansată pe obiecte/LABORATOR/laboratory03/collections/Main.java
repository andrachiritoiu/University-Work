package com.pao.laboratory03.collections;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

/**
 * Demo: ArrayList (ordonat, duplicate), HashSet (fără duplicate), TreeSet (sortat).
 */
public class Main {
    public static void main(String[] args) {

        // ArrayList — ordonat, permite duplicate, acces prin index
        System.out.println("=== 1. ArrayList ===");
        List<String> list = new ArrayList<>();
        list.add("Ana");
        list.add("Maria");
        list.add("Ion");
        list.add("Ana");
        System.out.println("Lista: " + list);
        System.out.println("Dimensiune: " + list.size());
        System.out.println("Index 1: " + list.get(1));
        list.remove(0);
        System.out.println("După remove(0): " + list);

        System.out.println("\nParcurgere cu for clasic:");
        for (int i = 0; i < list.size(); i++)
            System.out.println("  [" + i + "] " + list.get(i));

        System.out.println("\nParcurgere cu enhanced for:");
        for (String name : list)
            System.out.println("  " + name);

        System.out.println("\nParcurgere cu forEach + lambda:");
        list.forEach(name -> System.out.println("  " + name));

        // HashSet — fără duplicate, ordine imprevizibilă
        System.out.println("\n=== 2. HashSet ===");
        Set<String> set = new HashSet<>();
        set.add("Ana");
        set.add("Maria");
        set.add("Ion");
        set.add("Ana"); // ignorat — duplicat
        System.out.println("Set: " + set);
        System.out.println("Dimensiune: " + set.size());
        System.out.println("Conține \"Ion\"? " + set.contains("Ion"));

        // TreeSet — fără duplicate, sortat natural
        System.out.println("\n=== 3. TreeSet ===");
        TreeSet<String> sortedSet = new TreeSet<>();
        sortedSet.add("Maria");
        sortedSet.add("Ana");
        sortedSet.add("Zoe");
        sortedSet.add("Ion");
        System.out.println("TreeSet: " + sortedSet);
        System.out.println("Primul: " + sortedSet.first());
        System.out.println("Ultimul: " + sortedSet.last());
    }
}
