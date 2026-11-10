export const MONTH_NAMES = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun',
  'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr',
];

export const CURRENCY_SYMBOLS = { AZN: '₼', TRY: '₺', EUR: '€', USD: '$' };

const formatAmount = (value) => Number(value).toLocaleString('de-DE', { maximumFractionDigits: 0 });

// Approximate value of 1 unit of each currency in Azerbaijani manat. Update here when rates change.
export const AZN_RATES = { AZN: 1, USD: 1.7, EUR: 1.97, TRY: 0.04 };

export const toAzn = (value, currency) => Number(value) * (AZN_RATES[currency] ?? 1);

// Public pages: every price is shown in manat.
// { minPrice: 2380, maxPrice: 11300, currency: 'TRY' } -> "₼95 – ₼452"
// Pass { original: true } to show the amounts in the currency they were entered in (admin).
export const formatPriceRange = ({ minPrice, maxPrice, currency }, { original = false } = {}) => {
  if (original) {
    const symbol = CURRENCY_SYMBOLS[currency] || currency;
    return `${symbol}${formatAmount(minPrice)} – ${symbol}${formatAmount(maxPrice)}`;
  }
  return `₼${formatAmount(toAzn(minPrice, currency))} – ₼${formatAmount(toAzn(maxPrice, currency))}`;
};
