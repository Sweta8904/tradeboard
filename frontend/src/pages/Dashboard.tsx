import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Summary {
  total_active: number;
  overdue_count: number;
  total_value: number;
}

interface Alert {
  type: string;
  message: string;
}

function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);

useEffect(() => {
  API.get("dashboard/alerts/")
    .then(res => setAlerts(res.data));
}, []);


<h2>Alerts</h2>

{alerts.map((a, index) => (
  <div
    key={index}
    style={{
      padding: 12,
      marginBottom: 8,
      borderRadius: 8,
      background: "#fee2e2",
      cursor: "pointer"
    }}
  >
    {a.message}
  </div>
))}

  const [statusData, setStatusData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, alertsRes, statusRes] = await Promise.all([
          API.get("dashboard/summary/"),
          API.get("dashboard/alerts/"),
          API.get("analytics/shipments-by-status/"),
        ]);

        setSummary(summaryRes.data);
        setAlerts(alertsRes.data);
        const formatted = statusRes.data.map((item: any) => ({
  ...item,
  status: item.status.replace(/_/g, " "),
}));

setStatusData(formatted);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading dashboard...</div>;
  if (!summary) return <div style={{ padding: 20 }}>Error loading data.</div>;

  return (
    <div style={{ padding: 30 }}>
      <h1 style={{ marginBottom: 30 }}>🚢 TradeBoard Dashboard</h1>

      {/* SUMMARY CARDS */}
      <div
        style={{
          display: "flex",
          gap: 20,
          marginBottom: 40,
        }}
      >
        <div
          style={{
            flex: 1,
            padding: 20,
            background: "#f3f4f6",
            borderRadius: 12,
          }}
        >
          <h3 style={{ color: "#374151" }}>Total Active Shipments</h3>
<h2 style={{ color: "#111827" }}>{summary.total_active}</h2>
        </div>

        <div
          style={{
            flex: 1,
            padding: 20,
            background: "#fee2e2",
            borderRadius: 12,
            color : "#374151",
          }}
        >
          <h3>Overdue Payments</h3>
          <h2>{summary.overdue_count}</h2>
        </div>

        <div
          style={{
            flex: 1,
            padding: 20,
            background: "#fee2e2",
            borderRadius: 12,
            color : "#374151",
          }}
        >
          <h3>Total FOB Value</h3>
          <h2>₹ {summary.total_value}</h2>
        </div>
      </div>

      {/* ALERTS */}
      <h2>⚠ Alerts</h2>
      <div style={{ marginBottom: 40 }}>
        {alerts.length === 0 && <p>No active alerts 🎉</p>}

        {alerts.map((a, index) => (
          <div
            key={index}
            style={{
              padding: 10,
              marginBottom: 8,
              borderRadius: 8,
              background:
                a.type === "critical"
                  ? "#e69191"
                  : a.type === "warning"
                  ? "#fef3c7"
                  : "#e0f2fe",
            }}
          >
            {a.message}
          </div>
        ))}
      </div>

      {/* STATUS CHART */}
      <h2>📊 Shipments by Status</h2>
      <div style={{ width: "100%", height: 300, marginBottom: 40 }}>
        <ResponsiveContainer>
  <BarChart data={statusData}>
    <XAxis
      dataKey="status"
      stroke="#ffffff"
      interval={0}
      angle={-20}
      textAnchor="end"
      height={70}
    />
    <YAxis stroke="#ffffff" />
    <Tooltip />
    <Bar dataKey="count" fill="#60a5fa" />
  </BarChart>
</ResponsiveContainer>


      </div>

      {/* NAVIGATION */}
      <div style={{ display: "flex", gap: 20 }}>
        <Link to="/shipments">View Shipments</Link>
        <Link to="/create">Create Shipment</Link>
      </div>
    </div>
  );
}

export default Dashboard;
