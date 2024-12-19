import React from 'react';
import { AlertCircle, XCircle, Info } from 'lucide-react';

type AlertType = 'error' | 'info' | 'warning';

interface AlertProps {
  type: AlertType;
  message: string;
  details?: string;
  onDismiss?: () => void;
}

const alertStyles = {
  error: 'bg-red-50 text-red-800 border-red-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
};

const icons = {
  error: XCircle,
  info: Info,
  warning: AlertCircle,
};

export const Alert: React.FC<AlertProps> = ({ type, message, details, onDismiss }) => {
  const Icon = icons[type];
  
  return (
    <div className={`p-4 rounded-lg border ${alertStyles[type]} mb-4`}>
      <div className="flex items-start">
        <Icon className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-medium">{message}</h3>
          {details && <p className="mt-1 text-sm opacity-90">{details}</p>}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-3 flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
          >
            <XCircle className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};