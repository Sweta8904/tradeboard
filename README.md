# 🚢 TradeBoard — Export Operations Command Center

TradeBoard is a full-stack web application that serves as a centralized operations dashboard for exporters managing shipments across multiple countries.

It replaces Excel sheets, WhatsApp updates, and manual tracking with a structured, rule-enforced command center.

---

# 🔥 Core Features

## 📊 Dashboard
- Total active shipments (excluding COMPLETED & CANCELLED)
- Overdue payments count
- Total FOB value in pipeline
- Alerts panel (Overdue payments, Customs held)
- Shipments by status chart

## 📦 Shipments Management
- List shipments with:
  - Status filter
  - Buyer filter
  - Payment status filter
  - Search (shipment number / buyer name)
- Pagination
- Colored status badges
- Click row → Shipment detail page

## 📄 Shipment Detail
- Grouped shipment information
  - Trade details
  - Financial details
- Documents checklist (7 document types)
- Automatic activity timeline
- Status transition dropdown (only valid transitions shown)

## 🔒 Backend State Machine
All shipment transitions are enforced server-side.

Invalid transitions return:

Live URL :
frontend: tradeboard-e3h0rb68l-sweta8904s-projects.vercel.app
backend: https://tradeboard-11.onrender.com