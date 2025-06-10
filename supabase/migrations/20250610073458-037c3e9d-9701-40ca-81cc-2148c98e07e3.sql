
-- Create shipments table
CREATE TABLE public.shipments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  container_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'in-transit', 'delivered', 'delayed')),
  current_location JSONB NOT NULL,
  route JSONB NOT NULL DEFAULT '[]'::jsonb,
  eta TIMESTAMP WITH TIME ZONE NOT NULL,
  origin JSONB NOT NULL,
  destination JSONB NOT NULL,
  weight NUMERIC,
  dimensions TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_shipments_status ON public.shipments(status);
CREATE INDEX idx_shipments_container_id ON public.shipments(container_id);
CREATE INDEX idx_shipments_created_at ON public.shipments(created_at);
CREATE INDEX idx_shipments_eta ON public.shipments(eta);

-- Create shipment updates table for tracking history
CREATE TABLE public.shipment_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
  location JSONB NOT NULL,
  status TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for shipment updates
CREATE INDEX idx_shipment_updates_shipment_id ON public.shipment_updates(shipment_id);
CREATE INDEX idx_shipment_updates_created_at ON public.shipment_updates(created_at);

-- Enable RLS (for now, allow all operations - can be restricted later with auth)
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_updates ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for now (can be restricted with authentication later)
CREATE POLICY "Allow all operations on shipments" ON public.shipments
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on shipment_updates" ON public.shipment_updates
  FOR ALL USING (true) WITH CHECK (true);

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.shipments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.shipment_updates;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_shipments_updated_at 
  BEFORE UPDATE ON public.shipments 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.shipments (container_id, status, current_location, route, eta, origin, destination, weight, dimensions, description) VALUES
('CONT001', 'in-transit', '{"lat": 34.0522, "lng": -118.2437, "name": "Los Angeles Port", "timestamp": "2024-06-10T10:30:00Z"}', '[{"lat": 34.0522, "lng": -118.2437, "name": "Los Angeles Port"}, {"lat": 31.2304, "lng": 121.4737, "name": "Shanghai Port"}]', '2024-06-20T14:00:00Z', '{"lat": 34.0522, "lng": -118.2437, "name": "Los Angeles Port"}', '{"lat": 31.2304, "lng": 121.4737, "name": "Shanghai Port"}', 15000, '40ft x 8ft x 8.5ft', 'Electronics and consumer goods'),
('CONT002', 'pending', '{"lat": 40.7128, "lng": -74.0060, "name": "New York Port", "timestamp": "2024-06-10T08:00:00Z"}', '[{"lat": 40.7128, "lng": -74.0060, "name": "New York Port"}, {"lat": 51.5074, "lng": -0.1278, "name": "London Port"}]', '2024-06-18T16:30:00Z', '{"lat": 40.7128, "lng": -74.0060, "name": "New York Port"}', '{"lat": 51.5074, "lng": -0.1278, "name": "London Port"}', 8500, '20ft x 8ft x 8.5ft', 'Automotive parts'),
('CONT003', 'delivered', '{"lat": 35.6762, "lng": 139.6503, "name": "Tokyo Port", "timestamp": "2024-06-08T12:00:00Z"}', '[{"lat": 47.6062, "lng": -122.3321, "name": "Seattle Port"}, {"lat": 35.6762, "lng": 139.6503, "name": "Tokyo Port"}]', '2024-06-08T12:00:00Z', '{"lat": 47.6062, "lng": -122.3321, "name": "Seattle Port"}', '{"lat": 35.6762, "lng": 139.6503, "name": "Tokyo Port"}', 12000, '40ft x 8ft x 8.5ft', 'Machinery and equipment'),
('CONT004', 'delayed', '{"lat": 25.2048, "lng": 55.2708, "name": "Dubai Port", "timestamp": "2024-06-10T06:15:00Z"}', '[{"lat": 51.5074, "lng": -0.1278, "name": "London Port"}, {"lat": 25.2048, "lng": 55.2708, "name": "Dubai Port"}, {"lat": 19.0760, "lng": 72.8777, "name": "Mumbai Port"}]', '2024-06-15T10:00:00Z', '{"lat": 51.5074, "lng": -0.1278, "name": "London Port"}', '{"lat": 19.0760, "lng": 72.8777, "name": "Mumbai Port"}', 9200, '20ft x 8ft x 8.5ft', 'Textiles and clothing');
