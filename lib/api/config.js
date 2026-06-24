export function getApiUrl() {
  const configured =
    process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000/api";

  if (typeof window !== "undefined") {
    return configured;
  }

  // Node SSR resolves localhost to IPv6 (::1) on Windows, which often fails locally.
  return configured.replace(/\/\/localhost(?=[:/])/g, "//127.0.0.1");
}
