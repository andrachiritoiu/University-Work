// Reader.java
package com.pao.laboratory12.model;

public class Reader {
    private long id;
    private String name;
    private String email;

    public Reader() {}
    public Reader(String name, String email) { this.name = name; this.email = email; }
    public long getId()            { return id; }
    public void setId(long id)     { this.id = id; }
    public String getName()        { return name; }
    public void setName(String n)  { this.name = n; }
    public String getEmail()       { return email; }
    public void setEmail(String e) { this.email = e; }
    @Override public String toString() {
        return "Reader{id=" + id + ", name='" + name + "', email='" + email + "'}";
    }
}