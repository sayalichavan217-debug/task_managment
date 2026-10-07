import React from 'react';
import { useBoard } from '../../context/BoardContext';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useBoard();

  if (!toasts.length) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} color="#10B981" />;
      case 'warning':
        return <AlertTriangle size={18} color="#EF4444" />;
      case 'info':
      default:
        return <Info size={18} color="#3B82F6" />;
    }
  };

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast-item">
          <div className="toast-icon">{getIcon(toast.type)}</div>
          <div className="toast-content">
            <span className="toast-title">{toast.title}</span>
            <span className="toast-message">{toast.message}</span>
          </div>
          <button
            className="toast-close-btn"
            onClick={() => removeToast(toast.id)}
            title="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
