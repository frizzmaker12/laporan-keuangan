export default function StatCard({ title, value, accent = 'blue' }) {
  return (
    <div className={`stat-card accent-${accent}`}>
      <div className="stat-label">{title}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}
