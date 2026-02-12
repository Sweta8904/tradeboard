function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    ORDER_RECEIVED: {
      background: "#374151",
      color: "#ffffff",
    },
    DOCUMENTS_IN_PROGRESS: {
      background: "#f59e0b",
      color: "#000000",
    },
    DOCUMENTS_READY: {
      background: "#eab308",
      color: "#000000",
    },
    CUSTOMS_FILED: {
      background: "#3b82f6",
      color: "#ffffff",
    },
    CUSTOMS_HELD: {
      background: "#ef4444",
      color: "#ffffff",
    },
    CUSTOMS_CLEARED: {
      background: "#0ea5e9",
      color: "#ffffff",
    },
    SHIPPED: {
      background: "#6366f1",
      color: "#ffffff",
    },
    IN_TRANSIT: {
      background: "#8b5cf6",
      color: "#ffffff",
    },
    ARRIVED: {
      background: "#22c55e",
      color: "#ffffff",
    },
    DELIVERED: {
      background: "#16a34a",
      color: "#ffffff",
    },
    COMPLETED: {
      background: "#059669",
      color: "#ffffff",
    },
    CANCELLED: {
      background: "#6b7280",
      color: "#ffffff",
    },
  };

  const current = styles[status] || {
    background: "#e5e7eb",
    color: "#000000",
  };

  return (
    <span
      style={{
        padding: "6px 12px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        background: current.background,
        color: current.color,
        display: "inline-block",
        minWidth: 120,
        textAlign: "center",
      }}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

export default StatusBadge;
