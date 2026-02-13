# DESIGN_DECISIONS.md

## 1️⃣ What database did you use and why?

I used SQLite for this project.

Since this is a demo application with low concurrency requirements, SQLite is lightweight, easy to set up, and requires no external configuration. It simplifies deployment and local development.

For a production-scale system managing 200+ shipments per month across multiple users, I would switch to PostgreSQL for better concurrency handling, indexing performance, and scalability.

---

## 2️⃣ How did you implement the status machine?

The shipment lifecycle is enforced using a backend-controlled state machine.

I defined a dictionary (`ALLOWED_TRANSITIONS`) mapping each status to its valid next states.

Example:

```python
ALLOWED_TRANSITIONS = {
    "ORDER_RECEIVED": ["DOCUMENTS_IN_PROGRESS", "CANCELLED"],
    "DOCUMENTS_IN_PROGRESS": ["DOCUMENTS_READY", "CANCELLED"],
    ...
}
