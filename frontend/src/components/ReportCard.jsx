export default function ReportCard({ title, value, description }) {
  return (
    <div className="report-card">
      <div className="report-title">{title}</div>
      <div className="report-value">{value}</div>
      <div className="report-description">{description}</div>
    </div>
  );
}
