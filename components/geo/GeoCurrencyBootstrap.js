"use client";

import { useEffect, useRef } from "react";
import { CURRENCY } from "../../lib/money/constants";

const SESSION_KEY = "zanvara_geo_sync_v1";

function readGeoHint() {
  if (typeof document === "undefined") {
    return false;
  }
  return document.cookie.includes("zanvara_geo_hint=1");
}

export default function GeoCurrencyBootstrap() {
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) {
      return;
    }
    ranRef.current = true;

    const synced = sessionStorage.getItem(SESSION_KEY);
    const needsLookup = readGeoHint();

    if (synced === "1" && !needsLookup) {
      return;
    }

    let cancelled = false;

    async function syncGeo() {
      try {
        const response = await fetch("/api/geo", {
          credentials: "same-origin",
          cache: "no-store",
        });

        if (!response.ok || cancelled) {
          return;
        }

        const data = await response.json();
        const currency =
          data.currency === CURRENCY.USD ? CURRENCY.USD : CURRENCY.PKR;

        sessionStorage.setItem(SESSION_KEY, "1");

        window.dispatchEvent(
          new CustomEvent("zanvara-currency-changed", {
            detail: { currency },
          }),
        );
        window.dispatchEvent(
          new CustomEvent("zanvara-country-changed", {
            detail: { country: data.country },
          }),
        );
      } catch {
        // Proxy/env cookies remain in effect.
      }
    }

    syncGeo();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
