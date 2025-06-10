
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Shipment, ShipmentFormData, Location } from '@/types/shipment';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

// Transform database shipment to app shipment format
const transformShipment = (dbShipment: any): Shipment => {
  // Type assertions with proper validation
  const parseLocation = (locationJson: Json): Location => {
    if (typeof locationJson === 'object' && locationJson !== null) {
      const loc = locationJson as any;
      return {
        lat: Number(loc.lat) || 0,
        lng: Number(loc.lng) || 0,
        name: String(loc.name) || '',
        timestamp: loc.timestamp ? String(loc.timestamp) : undefined,
      };
    }
    return { lat: 0, lng: 0, name: 'Unknown' };
  };

  const parseRoute = (routeJson: Json): Location[] => {
    if (Array.isArray(routeJson)) {
      return routeJson.map(parseLocation);
    }
    return [];
  };

  return {
    id: dbShipment.id,
    containerId: dbShipment.container_id,
    status: dbShipment.status as 'pending' | 'in-transit' | 'delivered' | 'delayed',
    currentLocation: parseLocation(dbShipment.current_location),
    route: parseRoute(dbShipment.route),
    eta: dbShipment.eta,
    origin: parseLocation(dbShipment.origin),
    destination: parseLocation(dbShipment.destination),
    createdAt: dbShipment.created_at,
    updatedAt: dbShipment.updated_at,
    weight: dbShipment.weight || undefined,
    dimensions: dbShipment.dimensions || undefined,
    description: dbShipment.description || undefined,
  };
};

// Convert Location to Json format for database
const locationToJson = (location: Location): Json => {
  return {
    lat: location.lat,
    lng: location.lng,
    name: location.name,
    ...(location.timestamp && { timestamp: location.timestamp }),
  } as Json;
};

export const useShipments = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch shipments from database
  const fetchShipments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedShipments = data?.map(transformShipment) || [];
      setShipments(transformedShipments);
      setError(null);
    } catch (err) {
      console.error('Error fetching shipments:', err);
      setError('Failed to fetch shipments');
      toast({
        title: "Error",
        description: "Failed to fetch shipments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add new shipment
  const addShipment = async (formData: ShipmentFormData) => {
    try {
      // Generate random coordinates for demo purposes
      const originCoords = {
        lat: Math.random() * 180 - 90,
        lng: Math.random() * 360 - 180,
      };
      
      const destCoords = {
        lat: Math.random() * 180 - 90,
        lng: Math.random() * 360 - 180,
      };

      const originLocation: Location = {
        ...originCoords,
        name: formData.origin,
        timestamp: new Date().toISOString(),
      };

      const destinationLocation: Location = {
        ...destCoords,
        name: formData.destination,
      };

      const newShipment = {
        container_id: formData.containerId,
        status: 'pending' as const,
        current_location: locationToJson(originLocation),
        route: [locationToJson(originLocation), locationToJson(destinationLocation)] as Json,
        eta: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        origin: locationToJson(originLocation),
        destination: locationToJson(destinationLocation),
        weight: formData.weight || null,
        dimensions: formData.dimensions || null,
        description: formData.description || null,
      };

      const { data, error } = await supabase
        .from('shipments')
        .insert([newShipment])
        .select()
        .single();

      if (error) throw error;

      const transformedShipment = transformShipment(data);
      setShipments(prev => [transformedShipment, ...prev]);
      
      toast({
        title: "Shipment Created",
        description: `New shipment ${transformedShipment.containerId} has been added successfully.`,
      });

      return transformedShipment;
    } catch (err) {
      console.error('Error adding shipment:', err);
      toast({
        title: "Error",
        description: "Failed to create shipment",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Update shipment location
  const updateLocation = async (shipmentId: string, location: Location) => {
    try {
      const { error } = await supabase
        .from('shipments')
        .update({
          current_location: locationToJson(location),
          updated_at: new Date().toISOString(),
        })
        .eq('id', shipmentId);

      if (error) throw error;

      // Also add to shipment updates history
      await supabase
        .from('shipment_updates')
        .insert([{
          shipment_id: shipmentId,
          location: locationToJson(location),
          notes: 'Location updated via tracking system',
        }]);

      setShipments(prev => prev.map(shipment => 
        shipment.id === shipmentId 
          ? { 
              ...shipment, 
              currentLocation: location,
              updatedAt: new Date().toISOString()
            }
          : shipment
      ));

      toast({
        title: "Location Updated",
        description: `Shipment location has been updated to ${location.name}`,
      });
    } catch (err) {
      console.error('Error updating location:', err);
      toast({
        title: "Error",
        description: "Failed to update location",
        variant: "destructive",
      });
    }
  };

  // Update shipment status
  const updateStatus = async (shipmentId: string, status: Shipment['status']) => {
    try {
      const { error } = await supabase
        .from('shipments')
        .update({ status })
        .eq('id', shipmentId);

      if (error) throw error;

      setShipments(prev => prev.map(shipment => 
        shipment.id === shipmentId ? { ...shipment, status } : shipment
      ));

      toast({
        title: "Status Updated",
        description: `Shipment status changed to ${status}`,
      });
    } catch (err) {
      console.error('Error updating status:', err);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  // Delete shipment
  const deleteShipment = async (shipmentId: string) => {
    try {
      const { error } = await supabase
        .from('shipments')
        .delete()
        .eq('id', shipmentId);

      if (error) throw error;

      setShipments(prev => prev.filter(shipment => shipment.id !== shipmentId));
      
      toast({
        title: "Shipment Deleted",
        description: "Shipment has been successfully deleted",
      });
    } catch (err) {
      console.error('Error deleting shipment:', err);
      toast({
        title: "Error",
        description: "Failed to delete shipment",
        variant: "destructive",
      });
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    fetchShipments();

    const channel = supabase
      .channel('shipments-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'shipments'
      }, (payload) => {
        console.log('Real-time update:', payload);
        
        if (payload.eventType === 'INSERT') {
          const newShipment = transformShipment(payload.new);
          setShipments(prev => [newShipment, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          const updatedShipment = transformShipment(payload.new);
          setShipments(prev => prev.map(shipment => 
            shipment.id === updatedShipment.id ? updatedShipment : shipment
          ));
        } else if (payload.eventType === 'DELETE') {
          setShipments(prev => prev.filter(shipment => shipment.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    shipments,
    loading,
    error,
    addShipment,
    updateLocation,
    updateStatus,
    deleteShipment,
    refetch: fetchShipments,
  };
};
