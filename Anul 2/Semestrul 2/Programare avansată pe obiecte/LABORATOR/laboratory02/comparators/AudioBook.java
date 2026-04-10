package com.pao.laboratory02.comparators;

// cream in pachetul comparators o clasa audio book cu lungime (secunde) si titlu (string)
// si vom crea o metoda main in care sortam in 2 moduri cateva carti.
// 1. folosind metoda compareTo in functie de titlu
// 2. cu un comparator (alta clasa) in functie de lungimea
// 3. folosind lambda functions (subiect din laboratoarele urmatoare)

import java.util.Arrays;
import java.util.Comparator;

public class AudioBook implements Comparable<AudioBook> {
    private String title;
    private int lengthInSeconds;

    // constructor
    public AudioBook(String title, int lengthInSeconds) {
        this.title = title;
        this.lengthInSeconds = lengthInSeconds;
    }

    // metoda toString pentru a afisa cartile
    @Override
    public String toString() {
        return "AudioBook{" +
                "title='" + title + '\'' +
                ", lengthInSeconds=" + lengthInSeconds +
                '}';
    }

    @Override
    public int compareTo(AudioBook o) {
        return this.title.compareTo(o.title);
    }

    public static void main(String[] args) {
        // cream un array de carti si le afisam crescator
        AudioBook[] books = {
                new AudioBook("The Great Gatsby", 3600),
                new AudioBook("Moby", 5400)};
        Arrays.sort(books);
        System.out.println("Books sorted by title:");
        System.out.println(Arrays.toString(books));
        // sortam si cu un comparator care compara lungimea (in secunde)
        Arrays.sort(books, new AudioBookLengthComparator());
        System.out.println("Books sorted by length:");
        // putem folosi si lambda functions (va fi subiect in laboratoarele urmatoare)
        Arrays.sort(
                books,
                (o1, o2) -> o2.getLengthInSeconds() - o1.getLengthInSeconds()
        );
        System.out.println(Arrays.toString(books));

    }

    public int getLengthInSeconds() {
        return this.lengthInSeconds;
    }

}

class AudioBookLengthComparator implements Comparator<AudioBook> {
    @Override
    public int compare(AudioBook o1, AudioBook o2) {
        // regula:
        //  trebuie sa returneze
        //  negativ daca o1 < o1, 0 daca sunt egale, pozitiv daca o1 > o2
        return o1.getLengthInSeconds() - o2.getLengthInSeconds();
    }
}




