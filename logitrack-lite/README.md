# LogiTrack Lite - Frontend

A modern, responsive frontend for the LogiTrack Lite logistics management system. Built with React, Vite, and TailwindCSS.

## Features

- **Authentication**: Secure login and registration with JWT tokens
- **Role-Based Access**: Different dashboards for Admin and Driver roles
- **Shipment Management**: Create, view, and track shipments
- **Real-Time Tracking**: Public tracking page for customers
- **Responsive Design**: Mobile-friendly interface with TailwindCSS
- **State Management**: Zustand for global state management
- **Form Validation**: React Hook Form for robust form handling

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Zustand** - Lightweight state management
- **React Hook Form** - Form validation and handling
- **Lucide React** - Icon library

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:5000`

## Getting Started

1. **Navigate to the frontend directory**:
   ```bash
   cd logitrack-lite
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

4. **Build for production**:
   ```bash
   npm run build
   ```

## Demo Credentials

The backend is seeded with the following demo accounts:

- **Admin**: `admin@logitrack.com` / `password123`
- **Driver 1**: `abebe@logitrack.com` / `password123`
- **Driver 2**: `bekele@logitrack.com` / `password123`

## Project Structure

```
logitrack-lite/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components (Dashboard, Login, etc.)
│   ├── services/       # API service layer
│   ├── store/          # Zustand state management
│   ├── context/        # React context providers
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main app component with routing
│   └── main.jsx        # Application entry point
├── public/             # Static assets
└── index.html          # HTML template
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The frontend communicates with the backend API at `http://localhost:5000/api`. The API base URL can be configured in `src/services/api.js`.

### Authentication Flow

1. User logs in via `/login` or registers via `/register`
2. Backend returns `{ user, accessToken }`
3. Access token is stored in localStorage and sent with each request
4. Refresh token is stored in httpOnly cookie for security

## Features by Role

### Admin Dashboard
- View all shipments
- Create new shipments
- Assign drivers to shipments
- Update shipment status
- View shipment details

### Driver Dashboard
- View assigned shipments
- Update shipment status
- View shipment details
- Track delivery progress

### Public Features
- Track shipments by tracking number
- View shipment timeline and status

## Environment Configuration

The frontend expects the backend to be running on `http://localhost:5000`. To change this, update the `baseURL` in `src/services/api.js`.

## Notes

- Ensure the backend is running before starting the frontend
- The application uses localStorage for user session management
- All API calls include authentication tokens automatically via Axios interceptors
