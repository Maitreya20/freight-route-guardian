
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StatusBadge from './StatusBadge';
import { Shipment } from '@/types/shipment';

interface ShipmentTableProps {
  shipments: Shipment[];
  onSelectShipment: (shipment: Shipment) => void;
  onAddShipment: () => void;
}

const ShipmentTable = ({ shipments, onSelectShipment, onAddShipment }: ShipmentTableProps) => {
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState<'id' | 'status' | 'eta'>('id');

  const filteredShipments = shipments.filter(shipment =>
    shipment.id.toLowerCase().includes(filter.toLowerCase()) ||
    shipment.containerId.toLowerCase().includes(filter.toLowerCase()) ||
    shipment.currentLocation.name.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedShipments = [...filteredShipments].sort((a, b) => {
    switch (sortBy) {
      case 'status':
        return a.status.localeCompare(b.status);
      case 'eta':
        return new Date(a.eta).getTime() - new Date(b.eta).getTime();
      default:
        return a.id.localeCompare(b.id);
    }
  });

  const formatETA = (eta: string) => {
    const date = new Date(eta);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Shipment Dashboard</CardTitle>
          <Button onClick={onAddShipment} className="bg-primary hover:bg-primary/90">
            Add New Shipment
          </Button>
        </div>
        <div className="flex items-center space-x-4 mt-4">
          <Input
            placeholder="Search shipments..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'id' | 'status' | 'eta')}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="id">Sort by ID</option>
            <option value="status">Sort by Status</option>
            <option value="eta">Sort by ETA</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-semibold">Shipment ID</th>
                <th className="text-left p-4 font-semibold">Container ID</th>
                <th className="text-left p-4 font-semibold">Current Location</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-left p-4 font-semibold">ETA</th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedShipments.map((shipment) => (
                <tr key={shipment.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="p-4">
                    <div className="font-mono text-sm">{shipment.id}</div>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline">{shipment.containerId}</Badge>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{shipment.currentLocation.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {shipment.currentLocation.lat.toFixed(4)}, {shipment.currentLocation.lng.toFixed(4)}
                    </div>
                  </td>
                  <td className="p-4">
                    <StatusBadge status={shipment.status} />
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{formatETA(shipment.eta)}</div>
                  </td>
                  <td className="p-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectShipment(shipment)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sortedShipments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No shipments found matching your criteria.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentTable;
