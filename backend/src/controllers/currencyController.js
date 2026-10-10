import { getCurrencySummary, convertJPYToIDR } from '../services/currencyService.js';

export function getCurrencyRates(req, res) {
  res.json({ success: true, data: getCurrencySummary() });
}

export function convertCurrency(req, res) {
  const { amount = 0, fromCurrency = 'JPY', toCurrency = 'IDR' } = req.query;
  const result = convertJPYToIDR(Number(amount));

  if (fromCurrency.toUpperCase() !== 'JPY' || toCurrency.toUpperCase() !== 'IDR') {
    return res.json({ success: true, data: { amount: Number(amount), converted: Number(amount) } });
  }

  res.json({ success: true, data: result });
}
