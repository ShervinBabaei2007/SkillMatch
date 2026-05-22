import React, { createContext } from "react";

export type Registration = {
  name: string;
  email: string;
  age: number;
  phone: string;
  ticketAmount: number;
  ticketPrice: number;
};

export type PaymentData = {
  transactionId: string;
  amount: number;
  currency: string;
};

export type State = {
  registration: Registration | null;
  paymentMethod: "Visa" | "PayPal" | null;
  paymentData: PaymentData | null;
};

export type Action =
  | { type: "SET_REGISTRATION"; payload: Registration }
  | { type: "SET_PAYMENT_METHOD"; payload: "Visa" | "PayPal" }
  | { type: "SET_PAYMENT_DATA"; payload: PaymentData };

export type CheckoutContextType = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

export const CheckoutContext = createContext<CheckoutContextType | null>(null);
