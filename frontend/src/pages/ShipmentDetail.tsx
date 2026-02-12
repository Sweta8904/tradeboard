import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import StatusBadge from "../components/StatusBadge";

interface DocumentType {
  id: number;
  name: string;
  status: string;
}

interface EventType {
  id: number;
  description: string;
  created_at: string;
}

interface ShipmentType {
  id: number;
  shipment_number: string;
  status: string;
  total_fob: number;
  quantity: number;
  unit_price: number;
  payment_terms: number;
  payment_status: string;
  documents: DocumentType[];
  events: EventType[];
}

function ShipmentDetail() {
  const { id } = useParams();

  const [shipment, setShipment] = useState<ShipmentType | null>(null);
  const [allowed, setAllowed] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShipment = async () => {
    try {
      const res = await API.get(`shipments/${id}/`);
      setShipment(res.data);
    } catch (err) {
      setError("Failed to load shipment.");
    }
  };

  const fetchAllowedTransitions = async () => {
    try {
      const res = await API.get(
        `shipments/${id}/allowed_transitions/`
      );
      setAllowed(res.data.allowed);
    } catch (err) {
      console.error("Failed to fetch transitions");
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchShipment();
      await fetchAllowedTransitions();
      setLoading(false);
    };

    load();
  }, [id]);

  const changeStatus = async (newStatus: string) => {
    try {
      await API.post(`shipments/${id}/change_status/`, {
        status: newStatus,
      });

      await fetchShipment();
      await fetchAllowedTransitions();
    } catch (err: any) {
      alert(err.response?.data?.error || "Invalid transition");
    }
  };

  const updateDocumentStatus = async (
    docId: number,
    newStatus: string
  ) => {
    try {
      await API.patch(`documents/${docId}/`, {
        status: newStatus,
      });

      await fetchShipment();
    } catch (err) {
      alert("Failed to update document");
    }
  };

  if (loading) return <div style={{ padding: 30 }}>Loading...</div>;
  if (error) return <div style={{ padding: 30 }}>{error}</div>;
  if (!shipment) return null;

  return (
    <div style={{ padding: 30 }}>
      <h1>📦 {shipment.shipment_number}</h1>

      {/* HEADER SECTION */}
      <div
        style={{
  marginBottom: 30,
  padding: 20,
  background: "#1f2937",
  borderRadius: 12,
  color: "#ffffff",
}}
      >
        <p>
          <strong>Status:</strong>{" "}
          <StatusBadge status={shipment.status} />
        </p>
        <p>
          <strong>Total FOB:</strong> ₹ {shipment.total_fob}
        </p>
      </div>

      {/* TRADE DETAILS */}
      <div
       style={{
  marginBottom: 30,
  padding: 20,
  background: "#1f2937",
  borderRadius: 12,
  color: "#ffffff",
}}
      >
        <h2>📋 Trade Details</h2>
        <p>Quantity: {shipment.quantity}</p>
        <p>Unit Price: ₹ {shipment.unit_price}</p>
      </div>

      {/* FINANCIAL */}
      <div
        style={{
  marginBottom: 30,
  padding: 20,
  background: "#1f2937",
  borderRadius: 12,
  color: "#ffffff",
}}

      >
        <h2>💰 Financial</h2>
        <p>Payment Terms: {shipment.payment_terms} days</p>
        <p>Payment Status: {shipment.payment_status}</p>
      </div>

      {/* STATUS CHANGE */}
      <div
        style={{
  marginBottom: 30,
  padding: 20,
  background: "#1f2937",
  borderRadius: 12,
  color: "#ffffff",
}}

      >
        <h2>🔄 Change Status</h2>

        {allowed.length === 0 && <p>No transitions available.</p>}

        <select
          onChange={(e) => {
            const newStatus = e.target.value;
            if (!newStatus) return;
            changeStatus(newStatus);
          }}
        >
          <option value="">Select Next Status</option>
          {allowed.map((status) => (
            <option key={status} value={status}>
              {status.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {/* DOCUMENTS */}
      <div
        style={{
  marginBottom: 30,
  padding: 20,
  background: "#1f2937",
  borderRadius: 12,
  color: "#ffffff",
}}

      >
        <h2>📄 Documents</h2>

        {shipment.documents.length === 0 && (
          <p>No documents found.</p>
        )}

        {shipment.documents.map((doc) => (
          <div key={doc.id} style={{ marginBottom: 12 }}>
            <strong>{doc.name}</strong>{" "}
            <select
              value={doc.status}
              onChange={(e) =>
                updateDocumentStatus(doc.id, e.target.value)
              }
            >
              <option value="not_started">Not Started</option>
              <option value="draft">Draft</option>
              <option value="ready">Ready</option>
              <option value="verified">Verified</option>
            </select>
          </div>
        ))}
      </div>

      {/* TIMELINE */}
      <div
        style={{
  marginBottom: 30,
  padding: 20,
  background: "#1f2937",
  borderRadius: 12,
  color: "#ffffff",
}}

      >
        <h2>🕒 Timeline</h2>

        {shipment.events.length === 0 && (
          <p>No events yet.</p>
        )}

        {shipment.events.map((event) => (
          <div key={event.id} style={{ marginBottom: 10 }}>
            •{" "}
            {new Date(event.created_at).toLocaleDateString()} —{" "}
            {event.description}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShipmentDetail;
