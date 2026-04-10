package com.pao.laboratory07.exercise1.exceptions;

public class CannotCancelFinalOrderException extends Exception {
    public CannotCancelFinalOrderException() {
        super("Cannot cancel final order");
    }

    public CannotCancelFinalOrderException(String message) {
        super(message);
    }
}
