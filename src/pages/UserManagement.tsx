import { useState } from 'react';
import { Plus, Trash2, UserCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

export function UserManagement() {
  const { users, createUser, deleteUser } = useAuth();
  const [newUserForm, setNewUserForm] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newUserForm.password !== newUserForm.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (newUserForm.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      createUser(newUserForm.username, newUserForm.password);
      toast.success('Utilisateur créé avec succès');
      setNewUserForm({
        username: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteUser = (username: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${username} ?`)) {
      deleteUser(username);
      toast.success('Utilisateur supprimé avec succès');
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Gestion des Utilisateurs</h3>
      
      {/* Create New User */}
      <form onSubmit={handleCreateUser} className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom d'utilisateur
          </label>
          <input
            type="text"
            value={newUserForm.username}
            onChange={(e) => setNewUserForm(prev => ({ ...prev, username: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe
          </label>
          <input
            type="password"
            value={newUserForm.password}
            onChange={(e) => setNewUserForm(prev => ({ ...prev, password: e.target.value }))}
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
            value={newUserForm.confirmPassword}
            onChange={(e) => setNewUserForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Plus size={20} />
          <span>Créer un utilisateur</span>
        </button>
      </form>

      {/* User List */}
      <div>
        <h4 className="text-lg font-medium text-gray-700 mb-4">Liste des utilisateurs</h4>
        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user.username}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <UserCheck size={20} className="text-gray-500" />
                <span className="font-medium">{user.username}</span>
              </div>
              <button
                onClick={() => handleDeleteUser(user.username)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          {users.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Aucun utilisateur créé
            </p>
          )}
        </div>
      </div>
    </div>
  );
}