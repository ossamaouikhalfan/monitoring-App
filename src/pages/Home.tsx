import { MapPin } from 'lucide-react';
import { EquipmentCard } from '../components/EquipmentCard';
import { equipmentStatus } from '../data/equipmentStatus';

export function Home() {
  return (
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
                  <EquipmentCard
                    key={`${location}-${name}`}
                    location={location}
                    name={name}
                    equipment={equipment}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}