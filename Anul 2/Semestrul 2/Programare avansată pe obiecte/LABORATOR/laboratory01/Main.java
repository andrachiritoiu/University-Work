package com.pao.laboratory01;

import java.util.Scanner;

/**
 *  Rezolvați următoarele exerciții în fișierele
 *  1 MediaAritmetica.java și
 *  2 DiagonaleleMatricei.java din pachetul com.pao.loborator00.
 *
 * 1. Cititi de la tastatura un sir cu n elemente intregi.
 * Afisati sirul si media aritmetica a elementelor sirului.
 *
 * 2. Cititi de la tastatura o matrice de n ori n elemente REALE.
 * Afisati matricea in consola, apoi suma elementelor de pe diagonala principala
 *    si produsul elementelor de pe diagonala secundara.
 *
 */

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n;
        int[] array;
        n = scanner.nextInt(); // scannerul citeste primitive
        // declaram un array de lungimea n
        array = new int[n];
        for (int i = 0; i < n; i++) {
            array[i] = scanner.nextInt();
        }
        // afisam elementele array-ului
        for (int num : array) {
            System.out.println(num);
        }
        // afisam din nou elementele, folosind indici si campul length
        for (int i = 0; i < array.length; i++) {
            System.out.println(array[i]);
        }
    }
}
