import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";

function ShipmentsList() {
  const [shipments, setShipments] = useState<any[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);

  const fetchShipments = (url = "shipments/") => {
    API.get(url).then((res) => {
      setShipments(res.data.results);
      setNextPage(res.data.next);
      setPrevPage(res.data.previous);
    });
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h1>📦 Shipments</h1>

      <table width="100%" border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>Number</th>
            <th>Buyer</th>
            <th>Status</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {shipments.map((s) => (
            <tr key={s.id}>
              <td>
                <Link to={`/shipments/${s.id}`}>
                  {s.shipment_number}
                </Link>
              </td>
              <td>{s.buyer_name}</td>
              <td>
                <StatusBadge status={s.status} />
              </td>
              <td>₹ {s.total_fob}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        {prevPage && (
          <button onClick={() => fetchShipments(prevPage)}>
            Previous
          </button>
        )}
        {nextPage && (
          <button onClick={() => fetchShipments(nextPage)}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default ShipmentsList;
