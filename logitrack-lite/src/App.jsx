import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Shipments from './pages/Shipments';
import NewShipment from './pages/NewShipment';
import ShipmentDetails from './pages/ShipmentDetails';
import DriverDashboard from './pages/DriverDashboard';
import Tracking from './pages/Tracking';
import Profile from './pages/Profile';
import useAuthStore from './store/useAuthStore';
import { ToastProvider } from './context/ToastContext';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'driver' ? '/driver' : '/dashboard'} replace />;
  }

  return children;
};

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/track" element={<Tracking />} />
          <Route path="/track/:trackingNo" element={<Tracking />} />

          {/* Protected Routes wrapped in Layout */}
          <Route element={<Layout />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shipments"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Shipments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shipments/new"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <NewShipment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shipments/:id"
              element={
                <ProtectedRoute allowedRoles={['admin', 'driver']}>
                  <ShipmentDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver"
              element={
                <ProtectedRoute allowedRoles={['driver']}>
                  <DriverDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['admin', 'driver']}>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch all - redirect based on auth status */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
