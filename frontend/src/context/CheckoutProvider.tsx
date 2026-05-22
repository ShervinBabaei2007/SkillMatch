import React, { useReducer } from "react";
import { type Action, CheckoutContext, type State } from "./CheckoutContext";

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_REGISTRATION":
      return { ...state, registration: action.payload };
    case "SET_PAYMENT_METHOD":
      return { ...state, paymentMethod: action.payload };
    case "SET_PAYMENT_DATA":
      return { ...state, paymentData: action.payload };
    default:
      return state;
  }
};

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    registration: null,
    paymentMethod: null,
    paymentData: null,
  });

  return <CheckoutContext.Provider value={{ state, dispatch }}>{children}</CheckoutContext.Provider>;
}
