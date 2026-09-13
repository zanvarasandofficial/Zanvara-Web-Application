export function sanitizePhoneInput(value) {
  return String(value ?? "").replace(/[^\d+\s()-]/g, "");
}

export function handlePhoneInputChange(event) {
  const sanitized = sanitizePhoneInput(event.target.value);
  if (sanitized !== event.target.value) {
    event.target.value = sanitized;
  }
}

export function blockPhoneAlphaKeyDown(event) {
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return;
  }

  const allowedKeys = new Set([
    "Backspace",
    "Delete",
    "Tab",
    "Enter",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Home",
    "End",
  ]);

  if (allowedKeys.has(event.key)) {
    return;
  }

  if (/^[0-9+\s()-]$/.test(event.key)) {
    return;
  }

  event.preventDefault();
}
