export function getApiUrl() {
  let configured =
    process.env.NEXT_PUBLIC_API_URL ?? "https://zanvara-backend.vercel.app/api";

  configured = configured.trim().replace(/\/$/, "");

  if (!configured.endsWith("/api")) {
    configured = `${configured}/api`;
  }

  if (typeof window !== "undefined") {
    return configured;
  }

  // Node SSR resolves localhost to IPv6 (::1) on Windows, which often fails locally.
  return configured.replace(/\/\/localhost(?=[:/])/g, "//127.0.0.1");
}
