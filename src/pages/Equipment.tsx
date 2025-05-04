import { useParams } from 'react-router-dom';
import { MapPin, Server, Activity } from 'lucide-react';
import { equipmentStatus } from '../data/equipmentStatus';
import { getStatusColor, getStatusIcon, renderParameterValue } from '../utils/statusHelpers';

export function Equipment() {
  const { location, type } = useParams<{ location: string; type: string }>();

  if (!location || !type || !equipmentStatus[location]?.equipment[type]) {
    return (
      <div className="p-6 text-center text-gray-600">
        Équipement non trouvé
      </div>
    );
  }

  const equipment = equipmentStatus[location].equipment[type];
  const statusColorClass = getStatusColor(equipment.status);
  const isISE = type === 'ISE';
  const isDisconnected = isISE && (!equipment.iseData?.nodes.length || equipment.iseData.nodes.every(node => !node.is_connected));

  return (
    <div className="p-8">
      <div className="space-y-6">
        {/* Header Card */}
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
                  <span className="text-sm text-gray-600">{equipmentStatus[location].name}</span>
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
        </div>

        {/* ISE System Health */}
        {isISE && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-between">
              État du Système ISE
              {isDisconnected && (
                <div className="text-yellow-600">
                  Disconnected
                </div>
              )}
            </h4>
            
            {isDisconnected ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Système déconnecté</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-gray-800 mb-1">
                      {equipment.iseData?.health_percentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Santé Globale</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-gray-800 mb-1">
                      {equipment.iseData?.total_nodes}
                    </div>
                    <div className="text-sm text-gray-600">Total Nœuds</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {equipment.iseData?.connected_nodes}
                    </div>
                    <div className="text-sm text-gray-600">Nœuds Connectés</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-red-600 mb-1">
                      {equipment.iseData?.disconnected_nodes}
                    </div>
                    <div className="text-sm text-gray-600">Nœuds Déconnectés</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="font-medium text-gray-700">Détails des Nœuds</h5>
                  {equipment.iseData?.nodes.map((node, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Server size={20} className="text-gray-500" />
                          <span className="font-medium text-gray-800">{node.fqdn}</span>
                        </div>
                        <div className={`px-3 py-1 rounded-full flex items-center space-x-2 ${
                          node.is_connected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          <Activity size={16} />
                          <span className="text-sm font-medium">{node.status}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Adresse IP:</span>
                          <span className="ml-2 text-gray-800">{node.ip_address}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Version:</span>
                          <span className="ml-2 text-gray-800">{node.version}</span>
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-gray-600">Rôles:</span>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {node.roles.map((role, roleIndex) => (
                              <span
                                key={roleIndex}
                                className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs"
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Other Parameters */}
        {Object.keys(equipment.parameters).length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
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
    </div>
  );
}