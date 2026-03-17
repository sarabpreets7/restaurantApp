# Real-Time Restaurant Ordering System

Full-stack take-home built with Next.js (customer + admin) and a Nest-style Node backend. It delivers live order updates over Socket.IO, optimistic stock handling, and lightweight in-memory storage to keep setup simple.

## Project layout
- `backend/` Nest-like API with menu, orders, WebSocket gateway, Jest unit tests.
- `frontend/` Next.js 14 app (app router) with React Query, Zustand cart, Socket.IO tracking, and basic Testing Library coverage.

## Running locally
1) Install deps
```bash
cd backend && npm install
cd ../frontend && npm install
```
2) Start backend
```bash
cd backend
npm run seed # optional: loads menu with images
npm run dev  # listens on 4300 by default
```
3) Start frontend
```bash
cd frontend
npm run dev # opens http://localhost:3000
```
Environment variables are documented in `backend/.env.example` and `frontend/.env.example`. In-memory data resets on restart; swap in a real database by replacing the menu and order services.

Admin auth: backend expects `ADMIN_TOKEN` in `backend/.env`; login at `/admin` with that token, which returns a JWT stored in `localStorage`. Customer tokens are auto-issued from `/auth/customer` and stored separately.

### Run tests
```bash
cd backend && npm test   # ts-jest will warn about isolatedModules; add isolatedModules:true in tsconfig to silence
cd ../frontend && npm test
```

## Architecture / API / Data
- **Architecture:** Next.js app router (frontend) + Node backend with modular controllers/services and Socket.IO for live updates. React Query handles server cache; Zustand handles cart state and persistence.
- **Data:** SQLite via Prisma (file: `./dev.db`). Seed script loads ~50 menu items with dietary tags, add-ons, and images. Orders stored with JSON lines and version for optimistic status updates.
- **API endpoints:**  
  - `GET /api/health` — liveness  
  - `GET /api/menu` — menu with filters (`search`, `category`, `dietary`, `minPrice`, `maxPrice`)  
  - `POST /api/orders` — create order (mock payment supported)  
  - `GET /api/orders` — list orders (admin)  
  - `GET /api/orders/:id` — fetch order + line details  
  - `PATCH /api/orders/:id/status` — update status (version-checked)  
  - `POST /api/auth/customer` — issue guest/customer token  
  - `POST /api/auth/login` — admin login returns JWT  
- **Real-time:** Socket.IO namespaces: `/ws/orders`, events `order.updated` (per order room) and `admin.orders` (broadcast to admin dashboard).
- **ERD (logical):** `MenuItem` (id, name, description, category, price, dietary[], addOns[], stock) ← `Order.lines[]` (menuItemId, qty, addOnIds, unitPrice, addOnTotal) → `Order` (id, customer JSON, subtotal/tax/total, status, version, paymentRef, priceChanged).
- **Diagram:** see `docs/ERD.md` for a Mermaid ERD snippet.

## Features delivered
- Customer: browse/search/filter menu, add to cart with quantity and notes, mock checkout, live order tracker.
- Kitchen/Admin: real-time order feed, status progression (Received → Preparing → Ready → Completed), pushes updates to customers instantly.
- State: React Query for server cache, Zustand for cart/session, optimistic stock checks in backend, versioned order updates.
- Tests: Jest specs for backend order transitions and cart totals.

## Architecture highlights
- **Backend**: layered modules (controllers → service → in-memory repo). Socket.IO gateway broadcasts `order.updated` to per-order rooms and `admin.orders` to the kitchen dashboard. Payment is mocked with a `force-fail` toggle to simulate declines without external gateways.
- **Frontend**: app router pages (`/` customer, `/track/[orderId]`, `/admin`). Shared API client + websocket helper. Cart totals recompute with add-ons. Minimal styling via glassmorphism theme to keep UI legible.

## Next steps if you continue
- Persist data (PostgreSQL + Prisma) and move stock handling to transactions.
- Add auth (NextAuth for admin) and role-based access to status updates.
- Add E2E tests (Playwright) and contract tests between FE/BE.
- Enhance price drift handling by sending client-captured prices and reconciling on checkout.
