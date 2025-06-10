
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download, Trash2, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import StatusBadge from './StatusBadge';
import { Shipment } from '@/types/shipment';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface EnhancedShipmentTableProps {
  shipments: Shipment[];
  loading: boolean;
  onSelectShipment: (shipment: Shipment) => void;
  onAddShipment: () => void;
  onUpdateStatus: (shipmentId: string, status: Shipment['status']) => void;
  onDeleteShipment: (shipmentId: string) => void;
}

const EnhancedShipmentTable = ({ 
  shipments, 
  loading, 
  onSelectShipment, 
  onAddShipment,
  onUpdateStatus,
  onDeleteShipment 
}: EnhancedShipmentTableProps) => {
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'id' | 'status' | 'eta' | 'created_at'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  // Filtered and sorted shipments
  const filteredShipments = useMemo(() => {
    let filtered = shipments.filter(shipment => {
      // Text filter
      const matchesText = filter === '' || 
        shipment.id.toLowerCase().includes(filter.toLowerCase()) ||
        shipment.containerId.toLowerCase().includes(filter.toLowerCase()) ||
        shipment.currentLocation.name.toLowerCase().includes(filter.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;

      // Date filter
      const shipmentDate = new Date(shipment.createdAt);
      const matchesDateRange = (!dateRange.from || shipmentDate >= dateRange.from) &&
        (!dateRange.to || shipmentDate <= dateRange.to);

      return matchesText && matchesStatus && matchesDateRange;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'eta':
          aValue = new Date(a.eta);
          bValue = new Date(b.eta);
          break;
        case 'created_at':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [shipments, filter, statusFilter, sortBy, sortOrder, dateRange]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredShipments.map(s => s.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectShipment = (shipmentId: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(shipmentId);
    } else {
      newSelected.delete(shipmentId);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkStatusUpdate = async (status: Shipment['status']) => {
    const promises = Array.from(selectedIds).map(id => onUpdateStatus(id, status));
    await Promise.all(promises);
    setSelectedIds(new Set());
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.size} shipments?`)) {
      const promises = Array.from(selectedIds).map(id => onDeleteShipment(id));
      await Promise.all(promises);
      setSelectedIds(new Set());
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Container ID', 'Status', 'Current Location', 'Origin', 'Destination', 'ETA', 'Created'];
    const csvContent = [
      headers.join(','),
      ...filteredShipments.map(shipment => [
        shipment.id,
        shipment.containerId,
        shipment.status,
        `"${shipment.currentLocation.name}"`,
        `"${shipment.origin.name}"`,
        `"${shipment.destination.name}"`,
        shipment.eta,
        shipment.createdAt
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shipments-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatETA = (eta: string) => {
    const date = new Date(eta);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading shipments...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Enhanced Shipment Dashboard</CardTitle>
          <div className="flex gap-2">
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={onAddShipment} className="bg-primary hover:bg-primary/90">
              Add New Shipment
            </Button>
          </div>
        </div>
        
        {/* Enhanced Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <Input
            placeholder="Search shipments..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="delayed">Delayed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
            const [field, order] = value.split('-');
            setSortBy(field as any);
            setSortOrder(order as 'asc' | 'desc');
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at-desc">Newest First</SelectItem>
              <SelectItem value="created_at-asc">Oldest First</SelectItem>
              <SelectItem value="eta-asc">ETA (Earliest)</SelectItem>
              <SelectItem value="eta-desc">ETA (Latest)</SelectItem>
              <SelectItem value="status-asc">Status A-Z</SelectItem>
              <SelectItem value="id-asc">ID A-Z</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("justify-start text-left font-normal", !dateRange.from && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    `${format(dateRange.from, "LLL dd")} - ${format(dateRange.to, "LLL dd")}`
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  "Date range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => setDateRange(range || {})}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Bulk Actions */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <span className="text-sm font-medium">{selectedIds.size} selected</span>
            <div className="flex gap-2 ml-auto">
              <Select onValueChange={handleBulkStatusUpdate}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Update status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleBulkDelete} variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">
                  <Checkbox
                    checked={selectedIds.size === filteredShipments.length && filteredShipments.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="text-left p-4 font-semibold">Shipment ID</th>
                <th className="text-left p-4 font-semibold">Container ID</th>
                <th className="text-left p-4 font-semibold">Current Location</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-left p-4 font-semibold">ETA</th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredShipments.map((shipment) => (
                <tr key={shipment.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="p-4">
                    <Checkbox
                      checked={selectedIds.has(shipment.id)}
                      onCheckedChange={(checked) => handleSelectShipment(shipment.id, checked as boolean)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="font-mono text-sm">{shipment.id.slice(0, 8)}...</div>
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
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectShipment(shipment)}
                      >
                        View Details
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => onUpdateStatus(shipment.id, 'in-transit')}>
                            Mark In Transit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateStatus(shipment.id, 'delivered')}>
                            Mark Delivered
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateStatus(shipment.id, 'delayed')}>
                            Mark Delayed
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onDeleteShipment(shipment.id)}
                            className="text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredShipments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No shipments found matching your criteria.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedShipmentTable;
