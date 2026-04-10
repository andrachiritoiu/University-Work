package com.pao.laboratory03.equalshashcode;

import java.util.Objects;

/**
 * Demo: equals/hashCode override.
 * Contract: a.equals(b) == true → a.hashCode() == b.hashCode() (obligatoriu).
 * Necesar pentru HashSet/HashMap.
 */
public class Book {
    private String name;
    private int pages;

    public Book(String name, int pages) {
        this.name = name;
        this.pages = pages;
    }

    public String getName() { return name; }
    public int getPages() { return pages; }

    @Override
    public String toString() {
        return "Book{name='" + name + "', pages=" + pages + "}";
    }

    /** Două cărți sunt egale dacă au același name. */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Book book = (Book) o;
        return Objects.equals(name, book.name);
    }

    /** Folosim aceleași câmpuri ca în equals. */
    @Override
    public int hashCode() {
        return Objects.hash(name);
    }
}
