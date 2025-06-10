
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StatusBadge from './StatusBadge';
import { Shipment, Location } from '@/types/shipment';

interface ShipmentMapProps {
  selectedShipment: Shipment | null;
  onUpdateLocation: (shipmentId: string, location: Location) => void;
}

const ShipmentMap = ({ selectedShipment, onUpdateLocation }: ShipmentMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  // Simulate map with visual representation
  const formatETA = (eta: string) => {
    const date = new Date(eta);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleUpdateLocation = () => {
    if (!selectedShipment) return;
    
    // Simulate location update
    const newLocation: Location = {
      lat: selectedShipment.currentLocation.lat + (Math.random() - 0.5) * 0.1,
      lng: selectedShipment.currentLocation.lng + (Math.random() - 0.5) * 0.1,
      name: `Updated Location ${new Date().toLocaleTimeString()}`,
      timestamp: new Date().toISOString()
    };
    
    onUpdateLocation(selectedShipment.id, newLocation);
  };

  if (!selectedShipment) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Shipment Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Select a shipment to view its route and location details
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Shipment Tracking Map</CardTitle>
        <div className="flex items-center justify-between">
          <Badge variant="outline">{selectedShipment.containerId}</Badge>
          <StatusBadge status={selectedShipment.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Map Visualization */}
        <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg h-64 border-2 border-dashed border-blue-200">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto animate-pulse"></div>
              <p className="text-sm font-medium">Current Location</p>
              <p className="text-xs text-muted-foreground">{selectedShipment.currentLocation.name}</p>
              <p className="text-xs text-muted-foreground">
                {selectedShipment.currentLocation.lat.toFixed(4)}, {selectedShipment.currentLocation.lng.toFixed(4)}
              </p>
            </div>
          </div>
          
          {/* Route visualization */}
          <div className="absolute top-4 left-4">
            <div className="bg-white p-2 rounded shadow-sm text-xs">
              <div className="font-semibold text-green-600">Origin</div>
              <div>{selectedShipment.origin.name}</div>
            </div>
          </div>
          
          <div className="absolute bottom-4 right-4">
            <div className="bg-white p-2 rounded shadow-sm text-xs">
              <div className="font-semibold text-red-600">Destination</div>
              <div>{selectedShipment.destination.name}</div>
            </div>
          </div>
        </div>

        {/* Shipment Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Shipment Details</h4>
            <div className="text-sm space-y-1">
              <div><span className="text-muted-foreground">ID:</span> {selectedShipment.id}</div>
              <div><span className="text-muted-foreground">Container:</span> {selectedShipment.containerId}</div>
              <div><span className="text-muted-foreground">Status:</span> <StatusBadge status={selectedShipment.status} /></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">Timing</h4>
            <div className="text-sm space-y-1">
              <div><span className="text-muted-foreground">ETA:</span> {formatETA(selectedShipment.eta)}</div>
              <div><span className="text-muted-foreground">Created:</span> {new Date(selectedShipment.createdAt).toLocaleDateString()}</div>
              <div><span className="text-muted-foreground">Updated:</span> {new Date(selectedShipment.updatedAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        {(selectedShipment.weight || selectedShipment.dimensions || selectedShipment.description) && (
          <div className="space-y-2">
            <h4 className="font-semibold">Cargo Information</h4>
            <div className="text-sm space-y-1">
              {selectedShipment.weight && (
                <div><span className="text-muted-foreground">Weight:</span> {selectedShipment.weight} kg</div>
              )}
              {selectedShipment.dimensions && (
                <div><span className="text-muted-foreground">Dimensions:</span> {selectedShipment.dimensions}</div>
              )}
              {selectedShipment.description && (
                <div><span className="text-muted-foreground">Description:</span> {selectedShipment.description}</div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2 pt-4">
          <Button onClick={handleUpdateLocation} variant="outline" size="sm">
            Update Location
          </Button>
          <Button variant="outline" size="sm">
            View Full Route
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentMap;
