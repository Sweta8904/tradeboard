import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ShipmentsList from "./pages/ShipmentsList";
import ShipmentDetail from "./pages/ShipmentDetail";
import CreateShipment from "./pages/CreateShipment";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/shipments" element={<ShipmentsList />} />
        <Route path="/shipments/:id" element={<ShipmentDetail />} />
        <Route path="/create" element={<CreateShipment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
