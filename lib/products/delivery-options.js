export function normalizeOnlinePaymentPercent(value) {
  const percent = Number(value ?? 0);
  if (!Number.isFinite(percent) || percent <= 0) {
    return 0;
  }

  return Math.min(100, Math.max(1, Math.round(percent)));
}

export function getOnlinePaymentPercentFromAdminFields(mode, percentValue) {
  if (mode === "full") {
    return 100;
  }
  if (mode === "partial") {
    const percent = normalizeOnlinePaymentPercent(percentValue);
    if (percent <= 0) {
      throw new Error("Enter online payment percentage (1–99) for partial advance.");
    }
    return percent;
  }
  return 0;
}

function slugifyOptionId(value) {
  return (
    String(value ?? "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "delivery"
  );
}

export function resolveProductDeliveryOptions(product) {
  const raw = product?.deliveryOptions;
  if (Array.isArray(raw) && raw.length > 0) {
    return raw
      .map((entry, index) => normalizeDeliveryOption(entry, index))
      .filter(Boolean);
  }

  const charge =
    product?.deliveryType === "CHARGED" && product?.deliveryCharge > 0
      ? product.deliveryCharge
      : 0;

  return [
    {
      id: "standard",
      label: "Standard Delivery",
      charge,
      chargeUsd: null,
      minDays: 3,
      maxDays: 5,
      isDefault: true,
      enabled: true,
      onlinePaymentPercent: 0,
    },
  ];
}

function normalizeDeliveryOption(entry, index) {
  if (!entry?.label?.trim()) {
    return null;
  }

  const minDays = Number(entry.minDays ?? 0);
  const maxDays = Number(entry.maxDays ?? minDays);

  return {
    id: slugifyOptionId(entry.id ?? entry.label),
    label: entry.label.trim(),
    charge: Math.max(0, Number(entry.charge ?? 0)),
    chargeUsd:
      entry.chargeUsd == null || entry.chargeUsd === ""
        ? null
        : Math.max(0, Number(entry.chargeUsd)),
    minDays: Number.isFinite(minDays) ? minDays : 0,
    maxDays: Number.isFinite(maxDays) ? maxDays : minDays,
    isDefault: Boolean(entry.isDefault),
    enabled: entry.enabled !== false,
    onlinePaymentPercent: normalizeOnlinePaymentPercent(entry.onlinePaymentPercent),
  };
}

export function getEnabledDeliveryOptions(product) {
  return resolveProductDeliveryOptions(product).filter((option) => option.enabled);
}

export function getDefaultDeliveryOption(product) {
  const enabled = getEnabledDeliveryOptions(product);
  return (
    enabled.find((option) => option.isDefault) ??
    enabled[0] ??
    resolveProductDeliveryOptions(product)[0]
  );
}

export function getDeliveryOptionById(product, optionId) {
  if (!optionId) {
    return null;
  }

  return (
    getEnabledDeliveryOptions(product).find((option) => option.id === optionId) ??
    null
  );
}

export function resolveSelectedDeliveryOption(product, optionId) {
  return getDeliveryOptionById(product, optionId) ?? getDefaultDeliveryOption(product);
}

export function formatDeliveryEta(minDays, maxDays) {
  if (minDays <= 0 && maxDays <= 0) {
    return "Delivery time confirmed after order";
  }

  if (minDays === maxDays) {
    return `${minDays} business day${minDays === 1 ? "" : "s"}`;
  }

  return `${minDays}–${maxDays} business days`;
}

export function formatDeliveryOptionEta(option) {
  if (!option) {
    return "";
  }

  return formatDeliveryEta(option.minDays, option.maxDays);
}

export function getDeliveryOptionCharge(option, { currency, pkrToUsdRate } = {}) {
  if (!option) {
    return 0;
  }

  if (currency === "USD" && option.chargeUsd != null && option.chargeUsd >= 0) {
    return option.chargeUsd;
  }

  if (currency === "USD" && pkrToUsdRate > 0) {
    return option.charge / pkrToUsdRate;
  }

  return option.charge;
}

export const DEFAULT_ADMIN_DELIVERY_OPTIONS = [
  {
    id: "standard",
    label: "Standard Delivery",
    charge: 0,
    chargeUsd: "",
    minDays: 3,
    maxDays: 5,
    isDefault: true,
    enabled: true,
    onlinePaymentMode: "none",
    onlinePaymentPercent: "",
  },
  {
    id: "express",
    label: "Express Delivery",
    charge: 500,
    chargeUsd: "",
    minDays: 1,
    maxDays: 2,
    isDefault: false,
    enabled: false,
    onlinePaymentMode: "none",
    onlinePaymentPercent: "",
  },
];

export function mapAdminDeliveryOptionsFromProduct(product) {
  const options = resolveProductDeliveryOptions(product);
  if (!options.length) {
    return DEFAULT_ADMIN_DELIVERY_OPTIONS.map((option) => ({ ...option }));
  }

  return options.map((option) => {
    const percent = normalizeOnlinePaymentPercent(option.onlinePaymentPercent);
    const onlinePaymentMode =
      percent >= 100 ? "full" : percent > 0 ? "partial" : "none";

    return {
      id: option.id,
      label: option.label,
      charge: String(option.charge ?? 0),
      chargeUsd: option.chargeUsd != null ? String(option.chargeUsd) : "",
      minDays: String(option.minDays ?? 0),
      maxDays: String(option.maxDays ?? 0),
      isDefault: Boolean(option.isDefault),
      enabled: Boolean(option.enabled),
      onlinePaymentMode,
      onlinePaymentPercent: percent > 0 && percent < 100 ? String(percent) : "",
    };
  });
}

export function buildDeliveryOptionsPayload(formOptions = []) {
  const normalized = formOptions
    .map((entry, index) => {
      const label = String(entry.label ?? "").trim();
      if (!label) {
        return null;
      }

      const minDays = Number(entry.minDays ?? 0);
      const maxDays = Number(entry.maxDays ?? minDays);
      const chargeUsdRaw = String(entry.chargeUsd ?? "").trim();

      const onlinePaymentPercent = getOnlinePaymentPercentFromAdminFields(
        entry.onlinePaymentMode ?? "none",
        entry.onlinePaymentPercent,
      );

      return {
        id: slugifyOptionId(entry.id || label),
        label,
        charge: Math.max(0, Number(entry.charge ?? 0)),
        chargeUsd: chargeUsdRaw ? Math.max(0, Number(chargeUsdRaw)) : null,
        minDays: Number.isFinite(minDays) ? minDays : 0,
        maxDays: Number.isFinite(maxDays) ? maxDays : minDays,
        isDefault: Boolean(entry.isDefault),
        enabled: Boolean(entry.enabled),
        onlinePaymentPercent,
      };
    })
    .filter(Boolean);

  if (!normalized.length) {
    throw new Error("Add at least one delivery option.");
  }

  const enabled = normalized.filter((option) => option.enabled);
  if (!enabled.length) {
    throw new Error("Enable at least one delivery option.");
  }

  const defaultOption = enabled.find((option) => option.isDefault) ?? enabled[0];
  return normalized.map((option) => ({
    ...option,
    isDefault: option.id === defaultOption.id,
  }));
}
