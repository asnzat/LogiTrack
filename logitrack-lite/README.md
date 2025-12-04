# LogiTrack Lite - Frontend

A modern, responsive frontend for the LogiTrack Lite logistics management system. Built with React, Vite, and TailwindCSS.

## Features

- Authentication with JWT (access token stored in localStorage, refresh token in httpOnly cookie)
- Role-based UI for Admin and Driver
- Shipment management: create, view, update status
- Public tracking page for customers
- Lightweight global state with Zustand
- Forms handled with React Hook Form
- TailwindCSS utility-first styling

## Key files / exports

- API layer: [`authService`](logitrack-lite/src/services/api.js), [`shipmentService`](logitrack-lite/src/services/api.js) — see [src/services/api.js](logitrack-lite/src/services/api.js)
- Auth store: [`useAuthStore`](logitrack-lite/src/store/useAuthStore.js) — see [src/store/useAuthStore.js](logitrack-lite/src/store/useAuthStore.js)
- Main app entry: [src/main.jsx](logitrack-lite/src/main.jsx)
- Routing and protected layout: [src/App.jsx](logitrack-lite/src/App.jsx)

## Prerequisites

- Node.js (v16+)
- npm or yarn
- Backend API running at http://localhost:5000 (see backend README: [logitrack-backend/README.md](logitrack-backend/README.md))

## Getting Started

1. Open the frontend folder:

   ```sh
   cd logitrack-lite
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Start dev server:
   ```sh
   npm run dev
   ```
   The app will usually be available at http://localhost:5173

## Scripts

- npm run dev — start Vite dev server
- npm run build — build production assets
- npm run preview — preview production build
- npm run lint — run ESLint

## Notes

- API base URL is configured in [src/services/api.js](logitrack-lite/src/services/api.js).
- The app uses localStorage for the access token and sends it automatically via Axios interceptors (`authService`/`shipmentService`).
- Demo backend accounts are seeded by the backend; see [logitrack-backend/README.md](logitrack-backend/README.md) for credentials and backend setup.
