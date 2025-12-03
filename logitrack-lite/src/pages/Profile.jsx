import React from 'react';
import { User, Mail, Shield, LogOut } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const Profile = () => {
    const { user, logout } = useAuthStore();

    if (!user) return null;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-500">Manage your account settings</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-2xl font-bold">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                        <p className="text-gray-500 capitalize">{user.role}</p>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <Mail className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Email Address</p>
                            <p className="text-gray-900">{user.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <Shield className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Role</p>
                            <p className="text-gray-900 capitalize">{user.role}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={logout}
                        className="flex items-center justify-center w-full px-4 py-2 border border-red-200 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
