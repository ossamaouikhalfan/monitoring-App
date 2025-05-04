import { Wifi, Shield, Network, UserCheck, type LucideIcon } from 'lucide-react';
import type { EquipmentStatus, ISENode } from '../types/equipment';
import { api } from '../utils/api';

export const equipmentStatus: EquipmentStatus = {
  benguerir: {
    name: "Benguerir",
    equipment: {
      WLC: { 
        status: 'Warning', 
        icon: Wifi as unknown as LucideIcon,
        description: "Les contrôleurs sans fil (WLC) gèrent de manière centralisée tous les points d'accès WiFi du campus de Benguerir.",
        parameters: {
          'Nombre d\'AP': 'Chargement...',
          'Hot Standby': 'Chargement...'
        }
      },
      Fortigate: { 
        status: 'Warning', 
        icon: Shield as unknown as LucideIcon,
        description: "Le pare-feu Fortigate assure la sécurité du réseau du campus de Benguerir.",
        parameters: {}
      },
      Panorama: { 
        status: 'Warning', 
        icon: Network as unknown as LucideIcon,
        description: "Panorama supervise et contrôle l'ensemble des pare-feux du campus de Benguerir.",
        parameters: {}
      },
      ISE: {
        status: 'Loading',
        icon: UserCheck as unknown as LucideIcon,
        description: "Cisco ISE gère l'authentification et l'autorisation des utilisateurs sur le réseau de Benguerir.",
        parameters: {
          'Nœud PAN Principal': { 
            value: 'Chargement...',
            status: 'Disconnected'
          },
          'Nœud PAN Secondaire': {
            value: 'Chargement...',
            status: 'Disconnected'
          },
          'Nœud PSN Principal': {
            value: 'Chargement...',
            status: 'Disconnected'
          },
          'Nœud PSN Secondaire': {
            value: 'Chargement...',
            status: 'Disconnected'
          }
        },
        iseData: {
          total_nodes: 0,
          connected_nodes: 0,
          disconnected_nodes: 0,
          health_percentage: 0,
          nodes: []
        }
      }
    }
  },
  rabat: {
    name: "Rabat",
    equipment: {
      WLC: { 
        status: 'Warning', 
        icon: Wifi as unknown as LucideIcon,
        description: "Les contrôleurs sans fil (WLC) gèrent de manière centralisée tous les points d'accès WiFi du campus de Rabat.",
        parameters: {}
      },
      Fortigate: { 
        status: 'Warning', 
        icon: Shield as unknown as LucideIcon,
        description: "Le pare-feu Fortigate assure la sécurité du réseau du campus de Rabat.",
        parameters: {}
      },
      Panorama: { 
        status: 'Warning', 
        icon: Network as unknown as LucideIcon,
        description: "Panorama supervise et contrôle l'ensemble des pare-feux du campus de Rabat.",
        parameters: {}
      },
      ISE: {
        status: 'Warning',
        icon: UserCheck as unknown as LucideIcon,
        description: "Cisco ISE gère l'authentification et l'autorisation des utilisateurs sur le réseau de Rabat.",
        parameters: {},
        iseData: {
          total_nodes: 0,
          connected_nodes: 0,
          disconnected_nodes: 0,
          health_percentage: 0,
          nodes: []
        }
      }
    }
  }
};

export const updateISEData = async () => {
  try {
    equipmentStatus.benguerir.equipment.ISE.status = 'Loading';
    equipmentStatus.rabat.equipment.ISE.status = 'Loading';

    const data = await api.equipment.getISEData();
    if (data) {
      equipmentStatus.benguerir.equipment.ISE.iseData = data;
      equipmentStatus.benguerir.equipment.ISE.status = data.health_percentage > 80 ? 'Online' : 'Warning';
      
      // Update parameters with node information
      const parameters: Record<string, { value: string; status: 'Connected' | 'Disconnected' }> = {};
      data.nodes.forEach((node: ISENode) => {
        const nodeName = node.roles.includes('Primary PAN') ? 'Nœud PAN Principal' :
                        node.roles.includes('Secondary PAN') ? 'Nœud PAN Secondaire' :
                        node.roles.includes('PSN') ? `Nœud PSN (${node.fqdn})` : node.fqdn;
        
        parameters[nodeName] = {
          value: `${node.fqdn} (${node.ip_address})`,
          status: node.is_connected ? 'Connected' : 'Disconnected'
        };
      });
      
      equipmentStatus.benguerir.equipment.ISE.parameters = parameters;
    }
  } catch (error) {
    console.error('Error updating ISE data:', error);
    equipmentStatus.benguerir.equipment.ISE.status = 'Warning';
    equipmentStatus.rabat.equipment.ISE.status = 'Warning';
  }
};

// Initial update and set interval
updateISEData();
setInterval(updateISEData, 30000); // Update every 30 seconds