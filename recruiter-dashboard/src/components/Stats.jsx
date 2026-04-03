import { useEffect, useState } from "react";
import { API_BASE } from "../config";

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/dashboard/stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleDeleteFake = async () => {
    if (!window.confirm("Are you sure you want to delete all fake email records?")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/recruiters/fake`, { method: "DELETE" });
      const result = await res.json();
      alert(result.message);
      fetchStats();
    } catch (err) {
      console.error(err);
      alert("Failed to delete fake emails.");
    } finally {
      setLoading(false);
    }
  };

  if (!stats) return <p>Loading stats...</p>;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
        gap: "16px",
        marginBottom: "24px",
      }}
    >
      <Stat label="Total" value={stats.total} />
      <Stat label="Top Tier" value={stats.top_tier || 0} color="#4f46e5" />
      <Stat label="Sent" value={stats.sent} />
      <Stat label="Replied" value={stats.replied} />
      <Stat label="New" value={stats.new} />
      <Stat 
        label="Fake" 
        value={stats.fake || 0} 
        color="#b91c1c" 
        onAction={handleDeleteFake} 
        actionLabel="Clean"
        loading={loading}
      />
      <Stat label="Risky" value={stats.risky || 0} color="#854d0e" />
      <Stat label="Errors" value={stats.errors || 0} />
      <Stat label="Followups" value={stats.followups || 0} />
      <Stat label="Opened" value={stats.opened || 0} />
      <Stat label="Clicked" value={stats.clicked || 0} />
    </div>
  );
}

function Stat({ label, value, color, onAction, actionLabel, loading }) {
  return (
    <div
      className="card"
      style={{
        padding: "16px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        borderTop: color ? `4px solid ${color}` : "1px solid var(--border)",
        position: "relative",
      }}
    >
      <h2
        style={{
          fontSize: "28px",
          margin: "0 0 4px 0",
          color: color || "var(--primary)",
        }}
      >
        {value}
      </h2>
      <p
        style={{
          margin: 0,
          color: "var(--text-muted)",
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        {label}
      </p>
      {onAction && value > 0 && (
        <button
          onClick={onAction}
          disabled={loading}
          style={{
            position: "absolute",
            top: "6px",
            right: "6px",
            background: "transparent",
            border: `1px solid ${color || 'var(--border)'}`,
            color: color || "var(--primary)",
            fontSize: "11px",
            fontWeight: "700",
            cursor: "pointer",
            padding: "2px 6px",
            borderRadius: "4px",
            textTransform: "uppercase",
            opacity: 0.7,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.opacity = 1;
            e.target.style.background = (color || 'var(--primary)') + '10';
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = 0.7;
            e.target.style.background = 'transparent';
          }}
        >
          {loading ? "..." : actionLabel}
        </button>
      )}
    </div>
  );
}
