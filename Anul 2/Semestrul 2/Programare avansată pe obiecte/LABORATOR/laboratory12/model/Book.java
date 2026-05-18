// Book.java
package com.pao.laboratory12.model;

public class Book {
    private long id;
    private String title;
    private long authorId;
    private boolean available;

    public Book() {}
    public Book(String title, long authorId) {
        this.title = title; this.authorId = authorId; this.available = true;
    }
    // getteri / setteri / toString — similar cu Author
    public long getId()              { return id; }
    public void setId(long id)       { this.id = id; }
    public String getTitle()         { return title; }
    public void setTitle(String t)   { this.title = t; }
    public long getAuthorId()        { return authorId; }
    public void setAuthorId(long a)  { this.authorId = a; }
    public boolean isAvailable()     { return available; }
    public void setAvailable(boolean v) { this.available = v; }
    @Override public String toString() {
        return "Book{id=" + id + ", title='" + title + "', authorId=" + authorId
                + ", available=" + available + "}";
    }
}