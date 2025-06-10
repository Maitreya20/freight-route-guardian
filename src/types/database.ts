
import { Json } from '@/integrations/supabase/types';

export interface DatabaseShipment {
  id: string;
  container_id: string;
  status: string; // Changed to string to match Supabase types
  current_location: Json;
  route: Json;
  eta: string;
  origin: Json;
  destination: Json;
  weight?: number | null;
  dimensions?: string | null;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ShipmentUpdate {
  id: string;
  shipment_id: string;
  location: Json;
  status?: string | null;
  notes?: string | null;
  created_at: string;
}
