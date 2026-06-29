const currencyByCode: Record<number, string> = {
  840: "USD",
  978: "EUR",
  980: "UAH",
};

export function getCurrencyCode(currencyCode: number): string {
  return currencyByCode[currencyCode] ?? String(currencyCode);
}

export function formatKopecks(
  value: number,
  currencyCode = 980,
): string {
  const currency = currencyByCode[currencyCode];

  if (currency) {
    return (value / 100).toLocaleString("uk-UA", {
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      style: "currency",
    });
  }

  return (value / 100).toLocaleString("uk-UA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
