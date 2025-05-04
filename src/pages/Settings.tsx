import { useState } from 'react';
import { X, UserCog, Settings as SettingsIcon } from 'lucide-react';
import { AdminSettings } from './AdminSettings';
import { UserManagement } from './UserManagement';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'admin' | 'users'>('admin');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[800px] max-h-[80vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-2xl font-bold mb-6">Paramètres</h2>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'admin'
                ? 'bg-orange-100 text-orange-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <SettingsIcon size={20} />
            <span>Paramètres Administrateur</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'users'
                ? 'bg-orange-100 text-orange-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <UserCog size={20} />
            <span>Gestion des Utilisateurs</span>
          </button>
        </div>

        <div className="mt-6">
          {activeTab === 'admin' ? <AdminSettings /> : <UserManagement />}
        </div>
      </div>
    </div>
  );
}