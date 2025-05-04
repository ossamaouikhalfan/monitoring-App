import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Server, ChevronDown, ChevronRight, ExternalLink, Settings, LogOut, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SettingsModal } from '../pages/Settings';
import { equipmentStatus } from '../data/equipmentStatus';

export function Layout({ children }: { children: React.ReactNode }) {
  const [showEquipment, setShowEquipment] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUM6PHovered, setIsUM6PHovered] = useState(false);
  const { logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="fixed top-0 right-0 p-4 z-50">
        <a
          href="https://um6p.ma/"
          target="_blank"
          rel="noopener noreferrer"
          className="relative group"
          onMouseEnter={() => setIsUM6PHovered(true)}
          onMouseLeave={() => setIsUM6PHovered(false)}
        >
          <div className="bg-orange-600 p-2 rounded-lg shadow-md hover:bg-orange-700 transition-colors">
            <img
              src="https://um6p.ma/sites/default/files/logo-wwhite.png"
              alt="UM6P Logo"
              className="h-8 invert"
            />
          </div>
          <div 
            className={`absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg py-2 px-4 flex items-center transition-all duration-200 ${
              isUM6PHovered ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
            }`}
          >
            <span className="whitespace-nowrap text-gray-800 font-medium mr-2">Site UM6P</span>
            <ExternalLink size={16} className="text-gray-600" />
          </div>
        </a>
      </div>

      <div className="flex">
        <div 
          className={`fixed top-0 left-0 h-screen bg-white shadow-lg transition-all duration-300 ease-in-out z-50
            ${isHovered ? 'w-64' : 'w-16'}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="p-4 h-full flex flex-col">
            <div className={`flex-1 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/')}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-orange-100 flex items-center space-x-2 mb-2"
                >
                  <Home size={20} className="text-orange-600" />
                  <span>Accueil</span>
                </button>
                
                <div>
                  <button
                    onClick={() => setShowEquipment(!showEquipment)}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-orange-100 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <Server size={20} className="text-orange-600" />
                      <span>ÉQUIPEMENT</span>
                    </div>
                    {showEquipment ? <ChevronDown size={20} className="text-orange-600" /> : <ChevronRight size={20} className="text-orange-600" />}
                  </button>
                  
                  {showEquipment && (
                    <div className="ml-4 mt-2 space-y-4">
                      {Object.entries(equipmentStatus).map(([location, locationData]) => (
                        <div key={location} className="space-y-2">
                          <div className="flex items-center space-x-2 px-2">
                            <MapPin size={16} className="text-orange-600" />
                            <span className="font-medium text-sm">{locationData.name}</span>
                          </div>
                          <div className="ml-4 space-y-1">
                            {Object.entries(locationData.equipment).map(([eq, equipment]) => (
                              <button
                                key={`${location}-${eq}`}
                                onClick={() => navigate(`/equipment/${location}/${eq}`)}
                                className="w-full text-left px-4 py-2 rounded-lg hover:bg-orange-100 flex items-center space-x-2"
                              >
                                <equipment.icon size={16} className="text-orange-600" />
                                <span>{eq}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-2">
              {isAdmin && (
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className={`w-full px-4 py-2 text-gray-700 hover:bg-orange-100 rounded-lg flex items-center space-x-2 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Settings size={20} className="text-orange-600" />
                  <span>Paramètres</span>
                </button>
              )}

              <button
                onClick={handleLogout}
                className={`w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-2 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <LogOut size={20} />
                <span>Déconnexion</span>
              </button>
            </div>
            
            <div className={`transition-opacity duration-200 ${isHovered ? 'opacity-0' : 'opacity-100'} fixed left-0 top-0 p-4`}>
              <div className="space-y-4">
                <Home size={20} className="text-orange-600" />
                <Server size={20} className="text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className={`flex-1 transition-all duration-300 ${isHovered ? 'ml-64' : 'ml-16'}`}>
          {children}
        </div>
      </div>

      {isAdmin && <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />}
    </div>
  );
}