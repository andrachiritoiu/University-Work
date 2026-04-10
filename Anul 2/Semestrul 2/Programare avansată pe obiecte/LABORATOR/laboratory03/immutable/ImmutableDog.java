package com.pao.laboratory03.immutable;

/**
 * Clasă imutabilă: final class, final fields, fără setteri.
 * Odată creat, obiectul nu se mai modifică. Exemplu clasic: String.
 */
public final class ImmutableDog {
    private final String name;
    private final int age;

    public ImmutableDog(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() { return name; }
    public int getAge() { return age; }

    @Override
    public String toString() {
        return "ImmutableDog{name='" + name + "', age=" + age + "}";
    }
}
