package com.pao.laboratory03.exercise1;

/**
 * TODO: Implementează Circle extends Shape.
 * - Atribut: private double radius
 * - Constructor: super("Circle"), this.radius = radius
 * - area() = Math.PI * radius * radius
 * - perimeter() = 2 * Math.PI * radius
 */
public class Circle extends Shape {

    // TODO: private double radius

    public Circle(double radius) {
        super("Circle");
        // TODO: this.radius = radius
    }

    @Override
    public double area() {
        return 0; // TODO: Math.PI * radius * radius
    }

    @Override
    public double perimeter() {
        return 0; // TODO: 2 * Math.PI * radius
    }
}
