
import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'pending' | 'in-transit' | 'delivered' | 'delayed';
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        };
      case 'in-transit':
        return {
          label: 'In Transit',
          className: 'bg-blue-100 text-blue-800 border-blue-200',
        };
      case 'delivered':
        return {
          label: 'Delivered',
          className: 'bg-green-100 text-green-800 border-green-200',
        };
      case 'delayed':
        return {
          label: 'Delayed',
          className: 'bg-red-100 text-red-800 border-red-200',
        };
      default:
        return {
          label: 'Unknown',
          className: 'bg-gray-100 text-gray-800 border-gray-200',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      config.className
    )}>
      <div className={cn(
        'w-1.5 h-1.5 rounded-full mr-1.5',
        status === 'pending' && 'bg-yellow-400',
        status === 'in-transit' && 'bg-blue-400',
        status === 'delivered' && 'bg-green-400',
        status === 'delayed' && 'bg-red-400'
      )} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
