// stats: [{ value, label, color }]
// color defaults to var(--blue) if omitted
export default function StatRow({ stats }) {
  return (
    <div className="stat-row">
      {stats.map(({ value, label, color = 'var(--blue)' }) => (
        <div key={label} className="stat-card">
          <div className="stat-num" style={{ color }}>{value}</div>
          <div className="stat-lbl">{label}</div>
        </div>
      ))}
    </div>
  )
}
