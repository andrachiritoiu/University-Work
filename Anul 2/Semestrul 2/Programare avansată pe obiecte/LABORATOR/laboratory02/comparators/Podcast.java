package com.pao.laboratory02.comparators;

// EXERCITIU 1: cream in pachetul comparators o clasa Podcast cu durata (secunde, int) si titlu (string)
// dupa modelul AudioBook.java si Book.java, implementati:
// 1. toString — pentru afisare frumoasa
// 2. Comparable<Podcast> cu compareTo — sortare dupa titlu
// 3. un Comparator extern (PodcastLengthComparator) — sortare dupa durata
// 4. o metoda main in care cream cateva podcast-uri si le sortam in ambele moduri

//public class Podcast {
//
//    // TODO: adauga atributele: title (String), durationInSeconds (int)
//    // TODO: adauga constructor cu ambele atribute
//    // TODO: suprascrie toString()
//    // TODO: implementeaza Comparable<Podcast> si suprascrie compareTo (dupa titlu)
//    // TODO: adauga getter pentru durationInSeconds (necesar pentru comparator)
//
//    // Metoda main — codul final care trebuie sa functioneze dupa implementare.
//    // Ruleaza-l ca sa verifici ca totul e corect!
//    public static void main(String[] args) {
//        // cream cateva podcast-uri
//        Podcast[] podcasts = {
//                new Podcast("Tech Talk", 2400),
//                new Podcast("Arta Conversatiei", 3600),
//                new Podcast("Mindset", 1800)
//        };
//
//        // 1. sortare naturala (compareTo) — dupa titlu
//        java.util.Arrays.sort(podcasts);
//        System.out.println("Sortate dupa titlu:");
//        System.out.println(java.util.Arrays.toString(podcasts));
//
//        // 2. sortare cu Comparator extern — dupa durata
//        java.util.Arrays.sort(podcasts, new PodcastLengthComparator());
//        System.out.println("Sortate dupa durata (crescator):");
//        System.out.println(java.util.Arrays.toString(podcasts));
//
//        // 3. sortare cu lambda — dupa durata descrescator
//        java.util.Arrays.sort(podcasts,
//                (p1, p2) -> -1 // TODO trebuie -1 cand vrem sa afisam p2, p1 in ordinea finala, +1 daca p1, p2 e buna, 0 daca sunt egale.
//                );
//        System.out.println("Sortate dupa durata (descrescator, lambda):");
//        System.out.println(java.util.Arrays.toString(podcasts));
//    }
//}

// TODO: creeaza o clasa PodcastLengthComparator care implementeaza Comparator<Podcast>
//  si compara dupa durationInSeconds (vezi AudioBookLengthComparator ca model)
