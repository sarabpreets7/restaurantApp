# Architecture & API

## System overview
- **Frontend**: Next.js app router. React Query manages server cache; Zustand manages cart. Socket.IO client subscribes to per-order updates and an admin feed.
- **Backend**: Nest-style modules with in-memory stores for speed. HTTP handles CRUD; Socket.IO gateway mirrors state changes to clients. Replace in-memory storage with a database repo layer to persist.

## Database schema (logical)
- `menu_items(id, name, description, category, price, dietary[], image_url, prep_minutes, available, stock, add_ons jsonb)`
- `orders(id, customer, subtotal, tax, total, status, created_at, updated_at, version, payment_ref, price_changed)`
- `order_lines(order_id, menu_item_id, quantity, add_on_ids, special_instructions, unit_price, add_on_total)`

## API (prefix `/api`)
- `GET /health` — service probe.
- `GET /menu` — query params: `search`, `category`, `dietary`, `minPrice`, `maxPrice`.
- `POST /orders` — body: `{ lines: [{ menuItemId, quantity, addOnIds?, specialInstructions? }], customer: { name, phone, table? }, mockPaymentIntent? }` → creates order; supports `force-fail` to simulate payment decline.
- `GET /orders` — list (admin).
- `GET /orders/:id` — fetch single order.
- `PATCH /orders/:id/status` — body `{ status }` with allowed transitions: Received → Preparing → Ready → Completed (or Failed).

## Real-time events (Socket.IO, namespace `/ws/orders`)
- Client joins with `orderId` query to receive `order.updated` for that order.
- Admins listen for `admin.orders` to get inserts/updates for all orders.

## Concurrency & stale data
- Orders carry a `version` field incremented per status change to prevent overwriting newer state.
- Stock decrements only after successful (mock) payment to avoid double-counting failures.
- Extend with DB transactions and optimistic concurrency checks for multi-instance deployments.

## Testing
- Backend Jest tests: order creation/transitions, payment failure stock handling.
- Frontend Jest test: cart total with add-ons. Add Playwright for E2E in future iterations.
