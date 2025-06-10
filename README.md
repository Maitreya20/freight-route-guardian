
# CargoTracker - Cargo Shipment Tracker

A modern, full-featured cargo shipment tracking application built with React, TypeScript, and Tailwind CSS. This application provides real-time tracking capabilities for cargo shipments with an intuitive dashboard and interactive map visualization.

## Features

### 🚢 Shipment Management
- **Comprehensive Dashboard**: View all shipments in a clean, sortable table format
- **Real-time Status Updates**: Track shipment status (Pending, In Transit, Delivered, Delayed)
- **Advanced Filtering**: Search and filter shipments by ID, container ID, or location
- **Sorting Options**: Sort by shipment ID, status, or ETA

### 🗺️ Interactive Map & Tracking
- **Visual Location Tracking**: See current shipment location with map visualization
- **Route Display**: View complete shipment route from origin to destination
- **Location Updates**: Manually update shipment locations with real-time sync
- **ETA Calculations**: Display estimated time of arrival with automatic updates

### 📦 Shipment Details
- **Container Information**: Track container IDs and shipment details
- **Cargo Specifications**: Weight, dimensions, and cargo descriptions
- **Timeline Tracking**: Creation and last update timestamps
- **Status Management**: Visual status indicators with color-coded badges

### ✨ Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Professional Styling**: Clean, modern interface with intuitive navigation
- **Real-time Updates**: Live status updates and notifications
- **Accessibility**: Built with accessibility best practices

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development with full IntelliSense support
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **shadcn/ui** - High-quality, accessible UI components
- **Lucide React** - Beautiful, customizable icons
- **React Hook Form** - Efficient form handling with validation

### Backend Architecture (To Be Implemented)
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for shipment data
- **Mongoose** - ODM for MongoDB

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cargo-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080` to view the application

### Backend Setup (Future Implementation)

The backend will be implemented as a separate repository with the following structure:

```
cargo-tracker-backend/
├── src/
│   ├── models/
│   │   └── Shipment.js
│   ├── routes/
│   │   └── shipments.js
│   ├── controllers/
│   │   └── shipmentController.js
│   ├── middleware/
│   └── app.js
├── package.json
└── README.md
```

## API Endpoints (Backend - To Be Implemented)

### Shipment Routes
- `GET /api/shipments` - Retrieve all shipments
- `GET /api/shipment/:id` - Get specific shipment details
- `POST /api/shipment` - Create new shipment
- `POST /api/shipment/:id/update-location` - Update shipment location
- `GET /api/shipment/:id/eta` - Get estimated time of arrival

### Data Models

#### Shipment Model
```javascript
{
  id: String,           // Unique shipment identifier
  containerId: String,  // Container identifier
  status: String,       // pending, in-transit, delivered, delayed
  currentLocation: {
    lat: Number,
    lng: Number,
    name: String,
    timestamp: Date
  },
  route: Array,         // Array of location objects
  eta: Date,           // Estimated time of arrival
  origin: Object,      // Origin location details
  destination: Object, // Destination location details
  createdAt: Date,
  updatedAt: Date,
  weight: Number,      // Optional cargo weight
  dimensions: String,  // Optional cargo dimensions
  description: String  // Optional cargo description
}
```

## Environment Variables (Backend)

When implementing the backend, create a `.env` file with:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/cargotracker
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Application header
│   ├── ShipmentTable.tsx # Main shipments table
│   ├── ShipmentMap.tsx # Map visualization component
│   ├── StatusBadge.tsx # Status indicator component
│   ├── AddShipmentModal.tsx # New shipment form
│   └── ui/             # shadcn/ui components
├── data/               # Mock data and constants
│   └── mockShipments.ts
├── types/              # TypeScript type definitions
│   └── shipment.ts
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Application pages
│   └── Index.tsx       # Main dashboard page
└── styles/             # Global styles
```

## Development Guidelines

### Code Style
- Use TypeScript for all new components
- Follow React hooks best practices
- Use functional components over class components
- Implement proper error handling
- Write meaningful commit messages

### Component Guidelines
- Keep components focused and single-purpose
- Use props interfaces for type safety
- Implement proper loading and error states
- Follow accessibility best practices

## Future Enhancements

### Phase 1 - Backend Implementation
- [ ] Set up Express.js server with MongoDB
- [ ] Implement authentication and authorization
- [ ] Create RESTful API endpoints
- [ ] Add data validation and error handling

### Phase 2 - Advanced Features
- [ ] Real-time WebSocket updates
- [ ] Interactive map with Mapbox/Google Maps
- [ ] Push notifications for status changes
- [ ] Advanced analytics and reporting

### Phase 3 - Production Features
- [ ] Docker containerization
- [ ] CI/CD pipeline setup
- [ ] Performance optimization
- [ ] Comprehensive testing suite

## Docker Setup (Future)

```dockerfile
# Frontend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "run", "preview"]
```

```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Note**: This is currently a frontend-only implementation with mock data. The backend API will be implemented in a separate repository following the MERN stack architecture described above.
