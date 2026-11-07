export const MONTH_NAMES = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun',
  'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr',
];

export const CURRENCY_SYMBOLS = { AZN: '₼', TRY: '₺', EUR: '€', USD: '$' };

const formatAmount = (value) => Number(value).toLocaleString('de-DE', { maximumFractionDigits: 0 });

// { minPrice: 2380, maxPrice: 11300, currency: 'TRY' } -> "₺2.380 – ₺11.300"
export const formatPriceRange = ({ minPrice, maxPrice, currency }) => {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  return `${symbol}${formatAmount(minPrice)} – ${symbol}${formatAmount(maxPrice)}`;
};
