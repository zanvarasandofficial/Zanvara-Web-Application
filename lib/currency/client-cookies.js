import { COUNTRY_COOKIE, CURRENCY, CURRENCY_COOKIE } from "../money/constants";

export function readClientCurrency() {
  if (typeof document === "undefined") {
    return CURRENCY.PKR;
  }

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${CURRENCY_COOKIE}=([^;]*)`),
  );
  const value = match ? decodeURIComponent(match[1]) : "";
  return value === CURRENCY.USD ? CURRENCY.USD : CURRENCY.PKR;
}

export function readClientCountry() {
  if (typeof document === "undefined") {
    return "PK";
  }

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${COUNTRY_COOKIE}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]).toUpperCase() : "PK";
}
