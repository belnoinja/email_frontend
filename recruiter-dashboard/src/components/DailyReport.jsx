import { useState, useEffect } from "react";
import { API_BASE } from "../config";

export default function DailyReport() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/dashboard/daily-report`)
      .then((res) => res.json())
      .then((data) => {
        setReportData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load daily report:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ color: "var(--text-muted)" }}>Loading daily report...</div>;
  }

  // Determine the color intensity for the heatmap cell based on emails sent
  const getCellColor = (sent) => {
    if (sent === 0) return "var(--border-color)";
    if (sent <= 5) return "#064e3b";
    if (sent <= 15) return "#059669";
    if (sent <= 30) return "#10b981";
    return "#34d399";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="card">
        <h3 style={{ margin: "0 0 16px 0" }}>Daily Sending Heatmap</h3>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "20px" }}>
          Emails sent per day (dark green = higher volume).
        </p>
        
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
          {[...reportData].reverse().map((day) => (
            <div
              key={day.date}
              title={`${day.sent} sent on ${day.date}`}
              style={{
                width: "16px",
                height: "16px",
                backgroundColor: getCellColor(day.sent),
                borderRadius: "2px",
                cursor: "pointer"
              }}
            />
          ))}
          {reportData.length === 0 && (
            <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>No data yet.</span>
          )}
        </div>
        <div style={{ display: "flex", gap: "8px", marginTop: "16px", alignItems: "center", fontSize: "12px", color: "var(--text-muted)" }}>
          <span>Less</span>
          <div style={{ width: 12, height: 12, backgroundColor: "var(--border-color)" }} />
          <div style={{ width: 12, height: 12, backgroundColor: "#064e3b" }} />
          <div style={{ width: 12, height: 12, backgroundColor: "#059669" }} />
          <div style={{ width: 12, height: 12, backgroundColor: "#10b981" }} />
          <div style={{ width: 12, height: 12, backgroundColor: "#34d399" }} />
          <span>More</span>
        </div>
      </div>

      <div className="card">
        <h3 style={{ margin: "0 0 16px 0" }}>Daily Breakdown</h3>
        <div className="table-responsive">
          <table className="recruiter-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Sent</th>
                <th>Errors</th>
                <th>Fake</th>
                <th>Top Tier</th>
                <th>Startup</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row) => (
                <tr key={row.date}>
                  <td style={{ fontWeight: "bold", color: "var(--text-light)" }}>{row.date}</td>
                  <td>{row.sent}</td>
                  <td>
                    {row.errors > 0 ? (
                      <span className="status-badge status-error">{row.errors} Errors</span>
                    ) : (
                      <span style={{ color: "var(--text-muted)" }}>0</span>
                    )}
                  </td>
                  <td>
                    {row.fake > 0 ? (
                      <span className="status-badge" style={{ backgroundColor: "rgba(239, 68, 68, 0.2)", color: "#fca5a5" }}>{row.fake} Fake</span>
                    ) : (
                      <span style={{ color: "var(--text-muted)" }}>0</span>
                    )}
                  </td>
                  <td>
                    {row.topTier > 0 ? (
                      <span className="tier-badge tier-top">{row.topTier}</span>
                    ) : (
                      <span style={{ color: "var(--text-muted)" }}>0</span>
                    )}
                  </td>
                  <td>
                    {row.startup > 0 ? (
                      <span className="tier-badge tier-startup">{row.startup}</span>
                    ) : (
                      <span style={{ color: "var(--text-muted)" }}>0</span>
                    )}
                  </td>
                </tr>
              ))}
              {reportData.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)" }}>
                    No daily reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
