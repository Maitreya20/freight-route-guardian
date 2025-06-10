
import React, { useState } from 'react';
import Header from '@/components/Header';
import ShipmentTable from '@/components/ShipmentTable';
import ShipmentMap from '@/components/ShipmentMap';
import AddShipmentModal from '@/components/AddShipmentModal';
import { Shipment, ShipmentFormData, Location } from '@/types/shipment';
import { mockShipments } from '@/data/mockShipments';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [shipments, setShipments] = useState<Shipment[]>(mockShipments);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { toast } = useToast();

  const handleSelectShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    toast({
      title: "Shipment Selected",
      description: `Viewing details for ${shipment.containerId}`,
    });
  };

  const handleAddShipment = (formData: ShipmentFormData) => {
    const newShipment: Shipment = {
      id: `SHP${String(shipments.length + 1).padStart(3, '0')}`,
      containerId: formData.containerId,
      status: 'pending',
      currentLocation: {
        lat: Math.random() * 180 - 90,
        lng: Math.random() * 360 - 180,
        name: formData.origin
      },
      route: [
        {
          lat: Math.random() * 180 - 90,
          lng: Math.random() * 360 - 180,
          name: formData.origin
        },
        {
          lat: Math.random() * 180 - 90,
          lng: Math.random() * 360 - 180,
          name: formData.destination
        }
      ],
      eta: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      origin: {
        lat: Math.random() * 180 - 90,
        lng: Math.random() * 360 - 180,
        name: formData.origin
      },
      destination: {
        lat: Math.random() * 180 - 90,
        lng: Math.random() * 360 - 180,
        name: formData.destination
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      weight: formData.weight,
      dimensions: formData.dimensions,
      description: formData.description
    };

    setShipments(prev => [...prev, newShipment]);
    toast({
      title: "Shipment Created",
      description: `New shipment ${newShipment.containerId} has been added successfully.`,
    });
  };

  const handleUpdateLocation = (shipmentId: string, location: Location) => {
    setShipments(prev => prev.map(shipment => 
      shipment.id === shipmentId 
        ? { 
            ...shipment, 
            currentLocation: location,
            updatedAt: new Date().toISOString()
          }
        : shipment
    ));

    if (selectedShipment?.id === shipmentId) {
      setSelectedShipment(prev => prev ? {
        ...prev,
        currentLocation: location,
        updatedAt: new Date().toISOString()
      } : null);
    }

    toast({
      title: "Location Updated",
      description: `Shipment location has been updated to ${location.name}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <ShipmentTable
              shipments={shipments}
              onSelectShipment={handleSelectShipment}
              onAddShipment={() => setIsAddModalOpen(true)}
            />
          </div>
          
          <div>
            <ShipmentMap
              selectedShipment={selectedShipment}
              onUpdateLocation={handleUpdateLocation}
            />
          </div>
        </div>
      </div>

      <AddShipmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddShipment}
      />
    </div>
  );
};

export default Index;
