"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { readClientCountry, readClientCurrency } from "../lib/currency/client-cookies";
import { CURRENCY } from "../lib/money/constants";
import { syncMoneyFormatterState } from "../lib/money/format";
import { useStorePolicy } from "./StorePolicyContext";

const CurrencyContext = createContext(null);

export function CurrencyProvider({
  children,
  initialCurrency = CURRENCY.PKR,
  initialCountry = "PK",
}) {
  const { pkrToUsdRate, isReady: isPolicyReady } = useStorePolicy();
  const [currency, setCurrencyState] = useState(
    initialCurrency === CURRENCY.USD ? CURRENCY.USD : CURRENCY.PKR,
  );
  const [countryCode, setCountryCode] = useState(initialCountry);

  useEffect(() => {
    setCurrencyState(readClientCurrency());
    setCountryCode(readClientCountry());
  }, []);

  useEffect(() => {
    function handleCurrencyChanged(event) {
      const next = event.detail?.currency;
      if (next === CURRENCY.USD || next === CURRENCY.PKR) {
        setCurrencyState(next);
      }
    }

    function handleCountryChanged(event) {
      const next = event.detail?.country;
      if (next) {
        setCountryCode(String(next).toUpperCase());
      }
    }

    window.addEventListener("zanvara-currency-changed", handleCurrencyChanged);
    window.addEventListener("zanvara-country-changed", handleCountryChanged);
    return () => {
      window.removeEventListener("zanvara-currency-changed", handleCurrencyChanged);
      window.removeEventListener("zanvara-country-changed", handleCountryChanged);
    };
  }, []);

  useEffect(() => {
    if (!isPolicyReady) {
      return;
    }
    syncMoneyFormatterState({ currency, pkrToUsdRate });
  }, [currency, pkrToUsdRate, isPolicyReady]);

  const value = useMemo(
    () => ({
      currency,
      countryCode,
      pkrToUsdRate,
      isInternationalDisplay: currency === CURRENCY.USD,
      isPakistanVisitor: String(countryCode || "PK").toUpperCase() === "PK",
    }),
    [currency, countryCode, pkrToUsdRate],
  );

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return context;
}
