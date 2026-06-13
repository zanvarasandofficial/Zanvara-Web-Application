"use client";

import { CartProvider } from "../../context/CartContext";
import { ToastProvider } from "../../context/ToastContext";
import ToastContainer from "../ui/ToastContainer";

export default function AppProviders({ children }) {
  return (
    <ToastProvider>
      <CartProvider>
        {children}
        <ToastContainer />
      </CartProvider>
    </ToastProvider>
  );
}
