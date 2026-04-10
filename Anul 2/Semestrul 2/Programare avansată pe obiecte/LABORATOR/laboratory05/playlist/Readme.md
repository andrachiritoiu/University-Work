# Java Records — Quick Reference

> 📎 **Companion to [Exercise 1 — Playlist](../Readme.md#exercise-1--playlist)**
> Read this before writing `Song.java`. The exercise uses Levels 1–4 directly.

Introduced in **Java 16**, a `record` is a concise, immutable data carrier. The compiler generates all the boilerplate automatically.

---

## Level 1 — Syntax & Accessors

```java
public record Song(String title, String artist, int durationSeconds) {}
```

The compiler auto-generates from the **record header**:

| Generated member | What it does |
|---|---|
| `Song(String, String, int)` | canonical constructor |
| `title()`, `artist()`, `durationSeconds()` | accessors — **no `get` prefix** |
| `toString()` | `Song[title=..., artist=..., durationSeconds=...]` |
| `equals(Object)` | field-by-field comparison |
| `hashCode()` | consistent with `equals` |

```java
Song s = new Song("Imagine", "John Lennon", 187);
s.title();       // ✅  "Imagine"
s.getTitle();    // ❌  does not exist
```

All fields are implicitly `private final` — **no setters, no mutation**.

---

## Level 2 — Compact Constructors (Validation)

Add validation or normalization without repeating assignments — the compiler still assigns `this.x = x` for you.

```java
public record User(String name, int age) {
    public User {   // no parameter list — compact constructor
        if (age < 0) throw new IllegalArgumentException("Age cannot be negative");
        name = name.trim();   // mutate the parameter before auto-assignment
    }
}
```

---

## Level 3 — Implementing Interfaces

Records can implement interfaces (including `Comparable`), add static fields, and add instance methods. **They cannot extend a class or add new instance fields.**

```java
public record Song(String title, String artist, int durationSeconds)
        implements Comparable<Song> {

    // ✅ instance method
    public String formattedDuration() {
        return durationSeconds / 60 + ":" + String.format("%02d", durationSeconds % 60);
    }

    // ✅ Comparable — natural order: alphabetical by title
    @Override
    public int compareTo(Song other) {
        return this.title.compareTo(other.title);
    }

    // ❌ FORBIDDEN — cannot add new instance fields
    // private String album;
}
```

---

## Level 4 — Hard Limits

| Rule | Reason |
|---|---|
| Cannot `extend` another class | Records implicitly extend `java.lang.Record` |
| Cannot be subclassed | Records are implicitly `final` |
| Cannot add new instance fields | All state lives in the record header |
| Accessors cannot be `private`/`protected` | Records guarantee transparent access |

---

## When to Use a Record vs a Class

| Prefer `record` | Prefer a regular class |
|---|---|
| Immutable data bag (DTO, log entry) | Mutable state / setters needed |
| No boilerplate wanted | Custom `equals`/`toString` logic needed |
| Value semantics (`equals` by fields) | Identity semantics (`equals` by reference) |
