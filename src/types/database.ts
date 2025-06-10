
export interface DatabaseShipment {
  id: string;
  container_id: string;
  status: 'pending' | 'in-transit' | 'delivered' | 'delayed';
  current_location: {
    lat: number;
    lng: number;
    name: string;
    timestamp?: string;
  };
  route: Array<{
    lat: number;
    lng: number;
    name: string;
  }>;
  eta: string;
  origin: {
    lat: number;
    lng: number;
    name: string;
  };
  destination: {
    lat: number;
    lng: number;
    name: string;
  };
  weight?: number;
  dimensions?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ShipmentUpdate {
  id: string;
  shipment_id: string;
  location: {
    lat: number;
    lng: number;
    name: string;
    timestamp?: string;
  };
  status?: string;
  notes?: string;
  created_at: string;
}
