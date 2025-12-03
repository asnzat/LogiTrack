import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';
import useAuthStore from '../store/useAuthStore';

const Layout = () => {
    const { isAuthenticated } = useAuthStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Redirect to login if not authenticated, except for public pages
    const publicRoutes = ['/', '/track'];
    // Check if current path starts with /track (for /track/:id)
    const isPublicRoute = publicRoutes.includes(location.pathname) || location.pathname.startsWith('/track/');

    if (!isAuthenticated && !isPublicRoute) {
        return <Navigate to="/" replace />;
    }

    // If on login page and authenticated, redirect to dashboard or driver page
    if (isAuthenticated && location.pathname === '/') {
        // We'll handle this redirect logic better in App.jsx or a specific component, 
        // but for layout purposes, we just render.
        // Actually, usually Layout wraps protected pages. Let's assume Layout is for the main app.
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Mobile Header & Overlay */}
            <div className="md:hidden fixed inset-0 z-50 pointer-events-none">
                {/* Mobile Header */}
                <div className="pointer-events-auto bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-primary-600">LogiTrack</h1>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="pointer-events-auto absolute inset-0 top-[65px] bg-gray-800/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="absolute top-0 left-0 w-64 h-full bg-white shadow-xl" onClick={e => e.stopPropagation()}>
                            <Sidebar />
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-auto w-full pt-[65px] md:pt-0">
                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
