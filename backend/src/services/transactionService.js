export const demoTransactions = [
  {
    id: 1,
    category: 'Jajan',
    type: 'expense',
    amount: 50000,
    amountIdr: 50000,
    currency: 'IDR',
    date: '2026-10-10',
    note: 'Makan siang',
  },
  {
    id: 2,
    category: 'Investasi',
    type: 'expense',
    amount: 200000,
    amountIdr: 200000,
    currency: 'IDR',
    date: '2026-10-09',
    note: 'Reksadana',
  },
  {
    id: 3,
    category: 'Gaji',
    type: 'income',
    amount: 3500000,
    amountIdr: 3500000,
    currency: 'IDR',
    date: '2026-10-01',
    note: 'Gaji bulanan',
  },
  {
    id: 4,
    category: 'Sedekah',
    type: 'expense',
    amount: 100000,
    amountIdr: 100000,
    currency: 'IDR',
    date: '2026-10-08',
    note: 'Sedekah',
  },
  {
    id: 5,
    category: 'JPY Saving',
    type: 'expense',
    amount: 2000,
    amountIdr: 300000,
    currency: 'JPY',
    date: '2026-10-05',
    note: 'Menabung JPY',
  },
];

export function getDemoTransactions() {
  return demoTransactions;
}

export function addDemoTransaction(payload) {
  const newItem = {
    id: Date.now(),
    category: payload.category || 'Lainnya',
    type: payload.type || 'expense',
    amount: Number(payload.amount || 0),
    amountIdr: Number(payload.amountIdr || payload.amount || 0),
    currency: payload.currency || 'IDR',
    date: payload.date || new Date().toISOString().slice(0, 10),
    note: payload.note || '',
  };

  demoTransactions.unshift(newItem);
  return newItem;
}

export function updateDemoTransaction(id, payload) {
  const index = demoTransactions.findIndex((item) => item.id === Number(id));
  if (index === -1) return null;

  demoTransactions[index] = {
    ...demoTransactions[index],
    ...payload,
    amountIdr: Number(payload.amountIdr || payload.amount || demoTransactions[index].amountIdr),
  };

  return demoTransactions[index];
}

export function removeDemoTransaction(id) {
  const index = demoTransactions.findIndex((item) => item.id === Number(id));
  if (index === -1) return false;

  demoTransactions.splice(index, 1);
  return true;
}
