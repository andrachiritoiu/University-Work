package com.pao.laboratory07.exercise1;

import com.pao.laboratory07.exercise1.exceptions.CannotCancelFinalOrderException;
import com.pao.laboratory07.exercise1.exceptions.CannotRevertInitialOrderStateException;
import com.pao.laboratory07.exercise1.exceptions.OrderIsAlreadyFinalException;

import java.util.ArrayList;
import java.util.List;

public class Order {
    private OrderState currentState;
    //tine satrile vechi
    private List<OrderState> history = new ArrayList<>();

    public Order(OrderState initialState){
        this.currentState=initialState;
    }

    public void nextState() throws OrderIsAlreadyFinalException{
        switch(currentState){
            case DELIVERED, CANCELED -> throw new OrderIsAlreadyFinalException();
            case PLACED, PROCESSED, SHIPPED ->  {
                history.add(currentState);

                switch (currentState){
                    case PLACED -> currentState=OrderState.PROCESSED;
                    case PROCESSED -> currentState=OrderState.SHIPPED;
                    case SHIPPED -> currentState=OrderState.DELIVERED;
                }

                System.out.println("Order state updated to: " + currentState);
            }
        }
    }

    public void cancel() throws CannotCancelFinalOrderException {
        if(currentState==OrderState.DELIVERED || currentState==OrderState.CANCELED){
            throw new CannotCancelFinalOrderException();
        }
        else{
            history.add(currentState);
            currentState=OrderState.CANCELED;

            System.out.println("Order has been canceled.");
        }
    };

    public void undoState() throws CannotRevertInitialOrderStateException {
        if(history.isEmpty()){
            throw new CannotRevertInitialOrderStateException();
        }
        else{
            int lastIndex=history.size()-1;
            OrderState element=history.get(lastIndex);
            history.remove(lastIndex);
            currentState=element;

            System.out.println("Order state reverted to: " + currentState);

        }
    };
}
