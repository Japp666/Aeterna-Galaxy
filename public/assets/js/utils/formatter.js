export function fmtEuro(value) {
  return new Intl.NumberFormat("ro-RO", { style: "currency", currency: "EUR" }).format(value);
}

export function fmtDate(timestamp) {
  return new Date(timestamp).toLocaleString("ro-RO");
}
