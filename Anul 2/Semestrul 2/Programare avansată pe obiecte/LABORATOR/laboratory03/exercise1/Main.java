package com.pao.laboratory03.exercise1;

/** Testează Circle și Rectangle. NU modifica. Rulează după ce completezi TODO-urile. */
public class Main {
    public static void main(String[] args) {

        Shape[] shapes = {
                new Circle(5.0),
                new Rectangle(4.0, 6.0),
                new Circle(2.0),
                new Rectangle(5.0, 5.0)
        };

        System.out.println("=== Forme geometrice ===");
        for (Shape s : shapes)
            System.out.println(s);

        System.out.println("\n=== Polimorfism — aceeași metodă, comportament diferit ===");
        for (Shape s : shapes)
            System.out.printf("%-10s → aria = %.2f%n", s.getName(), s.area());

        System.out.println("\n=== Suma ariilor tuturor formelor ===");
        double totalArea = 0;
        for (Shape s : shapes) totalArea += s.area();
        System.out.printf("Total arii: %.2f%n", totalArea);
    }
}
