export const SHIPPING_COUNTRIES = [
  { code: "PK", label: "Pakistan" },
  { code: "AE", label: "United Arab Emirates" },
  { code: "SA", label: "Saudi Arabia" },
  { code: "QA", label: "Qatar" },
  { code: "KW", label: "Kuwait" },
  { code: "OM", label: "Oman" },
  { code: "BH", label: "Bahrain" },
  { code: "GB", label: "United Kingdom" },
  { code: "US", label: "United States" },
  { code: "CA", label: "Canada" },
  { code: "AU", label: "Australia" },
  { code: "DE", label: "Germany" },
  { code: "FR", label: "France" },
  { code: "IT", label: "Italy" },
  { code: "ES", label: "Spain" },
  { code: "NL", label: "Netherlands" },
  { code: "TR", label: "Turkey" },
  { code: "MY", label: "Malaysia" },
  { code: "SG", label: "Singapore" },
  { code: "IN", label: "India" },
  { code: "BD", label: "Bangladesh" },
  { code: "CN", label: "China" },
  { code: "JP", label: "Japan" },
  { code: "NZ", label: "New Zealand" },
  { code: "ZA", label: "South Africa" },
];

export function getDefaultShippingCountryCode(countryCode) {
  const normalized = String(countryCode || "PK").toUpperCase();
  return SHIPPING_COUNTRIES.some((entry) => entry.code === normalized)
    ? normalized
    : "PK";
}

export function getShippingCountryLabel(code) {
  return (
    SHIPPING_COUNTRIES.find(
      (entry) => entry.code === String(code || "").toUpperCase(),
    )?.label ?? ""
  );
}
