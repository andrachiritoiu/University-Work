package com.pao.laboratory03.exercise1;

/**
 * TODO: Implementează Rectangle extends Shape.
 * - Atribute: private double width, height
 * - Constructor: super("Rectangle"), this.width, this.height
 * - area() = width * height
 * - perimeter() = 2 * (width + height)
 */
public class Rectangle extends Shape {

    // TODO: private double width, height

    public Rectangle(double width, double height) {
        super("Rectangle");
        // TODO: this.width = width; this.height = height
    }

    @Override
    public double area() {
        return 0; // TODO: width * height
    }

    @Override
    public double perimeter() {
        return 0; // TODO: 2 * (width + height)
    }
}
