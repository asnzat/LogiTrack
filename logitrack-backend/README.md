# LogiTrack Lite - Backend

A complete, dockerized backend for the LogiTrack Lite logistics system. Built with Node.js, Express, and MongoDB.

## Features

- **Authentication**: JWT-based auth with access tokens and httpOnly refresh cookies.
- **Roles**: Admin, Driver, Public.
- **Shipments**: Full CRUD for shipments, status updates, and public tracking.
- **Drivers**: Driver management and profile access.
- **Dockerized**: Easy setup with Docker Compose.

## Prerequisites

- Docker and Docker Compose installed.

## Getting Started

1.  **Clone the repository** (if you haven't already).

2.  **Navigate to the backend directory**:
    ```bash
    cd logitrack-backend
    ```

3.  **Start the application**:
    ```bash
    docker-compose up --build
    ```

    This will start the backend server on port `5000` and MongoDB on port `27017`.

4.  **Access the API**:
    The API will be available at `http://localhost:5000`.

## Default Credentials

On the first run, the database will be seeded with the following users:

-   **Admin**: `admin@logitrack.com` / `password123`
-   **Driver 1**: `abebe@logitrack.com` / `password123`
-   **Driver 2**: `bekele@logitrack.com` / `password123`

## API Endpoints

### Auth
-   `POST /api/auth/login` - Login
-   `POST /api/auth/refresh-token` - Refresh access token
-   `POST /api/auth/logout` - Logout

### Shipments
-   `GET /api/shipments` - Get all shipments (Admin) or assigned shipments (Driver)
-   `POST /api/shipments` - Create shipment (Admin)
-   `GET /api/shipments/:id` - Get shipment details
-   `PATCH /api/shipments/:id/status` - Update status (Admin/Driver)
-   `GET /api/shipments/track/:trackingNumber` - Public tracking

### Drivers
-   `GET /api/drivers` - Get all drivers (Admin)
-   `POST /api/drivers` - Create driver (Admin)
-   `GET /api/drivers/me` - Get current driver profile

## Environment Variables

See `.env.example` for available configuration options.
