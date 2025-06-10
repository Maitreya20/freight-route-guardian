
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import EnhancedShipmentTable from '@/components/EnhancedShipmentTable';
import ShipmentMap from '@/components/ShipmentMap';
import ShipmentAnalytics from '@/components/ShipmentAnalytics';
import AddShipmentModal from '@/components/AddShipmentModal';
import { Shipment, ShipmentFormData } from '@/types/shipment';
import { useShipments } from '@/hooks/useShipments';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { toast } = useToast();

  const {
    shipments,
    loading,
    error,
    addShipment,
    updateLocation,
    updateStatus,
    deleteShipment,
  } = useShipments();

  const handleSelectShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    toast({
      title: "Shipment Selected",
      description: `Viewing details for ${shipment.containerId}`,
    });
  };

  const handleAddShipment = async (formData: ShipmentFormData) => {
    try {
      await addShipment(formData);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Failed to add shipment:', error);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive">Error Loading Shipments</h2>
            <p className="text-muted-foreground mt-2">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <EnhancedShipmentTable
              shipments={shipments}
              loading={loading}
              onSelectShipment={handleSelectShipment}
              onAddShipment={() => setIsAddModalOpen(true)}
              onUpdateStatus={updateStatus}
              onDeleteShipment={deleteShipment}
            />
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <EnhancedShipmentTable
                  shipments={shipments}
                  loading={loading}
                  onSelectShipment={handleSelectShipment}
                  onAddShipment={() => setIsAddModalOpen(true)}
                  onUpdateStatus={updateStatus}
                  onDeleteShipment={deleteShipment}
                />
              </div>
              <div className="lg:col-span-2">
                <ShipmentMap
                  selectedShipment={selectedShipment}
                  onUpdateLocation={updateLocation}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <ShipmentAnalytics shipments={shipments} />
          </TabsContent>
        </Tabs>
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
