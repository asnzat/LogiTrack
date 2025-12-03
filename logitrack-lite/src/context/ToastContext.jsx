import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '../utils/cn';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            removeToast(id);
        }, 3000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 space-y-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={cn(
                            "flex items-center w-full max-w-xs p-4 rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 transition-all duration-300 transform translate-y-0 opacity-100",
                            toast.type === 'success' ? "bg-white text-gray-500" : "",
                            toast.type === 'error' ? "bg-white text-gray-500" : "",
                            toast.type === 'info' ? "bg-white text-gray-500" : ""
                        )}
                        role="alert"
                    >
                        <div className={cn(
                            "inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg",
                            toast.type === 'success' ? "text-green-500 bg-green-100" : "",
                            toast.type === 'error' ? "text-red-500 bg-red-100" : "",
                            toast.type === 'info' ? "text-blue-500 bg-blue-100" : ""
                        )}>
                            {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
                            {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
                            {toast.type === 'info' && <Info className="w-5 h-5" />}
                        </div>
                        <div className="ml-3 text-sm font-normal text-gray-800">{toast.message}</div>
                        <button
                            type="button"
                            className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8"
                            onClick={() => removeToast(toast.id)}
                        >
                            <span className="sr-only">Close</span>
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
