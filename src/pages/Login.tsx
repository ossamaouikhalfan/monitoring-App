import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const images = [
  "https://um6p.ma/sites/default/files/UM6P.jpg",
  "https://www.lavieeco.com/wp-content/uploads/2024/10/UM6P.jpg",
  "https://cdn2.hubspot.net/hubfs/6994178/Pictures/Learning%20Center/UM6P_Campus_Ben-Guerir_Learning_Center_09.jpg",
  "https://www.um6p.ma/sites/default/files/2021-08/explorer.jpg",
  "https://www.shbm-um6p.ma/hs-fs/hubfs/Pictures/Auditorium/UM6P_Campus_Ben-Guerir_Auditorium_03.jpg?width=5616&height=3744&name=UM6P_Campus_Ben-Guerir_Auditorium_03.jpg"
];

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const navigate = useNavigate();
  const { login, error } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(formData.username, formData.password);
      navigate('/');
    } catch (err) {
      toast.error(error || "Une erreur est survenue lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex">
      {/* Full-screen Image Background */}
      <div className="fixed inset-0 z-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`UM6P Campus ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex w-full">
        {/* Left Side - Welcome Text */}
        <div className="hidden lg:flex w-2/3 items-center justify-center p-12">
          <div className="text-white">
            <h1 className="text-6xl font-black mb-6" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
              Système de Supervision IT 
            </h1>
            <p className="text-3xl font-light" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
            Plateforme de surveillance en temps réel des équipements IT critiques
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/3 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
              <div className="text-center mb-8">
                <img
                  src="https://um6p.ma/sites/default/files/logo-wwhite.png"
                  alt="UM6P Logo"
                  className="h-16 mx-auto mb-6 invert"
                />
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Connexion</h2>
                <p className="text-gray-600">
                  Connectez-vous en tant qu'utilisateur ou administrateur
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium text-gray-700 block">
                    Nom d'utilisateur
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-3 text-gray-900 rounded-lg border border-gray-300
                        focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      placeholder="Entrez votre nom d'utilisateur"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-3 text-gray-900 rounded-lg border border-gray-300
                        focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      placeholder="Entrez votre mot de passe"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-lg
                    hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium
                    transform hover:scale-[1.02] active:scale-[0.98] ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Système de supervision<br />
                  Université Mohammed VI Polytechnique
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}