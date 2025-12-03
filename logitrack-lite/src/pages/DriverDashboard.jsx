import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, MapPin, Clock, CheckCircle } from 'lucide-react';
import { shipmentService } from '../services/api';
import useAuthStore from '../store/useAuthStore';
import { useToast } from '../context/ToastContext';
import { cn } from '../utils/cn';

const DriverShipmentCard = ({ shipment, onStatusUpdate }) => {
    const statusColors = {
        'Pending': 'bg-yellow-100 text-yellow-800',
        'In Transit': 'bg-blue-100 text-blue-800',
        'Delivered': 'bg-green-100 text-green-800',
        'Delayed': 'bg-red-100 text-red-800',
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className="text-xs font-medium text-gray-500">ID: {shipment.id}</span>
                    <h3 className="text-lg font-bold text-gray-900 mt-1">{shipment.receiver}</h3>
                </div>
                <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", statusColors[shipment.status] || statusColors['Pending'])}>
                    {shipment.status}
                </span>
            </div>

            <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-xs text-gray-500">Destination</p>
                        <p className="text-sm font-medium text-gray-900">{shipment.destination}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-xs text-gray-500">ETA</p>
                        <p className="text-sm font-medium text-gray-900">{shipment.eta}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-100">
                <Link
                    to={`/shipments/${shipment.id}`}
                    className="block w-full text-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                    View Details
                </Link>

                {shipment.status !== 'Delivered' && (
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => onStatusUpdate(shipment.id, 'In Transit')}
                            className="flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                        >
                            <Truck className="w-4 h-4 mr-1" />
                            Transit
                        </button>
                        <button
                            onClick={() => onStatusUpdate(shipment.id, 'Delivered')}
                            className="flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                        >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Deliver
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const DriverDashboard = () => {
    const { user } = useAuthStore();
    const { addToast } = useToast();
    const [shipments, setShipments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchShipments = async () => {
        try {
            // In a real app, we'd filter by logged-in driver ID
            // For mock, we'll just fetch all and filter client-side or use a specific mock endpoint
            const data = await shipmentService.getByDriver(user?.id || 2);
            setShipments(data);
        } catch (error) {
            console.error('Failed to fetch driver shipments', error);
            addToast('Failed to load shipments', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchShipments();
    }, [user]);

    const handleStatusUpdate = async (id, status) => {
        try {
            await shipmentService.updateStatus(id, status);
            addToast(`Status updated to ${status}`, 'success');
            // Refresh list
            fetchShipments();
        } catch (error) {
            console.error('Failed to update status', error);
            addToast('Failed to update status', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">My Shipments</h1>
                <p className="text-gray-500">Manage your assigned deliveries</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
            ) : shipments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {shipments.map(shipment => (
                        <DriverShipmentCard
                            key={shipment.id}
                            shipment={shipment}
                            onStatusUpdate={handleStatusUpdate}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                    <Truck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No shipments assigned</h3>
                    <p className="text-gray-500 mt-1">You don't have any active deliveries right now.</p>
                </div>
            )}
        </div>
    );
};

export default DriverDashboard;
