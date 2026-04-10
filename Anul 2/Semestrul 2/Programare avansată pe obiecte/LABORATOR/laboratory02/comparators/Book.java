package com.pao.laboratory02.comparators;

// cream in pachetul comparators o clasa Book cu numar de pagini (int) si titlu (string)
// si vom crea o metoda main in care sortam in 2 moduri cateva carti.
// 1. folosind metoda compareTo in functie de titlu
// 2. cu un comparator (alta clasa) in functie de numarul de pagini
// 3. folosind lambda functions (subiect din laboratoarele urmatoare)

import java.util.Arrays;
import java.util.Comparator;

public class Book implements Comparable<Book> {
    private String title;
    private int noPages;

    public Book(String title, int noPages) {
        this.title = title;
        this.noPages = noPages;
    }

    @Override
    public int compareTo(Book o) {
        // sortam lexicografic.
        return this.title.compareTo(o.title);
    }

    @Override
    public String toString() {
        return "Book{" +
                "title='" + title + '\'' +
                ", noPages=" + noPages +
                '}';
    }


    public int getNoPages() {
        return noPages;
    }
    public static void main(String[] args) {
        Book[] books = {
                new Book("Morometii", 180),
                new Book("Baltagul", 120)};
        Arrays.sort(books);
        System.out.println("Books sorted by title:");
        System.out.println(Arrays.toString(books));
        Arrays.sort(
                books,
                (b1, b2) -> b2.noPages - b1.noPages);
        System.out.println(Arrays.toString(books));
        // using Comparator class
        Arrays.sort(books, new BookLengthComparator());
        System.out.println(Arrays.toString(books));
    }
}

class BookLengthComparator implements Comparator<Book> {
    @Override
    public int compare(Book o1, Book o2) {
        return o1.getNoPages() - o2.getNoPages();
    }
}


