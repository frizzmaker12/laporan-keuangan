import {
  getDemoTransactions,
  addDemoTransaction,
  updateDemoTransaction,
  removeDemoTransaction,
} from '../services/transactionService.js';

export function getTransactions(req, res) {
  const { category, startDate, endDate } = req.query;
  let transactions = getDemoTransactions();

  if (category) {
    transactions = transactions.filter((item) => item.category.toLowerCase() === String(category).toLowerCase());
  }

  if (startDate) {
    transactions = transactions.filter((item) => item.date >= startDate);
  }

  if (endDate) {
    transactions = transactions.filter((item) => item.date <= endDate);
  }

  res.json({ success: true, data: transactions });
}

export function createTransaction(req, res) {
  const newItem = addDemoTransaction(req.body);
  res.status(201).json({ success: true, data: newItem });
}

export function updateTransaction(req, res) {
  const { id } = req.params;
  const updated = updateDemoTransaction(Number(id), req.body);

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Transaction not found' });
  }

  res.json({ success: true, data: updated });
}

export function deleteTransaction(req, res) {
  const { id } = req.params;
  const removed = removeDemoTransaction(Number(id));

  if (!removed) {
    return res.status(404).json({ success: false, message: 'Transaction not found' });
  }

  res.json({ success: true, message: 'Transaction deleted successfully' });
}
