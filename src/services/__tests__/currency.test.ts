jest.mock('expo-localization', () => ({
  getLocales: () => [{ currencyCode: 'ILS', languageCode: 'ar' }],
}));

import { formatLocalPrice, getLocalCurrencyCode, getPlanPrices, USD_PRICES } from '../currency';

describe('currency', () => {
  it('detects the device currency', () => {
    expect(getLocalCurrencyCode()).toBe('ILS');
  });

  it('keeps the USD base prices exact (no undercutting)', () => {
    expect(formatLocalPrice(USD_PRICES.monthly, 'USD')).toBe('$9.99');
    expect(formatLocalPrice(USD_PRICES.yearly, 'USD')).toBe('$59.99');
  });

  it('formats suffix currencies with .99 psychological endings', () => {
    expect(formatLocalPrice(9.99, 'ILS')).toMatch(/^\d+\.99 ₪$/);
  });

  it('rounds zero-decimal currencies to whole amounts', () => {
    expect(formatLocalPrice(9.99, 'JPY')).toMatch(/^¥\d+$/);
  });

  it('falls back to USD for unknown currencies', () => {
    expect(formatLocalPrice(9.99, 'XXX')).toBe('$9.99');
  });

  it('produces a full localized plan price set', () => {
    const prices = getPlanPrices();
    expect(prices.currency).toBe('ILS');
    expect(prices.monthly).toContain('₪');
    expect(prices.yearly).toContain('₪');
    expect(prices.yearlyPerMonth).toContain('₪');
  });
});
