"use client";

import { CartProvider } from "../../context/CartContext";
import { CurrencyProvider } from "../../context/CurrencyContext";
import { CustomerAuthProvider } from "../../context/CustomerAuthContext";
import { StorePolicyProvider } from "../../context/StorePolicyContext";
import { ToastProvider } from "../../context/ToastContext";
import ToastContainer from "../ui/ToastContainer";
import GeoCurrencyBootstrap from "../geo/GeoCurrencyBootstrap";

export default function AppProviders({
  children,
  initialCurrency,
  initialCountry,
}) {
  return (
    <ToastProvider>
      <StorePolicyProvider>
        <CurrencyProvider
          initialCurrency={initialCurrency}
          initialCountry={initialCountry}
        >
          <CustomerAuthProvider>
            <CartProvider>
              <GeoCurrencyBootstrap />
              {children}
              <ToastContainer />
            </CartProvider>
          </CustomerAuthProvider>
        </CurrencyProvider>
      </StorePolicyProvider>
    </ToastProvider>
  );
}
