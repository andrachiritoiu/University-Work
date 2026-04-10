package com.pao.laboratory07.exercise1.exceptions;

public class OrderIsAlreadyFinalException extends Exception {
    public OrderIsAlreadyFinalException() {
        super("Order is already in a final state");
    }

    public OrderIsAlreadyFinalException(String message) {
        super(message);
    }
}
