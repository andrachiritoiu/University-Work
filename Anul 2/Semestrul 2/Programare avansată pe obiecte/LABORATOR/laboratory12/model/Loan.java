// Loan.java
package com.pao.laboratory12.model;

public class Loan {
    private long id;
    private long bookId;
    private long readerId;
    private String loanDate;    // "YYYY-MM-DD"
    private String returnDate;  // null = activ

    public Loan() {}
    public Loan(long bookId, long readerId, String loanDate) {
        this.bookId = bookId; this.readerId = readerId; this.loanDate = loanDate;
    }
    public long getId()                   { return id; }
    public void setId(long id)            { this.id = id; }
    public long getBookId()               { return bookId; }
    public void setBookId(long b)         { this.bookId = b; }
    public long getReaderId()             { return readerId; }
    public void setReaderId(long r)       { this.readerId = r; }
    public String getLoanDate()           { return loanDate; }
    public void setLoanDate(String d)     { this.loanDate = d; }
    public String getReturnDate()         { return returnDate; }
    public void setReturnDate(String d)   { this.returnDate = d; }
    @Override public String toString() {
        return "Loan{id=" + id + ", bookId=" + bookId + ", readerId=" + readerId
                + ", loanDate='" + loanDate + "', returnDate='" + returnDate + "'}";
    }
}