import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Server, ChevronDown, ChevronRight, Wifi, Shield, Network, AlertCircle, CheckCircle2, Activity, LogOut, ExternalLink, Settings, ChevronUp, UserCheck, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { SettingsModal } from './Settings';

interface Equipment {
  status: string;
  icon: typeof LucideIcon;
  description: string;
  parameters: Record<string, string | { value: string; status: 'Connected' | 'Disconnected' }>;
}

interface LocationEquipment {
  name: string;
  equipment: Record<string, Equipment>;
}

interface EquipmentStatus {
  [key: string]: LocationEquipment;
}

const equipmentStatus: EquipmentStatus = {
  benguerir: {
    name: "Benguerir",
    equipment: {
      WLC: { 
        status: 'Warning', 
        icon: Wifi,
        description: "Les contrôleurs sans fil (WLC) gèrent de manière centralisée tous les points d'accès WiFi du campus de Benguerir.",
        parameters: {
          'Nombre d\'AP': 'Chargement...',
          'Hot Standby': 'Chargement...'
        }
      },
      Fortigate: { 
        status: 'Warning', 
        icon: Shield,
        description: "Le pare-feu Fortigate assure la sécurité du réseau du campus de Benguerir.",
        parameters: {}
      },
      Panorama: { 
        status: 'Warning', 
        icon: Network,
        description: "Panorama supervise et contrôle l'ensemble des pare-feux du campus de Benguerir.",
        parameters: {}
      },
      ISE: {
        status: 'Online',
        icon: UserCheck,
        description: "Cisco ISE gère l'authentification et l'autorisation des utilisateurs sur le réseau de Benguerir.",
        parameters: {
          'Nœud PAN Principal': { 
            value: 'um6p-ise-pan-01.um6p.ma (10.1.207.61)',
            status: 'Connected'
          },
          'Nœud PAN Secondaire': {
            value: 'um6p-ise-pan-02.um6p.ma (10.13.207.61)',
            status: 'Connected'
          },
          'Nœud PSN Principal': {
            value: 'um6p-ise-psn-01.um6p.ma (10.1.207.63)',
            status: 'Connected'
          },
          'Nœud PSN Secondaire': {
            value: 'um6p-ise-psn-02.um6p.ma (10.1.207.64)',
            status: 'Connected'
          }
        }
      }
    }
  },
  rabat: {
    name: "Rabat",
    equipment: {
      WLC: { 
        status: 'Warning', 
        icon: Wifi,
        description: "Les contrôleurs sans fil (WLC) gèrent de manière centralisée tous les points d'accès WiFi du campus de Rabat.",
        parameters: {}
      },
      Fortigate: { 
        status: 'Warning', 
        icon: Shield,
        description: "Le pare-feu Fortigate assure la sécurité du réseau du campus de Rabat.",
        parameters: {}
      },
      Panorama: { 
        status: 'Warning', 
        icon: Network,
        description: "Panorama supervise et contrôle l'ensemble des pare-feux du campus de Rabat.",
        parameters: {}
      },
      ISE: {
        status: 'Online',
        icon: UserCheck,
        description: "Cisco ISE gère l'authentification et l'autorisation des utilisateurs sur le réseau de Rabat.",
        parameters: {
          'Nœud PAN Principal': { 
            value: 'um6p-ise-pan-01.um6p.ma (10.1.207.61)',
            status: 'Connected'
          },
          'Nœud PAN Secondaire': {
            value: 'um6p-ise-pan-02.um6p.ma (10.13.207.61)',
            status: 'Connected'
          },
          'Nœud PSN Principal': {
            value: 'um6p-ise-psn-01.um6p.ma (10.1.207.63)',
            status: 'Connected'
          },
          'Nœud PSN Secondaire': {
            value: 'um6p-ise-psn-02.um6p.ma (10.1.207.64)',
            status: 'Connected'
          }
        }
      }
    }
  }
};

const fetchWLCData = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/wlc/benguerir');
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des données WLC');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur:', error);
    return null;
  }
};

const updateWLCData = async () => {
  const data = await fetchWLCData();
  if (data) {
    equipmentStatus.benguerir.equipment.WLC.parameters = {
      'Nombre d\'AP': data.ap_count,
      'Hot Standby': data.ha_status
    };
    equipmentStatus.benguerir.equipment.WLC.status = data.ha_status === 'UP' ? 'Online' : 'Warning';
  }
};

const getStatusIcon = (status: string) => {
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

const getStatusColor = (status: string) => {
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

export function Dashboard() {
  const [showEquipment, setShowEquipment] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [isHovered, setIsHovered] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUM6PHovered, setIsUM6PHovered] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const { logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    updateWLCData();
    const interval = setInterval(updateWLCData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleCardExpansion = (location: string, equipment: string) => {
    setExpandedCard(expandedCard === `${location}-${equipment}` ? null : `${location}-${equipment}`);
  };

  const renderParameterValue = (param: string, value: string | { value: string; status: 'Connected' | 'Disconnected' }) => {
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

  const HomePage = () => (
    <div className="space-y-0">
      <div className="relative h-[620px] w-full">
        <div className="absolute inset-0">
          <img 
            src="https://cloudfront-eu-central-1.images.arcpublishing.com/le360/NRPUS6XHOZFFNH3IIAOX327ANA.jpg"
            alt="UM6P Campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
        
        <div className="relative h-full flex flex-col items-center justify-center text-white text-center px-4">
          <img 
            src="https://le-guide.ma/wp-content/uploads/2023/11/UM6P-Emploi-Recrutement-696x364.webp"
            alt="UM6P Logo"
            className="h-20 mb-4"
          />
          <h1 className="text-4xl font-bold mb-4">
            Système de Supervision IT
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Plateforme de surveillance en temps réel des équipements IT critiques
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-b from-orange-50 to-orange-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          {Object.entries(equipmentStatus).map(([location, locationData]) => (
            <div key={location} className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <MapPin className="h-6 w-6 text-orange-600" />
                <h2 className="text-2xl font-bold text-gray-800">{locationData.name}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(locationData.equipment).map(([name, equipment]) => (
                  <div
                    key={`${location}-${name}`}
                    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                    onClick={() => toggleCardExpansion(location, name)}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <equipment.icon className="h-8 w-8 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800">{name}</h3>
                        <div className="flex items-center mt-1">
                          {getStatusIcon(equipment.status)}
                          <span className="text-sm ml-2">{equipment.status}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCardExpansion(location, name);
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {expandedCard === `${location}-${name}` ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </button>
                    </div>

                    {expandedCard === `${location}-${name}` && (
                      <div className="mt-4 space-y-4 animate-fadeIn">
                        <p className="text-gray-600 text-sm">
                          {equipment.description}
                        </p>
                        {Object.entries(equipment.parameters).length > 0 && (
                          <div className="space-y-2">
                            {Object.entries(equipment.parameters).map(([param, value]) => (
                              <div key={param} className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">{param}</span>
                                {renderParameterValue(param, value)}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const EquipmentStatus = ({ location, type }: { location: string, type: string }) => {
    const equipment = equipmentStatus[location as keyof typeof equipmentStatus].equipment[type];
    const statusColorClass = getStatusColor(equipment.status);
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${statusColorClass.split(' ')[0]}`}>
              <equipment.icon size={24} className={statusColorClass.split(' ')[2]} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{type}</h3>
              <div className="flex items-center mt-1">
                <MapPin size={16} className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">{equipmentStatus[location as keyof typeof equipmentStatus].name}</span>
              </div>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full border ${statusColorClass} flex items-center space-x-2`}>
            {getStatusIcon(equipment.status)}
            <span className="font-medium">{equipment.status}</span>
          </div>
        </div>

        <p className="text-gray-600 mb-6">
          {equipment.description}
        </p>
        
        {Object.keys(equipment.parameters).length > 0 && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Paramètres</h4>
            <div className="space-y-3">
              {Object.entries(equipment.parameters).map(([param, value]) => (
                <div key={param} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-gray-700 font-medium">{param}</span>
                  {renderParameterValue(param, value)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
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
                  onClick={() => {
                    setCurrentPage('home');
                    setSelectedLocation(null);
                    setSelectedEquipment(null);
                  }}
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
                                onClick={() => {
                                  setSelectedLocation(location);
                                  setSelectedEquipment(eq);
                                  setCurrentPage('equipment');
                                }}
                                className={`w-full text-left px-4 py-2 rounded-lg hover:bg-orange-100 ${
                                  selectedLocation === location && selectedEquipment === eq ? 'bg-orange-50 border-l-4 border-orange-400' : ''
                                } flex items-center space-x-2`}
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
          {currentPage === 'home' ? (
            <HomePage />
          ) : selectedLocation && selectedEquipment ? (
            <div className="p-8">
              <EquipmentStatus location={selectedLocation} type={selectedEquipment} />
            </div>
          ) : (
            <div className="p-6 text-center text-gray-600">
              Sélectionnez un équipement pour voir son état
            </div>
          )}
        </div>
      </div>

      {isAdmin && <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />}
    </div>
  );
}