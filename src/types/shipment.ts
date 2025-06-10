
export interface Location {
  lat: number;
  lng: number;
  name: string;
  timestamp?: string;
}

export interface Shipment {
  id: string;
  containerId: string;
  status: 'pending' | 'in-transit' | 'delivered' | 'delayed';
  currentLocation: Location;
  route: Location[];
  eta: string;
  origin: Location;
  destination: Location;
  createdAt: string;
  updatedAt: string;
  weight?: number;
  dimensions?: string;
  description?: string;
}

export interface ShipmentFormData {
  containerId: string;
  origin: string;
  destination: string;
  weight?: number;
  dimensions?: string;
  description?: string;
}
