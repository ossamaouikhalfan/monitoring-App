import { CheckCircle2, AlertCircle, Activity } from 'lucide-react';

export const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'online':
    case 'connected':
      return <CheckCircle2 className="text-green-500" size={24} />;
    case 'warning':
    case 'disconnected':
      return <AlertCircle className="text-yellow-500" size={24} />;
    case 'error':
      return <AlertCircle className="text-red-500" size={24} />;
    default:
      return <Activity className="text-blue-500" size={24} />;
  }
};

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'online':
    case 'connected':
      return 'bg-green-50 border-green-500 text-green-700';
    case 'warning':
    case 'disconnected':
      return 'bg-yellow-50 border-yellow-500 text-yellow-700';
    case 'error':
      return 'bg-red-50 border-red-500 text-red-700';
    default:
      return 'bg-blue-50 border-blue-500 text-blue-700';
  }
};

export const renderParameterValue = (param: string, value: string | { value: string; status: 'Connected' | 'Disconnected' }) => {
  if (typeof value === 'string') {
    return (
      <span className="text-gray-800 font-semibold px-4 py-1 bg-white rounded-md shadow-sm">
        {value}
      </span>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-gray-800 font-semibold px-4 py-1 bg-white rounded-md shadow-sm flex-1">
        {value.value}
      </span>
      <div className={`px-3 py-1 rounded-full flex items-center space-x-1 ${
        value.status === 'Connected' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
      }`}>
        {getStatusIcon(value.status)}
        <span className="text-sm font-medium">{value.status}</span>
      </div>
    </div>
  );
};