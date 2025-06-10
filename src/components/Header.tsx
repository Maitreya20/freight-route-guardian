
import React from 'react';
import { Package } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <Package size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">CargoTracker</h1>
              <p className="text-sm text-muted-foreground">Global Shipment Management</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Real-time Tracking</p>
            <p className="text-xs text-muted-foreground">Last updated: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
