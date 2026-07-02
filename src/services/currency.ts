import * as Localization from 'expo-localization';

/**
 * Subscription pricing is defined in USD and *displayed* in the user's local
 * currency. The static FX table below is a display-time approximation for the
 * mock paywall — real prices must come from StoreKit / Play Billing localized
 * price points at integration time.
 */
export const USD_PRICES = {
  monthly: 9.99,
  yearly: 59.99,
  yearlyPerMonth: 4.99,
} as const;

interface CurrencyInfo {
  rate: number; // 1 USD → local
  symbol: string;
  /** true if the symbol goes after the amount (e.g. "19.90 ₪") */
  suffix?: boolean;
  decimals?: number;
}

const CURRENCIES: Record<string, CurrencyInfo> = {
  USD: { rate: 1, symbol: '$' },
  EUR: { rate: 0.93, symbol: '€', suffix: true },
  GBP: { rate: 0.79, symbol: '£' },
  ILS: { rate: 3.7, symbol: '₪', suffix: true },
  SAR: { rate: 3.75, symbol: 'ر.س', suffix: true },
  AED: { rate: 3.67, symbol: 'د.إ', suffix: true },
  EGP: { rate: 49, symbol: 'ج.م', suffix: true, decimals: 0 },
  JOD: { rate: 0.71, symbol: 'د.أ', suffix: true },
  KWD: { rate: 0.31, symbol: 'د.ك', suffix: true },
  QAR: { rate: 3.64, symbol: 'ر.ق', suffix: true },
  TRY: { rate: 34, symbol: '₺', decimals: 0 },
  PKR: { rate: 278, symbol: '₨', decimals: 0 },
  INR: { rate: 84, symbol: '₹', decimals: 0 },
  BDT: { rate: 120, symbol: '৳', decimals: 0 },
  IDR: { rate: 15900, symbol: 'Rp', decimals: 0 },
  MYR: { rate: 4.4, symbol: 'RM' },
  RUB: { rate: 97, symbol: '₽', suffix: true, decimals: 0 },
  BRL: { rate: 5.8, symbol: 'R$' },
  JPY: { rate: 150, symbol: '¥', decimals: 0 },
  KRW: { rate: 1390, symbol: '₩', decimals: 0 },
  CNY: { rate: 7.2, symbol: '¥' },
  CAD: { rate: 1.4, symbol: 'C$' },
  AUD: { rate: 1.55, symbol: 'A$' },
  CHF: { rate: 0.88, symbol: 'CHF ' },
  KES: { rate: 129, symbol: 'KSh ', decimals: 0 },
  NGN: { rate: 1650, symbol: '₦', decimals: 0 },
  MAD: { rate: 10, symbol: 'د.م', suffix: true },
};

export function getLocalCurrencyCode(): string {
  const locales = Localization.getLocales();
  const code = locales[0]?.currencyCode?.toUpperCase();
  return code && CURRENCIES[code] ? code : 'USD';
}

/** Convert a USD amount and format it in the local currency, e.g. "36.90 ₪". */
export function formatLocalPrice(usd: number, currencyCode = getLocalCurrencyCode()): string {
  const info = CURRENCIES[currencyCode] ?? CURRENCIES.USD;
  const value = usd * info.rate;
  const decimals = info.decimals ?? 2;
  // psychological pricing: keep .99 / .90 endings where decimals are shown
  const rounded = decimals === 0 ? Math.round(value) : Math.floor(value) + 0.9;
  const amount = rounded.toFixed(decimals);
  return info.suffix ? `${amount} ${info.symbol}` : `${info.symbol}${amount}`;
}

export function getPlanPrices() {
  const code = getLocalCurrencyCode();
  return {
    currency: code,
    monthly: formatLocalPrice(USD_PRICES.monthly, code),
    yearly: formatLocalPrice(USD_PRICES.yearly, code),
    yearlyPerMonth: formatLocalPrice(USD_PRICES.yearlyPerMonth, code),
  };
}
