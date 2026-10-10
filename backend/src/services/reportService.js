import { getDemoTransactions } from './transactionService.js';

export function getSummary() {
  const transactions = getDemoTransactions();
  const totalIncome = transactions
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + item.amountIdr, 0);

  const totalExpense = transactions
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + item.amountIdr, 0);

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    transactionCount: transactions.length,
    currencyRate: 150,
  };
}

export function getDailyReportData(date) {
  const transactions = getDemoTransactions().filter((item) => item.date === date);
  return {
    date,
    transactions,
    totalIncome: transactions
      .filter((item) => item.type === 'income')
      .reduce((sum, item) => sum + item.amountIdr, 0),
    totalExpense: transactions
      .filter((item) => item.type === 'expense')
      .reduce((sum, item) => sum + item.amountIdr, 0),
  };
}

export function getMonthlyReportData(month) {
  const transactions = getDemoTransactions().filter((item) => item.date.startsWith(month));
  return {
    month,
    transactions,
    totalIncome: transactions
      .filter((item) => item.type === 'income')
      .reduce((sum, item) => sum + item.amountIdr, 0),
    totalExpense: transactions
      .filter((item) => item.type === 'expense')
      .reduce((sum, item) => sum + item.amountIdr, 0),
  };
}

export function getYearlyReportData(year) {
  const transactions = getDemoTransactions().filter((item) => item.date.startsWith(String(year)));
  return {
    year,
    transactions,
    totalIncome: transactions
      .filter((item) => item.type === 'income')
      .reduce((sum, item) => sum + item.amountIdr, 0),
    totalExpense: transactions
      .filter((item) => item.type === 'expense')
      .reduce((sum, item) => sum + item.amountIdr, 0),
  };
}
