import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, User, Truck, CheckCircle, Clock } from 'lucide-react';
import { shipmentService } from '../services/api';
import useAuthStore from '../store/useAuthStore';
import { useToast } from '../context/ToastContext';
import { cn } from '../utils/cn';

const StatusTimeline = ({ status }) => {
    const steps = ['Pending', 'In Transit', 'Delivered'];
    const currentStepIndex = steps.indexOf(status) === -1 ? 0 : steps.indexOf(status);
    const isDelayed = status === 'Delayed';

    return (
        <div className="relative flex items-center justify-between w-full mt-8 mb-8">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
            <div
                className={cn("absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-primary-500 -z-10 transition-all duration-500", isDelayed ? "bg-red-500" : "bg-primary-500")}
                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
            ></div>

            {steps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                    <div key={step} className="flex flex-col items-center bg-white px-2">
                        <div
                            className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300",
                                isCompleted
                                    ? (isDelayed && isCurrent ? "bg-red-100 border-red-500 text-red-600" : "bg-primary-100 border-primary-500 text-primary-600")
                                    : "bg-white border-gray-300 text-gray-400"
                            )}
                        >
                            {index === 0 && <Clock className="w-4 h-4" />}
                            {index === 1 && <Truck className="w-4 h-4" />}
                            {index === 2 && <CheckCircle className="w-4 h-4" />}
                        </div>
                        <span className={cn("text-xs font-medium mt-2", isCurrent ? "text-gray-900" : "text-gray-500")}>
                            {step}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

const ShipmentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { addToast } = useToast();
    const [shipment, setShipment] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchShipment = async () => {
            try {
                const data = await shipmentService.getById(id);
                setShipment(data);
            } catch (err) {
                setError('Shipment not found');
            } finally {
                setIsLoading(false);
            }
        };

        fetchShipment();
    }, [id]);

    const handleStatusUpdate = async (newStatus) => {
        try {
            const updatedShipment = await shipmentService.updateStatus(id, newStatus);
            setShipment(updatedShipment);
            addToast(`Status updated to ${newStatus}`, 'success');
        } catch (err) {
            console.error('Failed to update status', err);
            addToast('Failed to update status', 'error');
        }
    };

    if (isLoading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>;
    if (error) return <div className="text-center p-12 text-red-600">{error}</div>;
    if (!shipment) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Shipment {shipment.id}</h1>
                    <p className="text-gray-500">View and manage shipment details</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Tracking Status</h2>
                        <StatusTimeline status={shipment.status} />

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500 mb-1">Current Status</p>
                                <p className={cn("text-lg font-bold",
                                    shipment.status === 'Delayed' ? "text-red-600" : "text-primary-600"
                                )}>
                                    {shipment.status}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500 mb-1">Estimated Delivery</p>
                                <p className="text-lg font-bold text-gray-900">{shipment.eta}</p>
                            </div>
                        </div>

                        {/* Status Actions for Admin/Driver */}
                        {(user?.role === 'admin' || (user?.role === 'driver' && shipment.driverId === user.id)) && (
                            <div className="mt-8 border-t border-gray-100 pt-6">
                                <p className="text-sm font-medium text-gray-700 mb-3">Update Status</p>
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={() => handleStatusUpdate('Pending')}
                                        className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700"
                                    >
                                        Pending
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate('In Transit')}
                                        className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                                    >
                                        In Transit
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate('Delivered')}
                                        className="px-4 py-2 text-sm font-medium rounded-lg bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                                    >
                                        Delivered
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate('Delayed')}
                                        className="px-4 py-2 text-sm font-medium rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                                    >
                                        Delayed
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Map Placeholder */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-80 flex flex-col">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Location</h2>
                        <div className="flex-1 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-50 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center"></div>
                            <div className="z-10 text-center">
                                <MapPin className="w-10 h-10 text-primary-500 mx-auto mb-2 animate-bounce" />
                                <p className="text-gray-500 font-medium">Map View Placeholder</p>
                                <p className="text-xs text-gray-400">Google Maps / Leaflet integration would go here</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipment Details</h2>

                        <div className="space-y-6">
                            <div className="flex items-start gap-3">
                                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Sender</p>
                                    <p className="text-sm text-gray-600">{shipment.sender}</p>
                                    <p className="text-xs text-gray-500 mt-1">{shipment.origin}</p>
                                </div>
                            </div>

                            <div className="relative pl-2.5">
                                <div className="absolute left-0 top-2 bottom-0 w-px bg-gray-200"></div>
                                <div className="space-y-6 pl-6">
                                    <div className="flex items-start gap-3">
                                        <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Receiver</p>
                                            <p className="text-sm text-gray-600">{shipment.receiver}</p>
                                            <p className="text-xs text-gray-500 mt-1">{shipment.destination}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4 mt-4">
                                <div className="flex items-start gap-3">
                                    <Truck className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Assigned Driver</p>
                                        <p className="text-sm text-gray-600">{shipment.driverId ? `Driver #${shipment.driverId}` : 'Unassigned'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Created At</p>
                                        <p className="text-sm text-gray-600">Nov 28, 2023</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShipmentDetails;
