import { Link } from 'react-router-dom';

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Laporan Keuangan</div>
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/reports">Laporan</Link>
          <Link to="/transactions">Transaksi</Link>
        </nav>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}
