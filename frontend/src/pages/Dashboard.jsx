import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../components/StatCard.jsx';
import ReportCard from '../components/ReportCard.jsx';
import TransactionForm from '../components/TransactionForm.jsx';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export default function Dashboard() {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const [summaryRes, transactionRes] = await Promise.all([
        api.get('/reports/summary'),
        api.get('/transactions'),
      ]);

      setSummary(summaryRes.data.data);
      setTransactions(transactionRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleAddTransaction = async (payload) => {
    try {
      await api.post('/transactions', payload);
      fetchDashboard();
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const chartData = [
    { name: 'Jan', income: 1200000, expense: 800000 },
    { name: 'Feb', income: 1450000, expense: 900000 },
    { name: 'Mar', income: 1400000, expense: 950000 },
    { name: 'Apr', income: 1600000, expense: 1000000 },
  ];

  if (loading) {
    return <div className="page-loading">Loading dashboard...</div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="eyebrow">Overview</div>
          <h1>Dashboard Keuangan</h1>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Pemasukan" value={`Rp ${summary.totalIncome?.toLocaleString('id-ID')}`} accent="green" />
        <StatCard title="Total Pengeluaran" value={`Rp ${summary.totalExpense?.toLocaleString('id-ID')}`} accent="red" />
        <StatCard title="Saldo" value={`Rp ${summary.balance?.toLocaleString('id-ID')}`} accent="blue" />
        <StatCard title="Transaksi" value={summary.transactionCount || 0} accent="purple" />
      </div>

      <div className="content-grid">
        <div className="panel chart-panel">
          <h3>Trend keuangan</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="income" fill="#10b981" />
                <Bar dataKey="expense" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel">
          <TransactionForm onSubmit={handleAddTransaction} />
        </div>
      </div>

      <div className="report-grid">
        <ReportCard title="Laporan Harian" value="Hari ini" description="Cek pengeluaran dan pemasukan hari ini" />
        <ReportCard title="Laporan Bulanan" value="Bulan ini" description="Ringkasan keuangan bulanan" />
        <ReportCard title="Laporan Tahunan" value="Tahun ini" description="Trend tahunan dan target investasi" />
      </div>

      <div className="panel transactions-panel">
        <h3>Transaksi terbaru</h3>
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Kategori</th>
              <th>Jenis</th>
              <th>Nominal</th>
              <th>Catatan</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 6).map((item) => (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td>{item.category}</td>
                <td>{item.type}</td>
                <td>{item.amountIdr?.toLocaleString('id-ID')}</td>
                <td>{item.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
