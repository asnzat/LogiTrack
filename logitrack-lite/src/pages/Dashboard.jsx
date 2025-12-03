import React, { useEffect, useState } from 'react';
import { Package, Truck, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { shipmentService } from '../services/api';
import { cn } from '../utils/cn';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            </div>
            <div className={cn("p-3 rounded-lg", color)}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
        {trend && (
            <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-medium">+{trend}%</span>
                <span className="text-gray-500 ml-2">from last month</span>
            </div>
        )}
    </div>
);

const StatusBadge = ({ status }) => {
    const styles = {
        'Pending': 'bg-yellow-100 text-yellow-800',
        'In Transit': 'bg-blue-100 text-blue-800',
        'Delivered': 'bg-green-100 text-green-800',
        'Delayed': 'bg-red-100 text-red-800',
    };

    return (
        <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", styles[status] || styles['Pending'])}>
            {status}
        </span>
    );
};

const Dashboard = () => {
    const [stats, setStats] = useState({
        total: 0,
        inTransit: 0,
        delivered: 0,
        delayed: 0
    });
    const [recentShipments, setRecentShipments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await shipmentService.getAll();

                setStats({
                    total: data.length,
                    inTransit: data.filter(s => s.status === 'In Transit').length,
                    delivered: data.filter(s => s.status === 'Delivered').length,
                    delayed: data.filter(s => s.status === 'Delayed').length,
                });

                setRecentShipments(data.slice(0, 5));
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Shipments"
                    value={stats.total}
                    icon={Package}
                    color="bg-primary-500"
                    trend="12"
                />
                <StatCard
                    title="In Transit"
                    value={stats.inTransit}
                    icon={Truck}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Delivered"
                    value={stats.delivered}
                    icon={CheckCircle}
                    color="bg-green-500"
                />
                <StatCard
                    title="Delayed"
                    value={stats.delayed}
                    icon={AlertTriangle}
                    color="bg-red-500"
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Shipments</h2>
                    <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                        View All
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-900 font-medium">
                            <tr>
                                <th className="px-6 py-3">Tracking ID</th>
                                <th className="px-6 py-3">Sender</th>
                                <th className="px-6 py-3">Destination</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">ETA</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentShipments.map((shipment) => (
                                <tr key={shipment.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{shipment.id}</td>
                                    <td className="px-6 py-4">{shipment.sender}</td>
                                    <td className="px-6 py-4">{shipment.destination}</td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={shipment.status} />
                                    </td>
                                    <td className="px-6 py-4">{shipment.eta}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
