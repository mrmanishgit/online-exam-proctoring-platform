export function formatNumber(value, locale = "en-IN") {
  const number = Number(value);
  return Number.isFinite(number) ? new Intl.NumberFormat(locale).format(number) : "—";
}

export function formatPercent(value, digits = 1) {
  const number = Number(value);
  return Number.isFinite(number) ? `${number.toFixed(digits)}%` : "—";
}

export function formatCurrency(value, currency = "INR", locale = "en-IN") {
  const number = Number(value);
  if (!Number.isFinite(number)) return "—";
  return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 2 }).format(number);
}

export function titleCase(value = "") {
  return String(value)
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function initials(value = "") {
  return String(value).trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join("");
}
