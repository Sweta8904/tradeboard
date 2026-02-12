import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function CreateShipment() {
  const [form, setForm] = useState({
    shipment_number: "",
    buyer: 1,
    product: 1,
    quantity: 0,
    unit_price: 0,
    payment_terms: 30,
  });

  const navigate = useNavigate();

  const handleSubmit = async () => {
    const res = await API.post("shipments/", form);
    navigate(`/shipments/${res.data.id}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Create Shipment</h1>

      <input
        placeholder="Shipment Number"
        onChange={(e) => setForm({ ...form, shipment_number: e.target.value })}
      />

      <input
        type="number"
        placeholder="Quantity"
        onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
      />

      <input
        type="number"
        placeholder="Unit Price"
        onChange={(e) => setForm({ ...form, unit_price: Number(e.target.value) })}
      />

      <button onClick={handleSubmit}>Create</button>
    </div>
  );
}

export default CreateShipment;
