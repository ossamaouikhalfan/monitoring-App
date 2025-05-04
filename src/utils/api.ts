const API_URL = 'http://localhost:5001';
const FLASK_API_URL = 'http://localhost:5000';

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Une erreur est survenue');
  }

  return response.json();
}

export const api = {
  auth: {
    login: async (username: string, password: string) => {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch(`${API_URL}/token`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erreur lors de la connexion');
      }

      return response.json();
    },
  },
  users: {
    getAll: () => fetchWithAuth('/users'),
    create: (username: string, password: string) => 
      fetchWithAuth('/users', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }),
    delete: (username: string) => 
      fetchWithAuth(`/users/${username}`, {
        method: 'DELETE',
      }),
  },
  admin: {
    updateCredentials: (username: string, password: string) =>
      fetchWithAuth('/admin/credentials', {
        method: 'PUT',
        body: JSON.stringify({ username, password }),
      }),
  },
  equipment: {
    getISEData: async () => {
      const response = await fetch(`${FLASK_API_URL}/api/ise/benguerir`);
      if (!response.ok) {
        throw new Error('Failed to fetch ISE data');
      }
      return response.json();
    }
  }
};