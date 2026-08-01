import { NextResponse } from "next/server";
import {
  applyGeoCookies,
  currencyForCountry,
  getClientIpFromHeaders,
  lookupCountryByIp,
  normalizeCountryCode,
  resolveCountryFromEnv,
  resolveCountryFromHeaders,
} from "../../../lib/geo/country";

export async function GET(request) {
  let country = resolveCountryFromHeaders(request.headers);
  let source = country ? "cdn" : null;

  if (!country) {
    const ip = getClientIpFromHeaders(request.headers);
    country = await lookupCountryByIp(ip);
    if (country) {
      source = "ip-api";
    }
  }

  if (!country) {
    country = resolveCountryFromEnv();
    if (country) {
      source = "env";
    }
  }

  if (!country) {
    country = "PK";
    source = "default";
  }

  const currency = currencyForCountry(country);
  const response = NextResponse.json({
    country,
    currency,
    source,
  });

  applyGeoCookies(response, { country, currency, source });

  return response;
}
