import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Eye } from 'lucide-react';
import { shipmentService } from '../services/api';
import { cn } from '../utils/cn';

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

const Shipments = () => {
    const [shipments, setShipments] = useState([]);
    const [filteredShipments, setFilteredShipments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        const fetchShipments = async () => {
            try {
                const data = await shipmentService.getAll();
                setShipments(data);
                setFilteredShipments(data);
            } catch (error) {
                console.error('Failed to fetch shipments', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchShipments();
    }, []);

    useEffect(() => {
        let result = shipments;

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(s =>
                s.id.toLowerCase().includes(lowerTerm) ||
                s.sender.toLowerCase().includes(lowerTerm) ||
                s.receiver.toLowerCase().includes(lowerTerm)
            );
        }

        if (statusFilter !== 'All') {
            result = result.filter(s => s.status === statusFilter);
        }

        setFilteredShipments(result);
    }, [searchTerm, statusFilter, shipments]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Shipments</h1>
                    <p className="text-gray-500">Manage and track all shipments</p>
                </div>
                <Link
                    to="/shipments/new"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    New Shipment
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by ID, Sender, or Receiver..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="sm:w-48">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Filter className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                className="block w-full pl-10 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="All">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="In Transit">In Transit</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Delayed">Delayed</option>
                            </select>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-900 font-medium">
                                <tr>
                                    <th className="px-6 py-3">Tracking ID</th>
                                    <th className="px-6 py-3">Sender</th>
                                    <th className="px-6 py-3">Receiver</th>
                                    <th className="px-6 py-3">Origin</th>
                                    <th className="px-6 py-3">Destination</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredShipments.length > 0 ? (
                                    filteredShipments.map((shipment) => (
                                        <tr key={shipment.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">{shipment.id}</td>
                                            <td className="px-6 py-4">{shipment.sender}</td>
                                            <td className="px-6 py-4">{shipment.receiver}</td>
                                            <td className="px-6 py-4">{shipment.origin}</td>
                                            <td className="px-6 py-4">{shipment.destination}</td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={shipment.status} />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    to={`/shipments/${shipment.id}`}
                                                    className="text-primary-600 hover:text-primary-900 inline-flex items-center"
                                                >
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                            No shipments found matching your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Shipments;
