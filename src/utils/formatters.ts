export function formatINR(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) return "₹0";

  // In Indian notation
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatINRCrores(amount: number): string {
  if (!amount) return "₹0 Cr";
  const crores = amount / 10000000;
  if (crores >= 1) {
    return `₹${crores.toFixed(2)} Cr`;
  }
  const lakhs = amount / 100000;
  return `₹${lakhs.toFixed(2)} L`;
}

export function formatDate(dateString?: string): string {
  if (!dateString) return "-";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}
