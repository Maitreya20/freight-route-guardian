
import { Shipment } from '@/types/shipment';

export const mockShipments: Shipment[] = [
  {
    id: 'SHP001',
    containerId: 'CONT123456',
    status: 'in-transit',
    currentLocation: {
      lat: 34.0522,
      lng: -118.2437,
      name: 'Port of Los Angeles, CA'
    },
    route: [
      { lat: 34.0522, lng: -118.2437, name: 'Port of Los Angeles, CA' },
      { lat: 37.7749, lng: -122.4194, name: 'San Francisco, CA' },
      { lat: 47.6062, lng: -122.3321, name: 'Seattle, WA' },
      { lat: 49.2827, lng: -123.1207, name: 'Vancouver, BC' }
    ],
    eta: '2024-06-15T14:30:00Z',
    origin: {
      lat: 34.0522,
      lng: -118.2437,
      name: 'Port of Los Angeles, CA'
    },
    destination: {
      lat: 31.2304,
      lng: 121.4737,
      name: 'Port of Shanghai, China'
    },
    createdAt: '2024-06-10T08:00:00Z',
    updatedAt: '2024-06-10T12:30:00Z',
    weight: 15000,
    dimensions: '40ft x 8ft x 8.5ft',
    description: 'Electronics and machinery parts'
  },
  {
    id: 'SHP002',
    containerId: 'CONT789012',
    status: 'pending',
    currentLocation: {
      lat: 40.7831,
      lng: -73.9712,
      name: 'Port of New York, NY'
    },
    route: [
      { lat: 40.7831, lng: -73.9712, name: 'Port of New York, NY' },
      { lat: 51.5074, lng: -0.1278, name: 'London, UK' },
      { lat: 52.5200, lng: 13.4050, name: 'Berlin, Germany' }
    ],
    eta: '2024-06-18T09:00:00Z',
    origin: {
      lat: 40.7831,
      lng: -73.9712,
      name: 'Port of New York, NY'
    },
    destination: {
      lat: 53.5511,
      lng: 9.9937,
      name: 'Port of Hamburg, Germany'
    },
    createdAt: '2024-06-09T10:15:00Z',
    updatedAt: '2024-06-09T10:15:00Z',
    weight: 8500,
    dimensions: '20ft x 8ft x 8.5ft',
    description: 'Automotive parts and accessories'
  },
  {
    id: 'SHP003',
    containerId: 'CONT345678',
    status: 'delivered',
    currentLocation: {
      lat: 51.5074,
      lng: -0.1278,
      name: 'London, UK'
    },
    route: [
      { lat: 25.2048, lng: 55.2708, name: 'Dubai, UAE' },
      { lat: 36.8985, lng: 30.7133, name: 'Antalya, Turkey' },
      { lat: 51.5074, lng: -0.1278, name: 'London, UK' }
    ],
    eta: '2024-06-12T16:45:00Z',
    origin: {
      lat: 25.2048,
      lng: 55.2708,
      name: 'Dubai, UAE'
    },
    destination: {
      lat: 51.5074,
      lng: -0.1278,
      name: 'London, UK'
    },
    createdAt: '2024-06-05T14:20:00Z',
    updatedAt: '2024-06-12T16:45:00Z',
    weight: 12000,
    dimensions: '40ft x 8ft x 9.5ft',
    description: 'Textiles and fashion goods'
  },
  {
    id: 'SHP004',
    containerId: 'CONT901234',
    status: 'delayed',
    currentLocation: {
      lat: 1.3521,
      lng: 103.8198,
      name: 'Singapore Port'
    },
    route: [
      { lat: 22.3193, lng: 114.1694, name: 'Hong Kong' },
      { lat: 1.3521, lng: 103.8198, name: 'Singapore Port' },
      { lat: -33.8688, lng: 151.2093, name: 'Sydney, Australia' }
    ],
    eta: '2024-06-20T11:30:00Z',
    origin: {
      lat: 22.3193,
      lng: 114.1694,
      name: 'Hong Kong'
    },
    destination: {
      lat: -33.8688,
      lng: 151.2093,
      name: 'Sydney, Australia'
    },
    createdAt: '2024-06-08T09:30:00Z',
    updatedAt: '2024-06-10T15:20:00Z',
    weight: 18500,
    dimensions: '45ft x 8ft x 9.5ft',
    description: 'Industrial machinery and equipment'
  }
];
