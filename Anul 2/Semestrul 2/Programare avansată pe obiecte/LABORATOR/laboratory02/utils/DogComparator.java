package com.pao.laboratory02.utils;

import com.pao.laboratory02.model.Dog;

import java.util.Comparator;

/**
 * Comparator extern pentru Dog — sortare după nume (alfabetic).
 *
 * Comparator = o clasă separată care definește REGULA de comparare.
 * Se folosește cu Arrays.sort(array, comparator).
 *
 * Diferența față de Comparable (pe care o vom vedea la Lab 02):
 * - Comparator = extern, poți avea mai multe reguli de sortare
 * - Comparable = intern, clasa însăși definește ordinea naturală
 */
public class DogComparator implements Comparator<Dog> {
    @Override
    public int compare(Dog d1, Dog d2) {
        // compareTo pe String → ordine alfabetică
        return d1.getName().compareTo(d2.getName());
    }
}

