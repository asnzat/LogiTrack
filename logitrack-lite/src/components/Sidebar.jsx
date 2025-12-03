import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Truck, User, LogOut, Map } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { cn } from '../utils/cn';

const Sidebar = () => {
    const { user, logout } = useAuthStore();

    const links = [
        { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, roles: ['admin'] },
        { name: 'Shipments', to: '/shipments', icon: Package, roles: ['admin'] },
        { name: 'Driver Panel', to: '/driver', icon: Truck, roles: ['driver'] },
        { name: 'Track Package', to: '/track', icon: Map, roles: ['admin', 'driver', 'public'] }, // Public can't see sidebar usually, but good to have
        { name: 'Profile', to: '/profile', icon: User, roles: ['admin', 'driver'] },
    ];

    const filteredLinks = links.filter(link =>
        !link.roles || (user && link.roles.includes(user.role))
    );

    return (
        <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-primary-600 flex items-center gap-2">
                    <Truck className="w-8 h-8" />
                    LogiTrack
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {filteredLinks.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                isActive
                                    ? "bg-primary-50 text-primary-700 font-medium"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )
                        }
                    >
                        <link.icon className="w-5 h-5" />
                        {link.name}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate capitalize">{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
