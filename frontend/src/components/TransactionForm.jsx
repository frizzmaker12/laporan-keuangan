import { useState } from 'react';

export default function TransactionForm({ onSubmit }) {
  const [form, setForm] = useState({
    category: 'Jajan',
    type: 'expense',
    amount: 50000,
    currency: 'IDR',
    date: new Date().toISOString().slice(0, 10),
    note: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <h3>Tambah transaksi</h3>

      <div className="form-grid">
        <label>
          Kategori
          <input name="category" value={form.category} onChange={handleChange} />
        </label>

        <label>
          Tipe
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="expense">Pengeluaran</option>
            <option value="income">Pemasukan</option>
          </select>
        </label>

        <label>
          Nominal
          <input type="number" name="amount" value={form.amount} onChange={handleChange} />
        </label>

        <label>
          Mata Uang
          <select name="currency" value={form.currency} onChange={handleChange}>
            <option value="IDR">IDR</option>
            <option value="JPY">JPY</option>
          </select>
        </label>

        <label>
          Tanggal
          <input type="date" name="date" value={form.date} onChange={handleChange} />
        </label>

        <label>
          Catatan
          <input name="note" value={form.note} onChange={handleChange} />
        </label>
      </div>

      <button type="submit" className="primary-button">Simpan transaksi</button>
    </form>
  );
}
