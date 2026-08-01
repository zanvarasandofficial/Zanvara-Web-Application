export function parseAvailableAtMs(product) {
  if (!product?.availableAt) {
    return null;
  }

  const ms = Date.parse(product.availableAt);
  return Number.isFinite(ms) ? ms : null;
}

/** Launch not reached yet — block add-to-cart and checkout. */
export function isComingSoonPurchaseBlocked(product, nowMs = Date.now()) {
  if (!product?.isComingSoon) {
    return false;
  }

  const launchMs = parseAvailableAtMs(product);
  if (!launchMs) {
    return true;
  }

  return launchMs > nowMs;
}

/** Live countdown UI (requires a valid future launch time). */
export function isComingSoonCountdownActive(product, nowMs = Date.now()) {
  if (!product?.isComingSoon) {
    return false;
  }

  const launchMs = parseAvailableAtMs(product);
  if (!launchMs) {
    return false;
  }

  return launchMs > nowMs;
}

export function formatCountdownParts(totalMs) {
  const totalSeconds = Math.max(0, Math.floor(totalMs / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

export function formatCountdownLabel(parts) {
  const segments = [];

  if (parts.days > 0) {
    segments.push(`${parts.days}d`);
  }

  segments.push(
    `${String(parts.hours).padStart(2, "0")}:${String(parts.minutes).padStart(2, "0")}:${String(parts.seconds).padStart(2, "0")}`,
  );

  return segments.join(" ");
}

export function formatLaunchDateTime(product, locale = "en-PK") {
  const ms = parseAvailableAtMs(product);
  if (!ms) {
    return null;
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(ms));
}
