package com.pao.laboratory02.arrays;

import com.pao.laboratory02.model.Dog;
import com.pao.laboratory02.utils.DogComparator;

import java.util.Arrays;

/**
 * Demo — Array-uri avansate
 *
 * Acest fișier arată:
 * 1. Declarare și parcurgere array-uri (3 moduri).
 * 2. Redimensionare dinamică — adăugare element într-un array.
 * 3. Sortare cu Arrays.sort() — pe primitive și pe obiecte cu Comparator.
 */
public class ArrayDemo {
    public static void main(String[] args) {

        // TODO LINK repo: bit.ly/4spF1HD

        // === 1. Declarare ===
        int[] arr = {5, 2, 8, 1, 9};

        // === 2. Parcurgere — 3 moduri ===

        // Modul 1: cu index
        System.out.println("--- Parcurgere cu index ---");
        for (int i = 0; i < arr.length; i++) {
            System.out.println("arr[" + i + "] = " + arr[i]);
        }

        // Modul 2: enhanced for
        System.out.println("--- Enhanced for ---");
        for (int val : arr) {
            System.out.println(val);
        }

        // Modul 3: Arrays.stream (preview — vom detalia la Stream API)
        System.out.println("--- Stream forEach ---");
        Arrays.stream(arr).forEach(System.out::println);

        // === 3. Redimensionare dinamică ===
        // Array-urile au dimensiune FIXĂ — trebuie să creăm unul nou mai mare
        int[] dynamicArr = new int[0]; // pornim de la array gol
        dynamicArr = addElement(dynamicArr, 10);
        dynamicArr = addElement(dynamicArr, 20);
        dynamicArr = addElement(dynamicArr, 30);
        System.out.println("\nArray dinamic: " + Arrays.toString(dynamicArr));

        // === 4. Sortare primitive ===
        System.out.println("\nÎnainte de sort: " + Arrays.toString(arr));
        Arrays.sort(arr);
        System.out.println("După sort:       " + Arrays.toString(arr));

        // === 5. Sortare obiecte cu Comparator ===
        Dog[] dogs = {
                new Dog("Rex", "maro"),
                new Dog("Azorel", "alb"),
                new Dog("Luna", "negru")
        };
        System.out.println("\nCâini înainte de sort: " + Arrays.toString(dogs));
        Arrays.sort(dogs, new DogComparator());
        System.out.println("Câini după sort:       " + Arrays.toString(dogs));
    }

    /**
     * Adaugă un element la sfârșitul unui array.
     * Creează un array nou cu length + 1 și copiază elementele.
     *
     * De ce? Array-urile au dimensiune fixă în Java.
     * Singura modalitate de a "adăuga" este să creăm unul nou mai mare.
     */
    private static int[] addElement(int[] arr, int value) {
        int[] tmp = new int[arr.length + 1];
        System.arraycopy(arr, 0, tmp, 0, arr.length);
        tmp[tmp.length - 1] = value;
        return tmp;
    }
}

