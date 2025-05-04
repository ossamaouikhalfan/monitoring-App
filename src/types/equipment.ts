import type { LucideIcon } from 'lucide-react';

export interface ISENode {
  timestamp: string;
  fqdn: string;
  ip_address: string;
  status: string;
  is_connected: boolean;
  version: string;
  roles: string[];
}

export interface ISEData {
  total_nodes: number;
  connected_nodes: number;
  disconnected_nodes: number;
  health_percentage: number;
  nodes: ISENode[];
}

export interface Equipment {
  status: 'Online' | 'Warning' | 'Error' | 'Loading';
  icon: LucideIcon;
  description: string;
  parameters: Record<string, string | { value: string; status: 'Connected' | 'Disconnected' }>;
  iseData?: ISEData;
}

export interface LocationEquipment {
  name: string;
  equipment: Record<string, Equipment>;
}

export interface EquipmentStatus {
  [key: string]: LocationEquipment;
}