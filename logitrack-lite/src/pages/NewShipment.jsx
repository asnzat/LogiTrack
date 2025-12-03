import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { shipmentService } from '../services/api';

import { useToast } from '../context/ToastContext';

const NewShipment = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            // Map form data to backend schema
            const shipmentData = {
                senderName: data.senderName,
                senderPhone: data.senderPhone || '',
                senderAddress: data.senderAddress,
                receiverName: data.receiverName,
                receiverPhone: data.receiverPhone || '',
                receiverAddress: data.receiverAddress,
                packageDescription: data.packageDescription || '',
                weight: data.weight ? parseFloat(data.weight) : undefined,
                eta: data.eta,
                driver: data.driver || undefined, // MongoDB ObjectId reference
            };
            await shipmentService.create(shipmentData);
            addToast('Shipment created successfully!', 'success');
            navigate('/shipments');
        } catch (error) {
            console.error('Failed to create shipment', error);
            addToast('Failed to create shipment', 'error');
        } finally {
            setIsLoading(false);
        }
    };

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
                    <h1 className="text-2xl font-bold text-gray-900">New Shipment</h1>
                    <p className="text-gray-500">Create a new shipment order</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Sender Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Sender Details</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Sender Name</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                                    {...register('senderName', { required: 'Sender name is required' })}
                                />
                                {errors.senderName && <p className="mt-1 text-sm text-red-600">{errors.senderName.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Sender Phone</label>
                                <input
                                    type="tel"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                                    {...register('senderPhone')}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Sender Address</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                                    {...register('senderAddress', { required: 'Sender address is required' })}
                                />
                                {errors.senderAddress && <p className="mt-1 text-sm text-red-600">{errors.senderAddress.message}</p>}
                            </div>
                        </div>

                        {/* Receiver Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Receiver Details</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Receiver Name</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                                    {...register('receiverName', { required: 'Receiver name is required' })}
                                />
                                {errors.receiverName && <p className="mt-1 text-sm text-red-600">{errors.receiverName.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Receiver Phone</label>
                                <input
                                    type="tel"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                                    {...register('receiverPhone')}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Receiver Address</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                                    {...register('receiverAddress', { required: 'Receiver address is required' })}
                                />
                                {errors.receiverAddress && <p className="mt-1 text-sm text-red-600">{errors.receiverAddress.message}</p>}
                            </div>
                        </div>

                        {/* Shipment Details */}
                        <div className="space-y-4 md:col-span-2">
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Shipment Details</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Package Description</label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                                        {...register('packageDescription')}
                                        placeholder="e.g., Electronics, Documents, etc."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                                        {...register('weight')}
                                        placeholder="0.0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Estimated Delivery (ETA)</label>
                                    <input
                                        type="date"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                                        {...register('eta', { required: 'ETA is required' })}
                                    />
                                    {errors.eta && <p className="mt-1 text-sm text-red-600">{errors.eta.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Assign Driver (Optional)</label>
                                    <select
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                                        {...register('driver')}
                                    >
                                        <option value="">Select a driver...</option>
                                        {/* In a real app, we'd fetch drivers list from backend */}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Create Shipment
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewShipment;
