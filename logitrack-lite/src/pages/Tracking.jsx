import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Search, Package, MapPin, Calendar, ArrowRight, Truck, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { shipmentService } from '../services/api';
import { cn } from '../utils/cn';

const TrackingTimeline = ({ status }) => {
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

const Tracking = () => {
    const { trackingNo } = useParams();
    const navigate = useNavigate();
    const [inputId, setInputId] = useState(trackingNo || '');
    const [shipment, setShipment] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (trackingNo) {
            handleTrack(trackingNo);
        }
    }, [trackingNo]);

    const handleTrack = async (id) => {
        setIsLoading(true);
        setError('');
        setShipment(null);
        try {
            const data = await shipmentService.getById(id);
            setShipment(data);
        } catch (err) {
            setError('Tracking number not found. Please check and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputId.trim()) {
            navigate(`/track/${inputId.trim()}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Truck className="w-8 h-8 text-primary-600" />
                        <span className="text-xl font-bold text-gray-900">LogiTrack</span>
                    </div>
                    <Link to="/" className="text-sm font-medium text-gray-500 hover:text-gray-900">
                        Login
                    </Link>
                </div>
            </div>

            <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Shipment</h1>
                    <p className="text-gray-500">Enter your tracking ID to see the current status of your delivery.</p>
                </div>

                <form onSubmit={handleSubmit} className="mb-12">
                    <div className="relative flex items-center max-w-lg mx-auto">
                        <input
                            type="text"
                            placeholder="Enter Tracking ID (e.g., TRK-001)"
                            className="block w-full rounded-full border-gray-300 pl-6 pr-14 py-4 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-lg"
                            value={inputId}
                            onChange={(e) => setInputId(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="absolute right-2 p-2 bg-primary-600 rounded-full text-white hover:bg-primary-700 transition-colors"
                        >
                            <ArrowRight className="w-6 h-6" />
                        </button>
                    </div>
                </form>

                {isLoading && (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center text-red-600">
                        {error}
                    </div>
                )}

                {shipment && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 bg-primary-50 border-b border-primary-100">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-primary-700 font-medium mb-1">Tracking ID</p>
                                    <h2 className="text-2xl font-bold text-gray-900">{shipment.id}</h2>
                                </div>
                                <div className={cn("px-3 py-1 rounded-full text-sm font-medium",
                                    shipment.status === 'Delayed' ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                                )}>
                                    {shipment.status}
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <TrackingTimeline status={shipment.status} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Origin</p>
                                            <p className="text-base text-gray-900">{shipment.origin}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-primary-500 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Destination</p>
                                            <p className="text-base text-gray-900">{shipment.destination}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Estimated Delivery</p>
                                            <p className="text-base text-gray-900">{shipment.eta}</p>
                                        </div>
                                    </div>
                                    {shipment.status === 'Delayed' && (
                                        <div className="flex items-start gap-3 text-red-600">
                                            <AlertTriangle className="w-5 h-5 mt-1" />
                                            <div>
                                                <p className="text-sm font-medium">Shipment Delayed</p>
                                                <p className="text-sm">Please check back later for updates.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tracking;
