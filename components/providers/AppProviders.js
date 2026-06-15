"use client";

import { CartProvider } from "../../context/CartContext";
import { CustomerAuthProvider } from "../../context/CustomerAuthContext";
import { ToastProvider } from "../../context/ToastContext";
import ToastContainer from "../ui/ToastContainer";

export default function AppProviders({ children }) {
  return (
    <ToastProvider>
      <CustomerAuthProvider>
        <CartProvider>
          {children}
          <ToastContainer />
        </CartProvider>
      </CustomerAuthProvider>
    </ToastProvider>
  );
}
