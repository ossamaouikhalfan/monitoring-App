import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../utils/api';

interface User {
  id: number;
  username: string;
  is_admin: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  currentUsername: string;
  users: User[];
  createUser: (username: string, password: string) => Promise<void>;
  deleteUser: (username: string) => Promise<void>;
  updateAdminCredentials: (newUsername: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUsername, setCurrentUsername] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    if (token) {
      setIsAuthenticated(true);
      setIsAdmin(userRole === 'admin');
      setCurrentUsername(localStorage.getItem('username') || '');
      
      // Charger la liste des utilisateurs si admin
      if (userRole === 'admin') {
        loadUsers();
      }
    }
  }, []);

  const loadUsers = async () => {
    try {
      const users = await api.users.getAll();
      setUsers(users);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      setError(null);
      const response = await api.auth.login(username, password);
      
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('userRole', response.is_admin ? 'admin' : 'user');
      localStorage.setItem('username', username);
      
      setIsAuthenticated(true);
      setIsAdmin(response.is_admin);
      setCurrentUsername(username);

      if (response.is_admin) {
        await loadUsers();
      }
    } catch (err: any) {
      const errorMessage = err.message || "Une erreur est survenue lors de la connexion";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const createUser = async (username: string, password: string) => {
    if (isAdmin) {
      await api.users.create(username, password);
      await loadUsers();
    }
  };

  const deleteUser = async (username: string) => {
    if (isAdmin) {
      await api.users.delete(username);
      await loadUsers();
    }
  };

  const updateAdminCredentials = async (newUsername: string, newPassword: string) => {
    if (isAdmin) {
      await api.admin.updateCredentials(newUsername, newPassword);
      setCurrentUsername(newUsername);
      localStorage.setItem('username', newUsername);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setIsAdmin(false);
    setCurrentUsername('');
    setUsers([]);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isAdmin,
      login, 
      logout, 
      error,
      currentUsername,
      users,
      createUser,
      deleteUser,
      updateAdminCredentials
    }}>
      {children}
    </AuthContext.Provider>
  );
};