package com.pao.laboratory07.exercise1.exceptions;

public class CannotRevertInitialOrderStateException extends Exception {
    public CannotRevertInitialOrderStateException() {
        super("Cannot undo the initial order state");
    }

    public CannotRevertInitialOrderStateException(String message) {
        super(message);
    }
}
