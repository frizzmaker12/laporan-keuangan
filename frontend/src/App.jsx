import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import DashboardPage from '../pages/Dashboard.jsx';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/reports" element={<div className="page"><h1>Laporan</h1><p>Rencana laporan harian, bulanan, tahunan.</p></div>} />
        <Route path="/transactions" element={<div className="page"><h1>Transaksi</h1><p>Daftar transaksi akan datang di versi berikutnya.</p></div>} />
      </Routes>
    </Layout>
  );
}
