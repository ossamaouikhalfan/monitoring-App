import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

export function AdminSettings() {
  const { currentUsername, updateAdminCredentials } = useAuth();
  const [adminForm, setAdminForm] = useState({
    username: currentUsername,
    password: '',
    confirmPassword: ''
  });

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (adminForm.password !== adminForm.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (adminForm.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    updateAdminCredentials(adminForm.username, adminForm.password);
    toast.success('Paramètres administrateur mis à jour avec succès');
    setAdminForm(prev => ({ ...prev, password: '', confirmPassword: '' }));
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Paramètres Administrateur</h3>
      <form onSubmit={handleAdminSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom d'utilisateur
          </label>
          <input
            type="text"
            value={adminForm.username}
            onChange={(e) => setAdminForm(prev => ({ ...prev, username: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nouveau mot de passe
          </label>
          <input
            type="password"
            value={adminForm.password}
            onChange={(e) => setAdminForm(prev => ({ ...prev, password: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirmer le mot de passe
          </label>
          <input
            type="password"
            value={adminForm.confirmPassword}
            onChange={(e) => setAdminForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors"
        >
          Mettre à jour
        </button>
      </form>
    </div>
  );
}