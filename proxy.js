import { NextResponse } from "next/server";
import {
  GEO_HINT_COOKIE,
  applyGeoCookies,
  currencyForCountry,
  normalizeCountryCode,
  resolveCountryFromEnv,
  resolveCountryFromHeaders,
} from "./lib/geo/country";

export function proxy(request) {
  const response = NextResponse.next();
  const headerCountry = resolveCountryFromHeaders(request.headers);
  const envCountry = resolveCountryFromEnv();

  const previousCountry = normalizeCountryCode(
    request.cookies.get("zanvara_country")?.value,
  );

  if (headerCountry) {
    const currency = currencyForCountry(headerCountry);
    applyGeoCookies(response, {
      country: headerCountry,
      currency,
      source: "cdn",
    });
    return response;
  }

  if (envCountry) {
    const currency = currencyForCountry(envCountry);
    applyGeoCookies(response, {
      country: envCountry,
      currency,
      source: "env",
    });
    return response;
  }

  if (previousCountry) {
    const currency = currencyForCountry(previousCountry);
    applyGeoCookies(response, {
      country: previousCountry,
      currency,
      source: request.cookies.get("zanvara_geo_source")?.value ?? "cookie",
    });
    response.cookies.set(GEO_HINT_COOKIE, "1", {
      path: "/",
      maxAge: 60 * 60,
      sameSite: "lax",
    });
    return response;
  }

  response.cookies.set(GEO_HINT_COOKIE, "1", {
    path: "/",
    maxAge: 60 * 60,
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
