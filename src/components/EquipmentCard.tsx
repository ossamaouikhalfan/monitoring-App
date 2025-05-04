import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getStatusIcon, renderParameterValue } from '../utils/statusHelpers';
import type { Equipment } from '../types/equipment';

interface EquipmentCardProps {
  location: string;
  name: string;
  equipment: Equipment;
}

export function EquipmentCard({ location, name, equipment }: EquipmentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/equipment/${location}/${name}`);
  };

  const toggleExpansion = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      onClick={handleClick}
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
          onClick={toggleExpansion}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
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
  );
}