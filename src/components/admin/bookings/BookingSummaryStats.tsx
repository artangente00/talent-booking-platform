
import React from 'react';
import { Card } from '@/components/ui/card';
import { Booking } from './types';

interface BookingSummaryStatsProps {
  serviceBookings: Booking[];
}

const BookingSummaryStats = ({ serviceBookings }: BookingSummaryStatsProps) => {
  const stats = [
    { 
      label: 'Total Bookings', 
      value: serviceBookings.length, 
      color: 'bg-blue-50 text-blue-700' 
    },
    { 
      label: 'Pending', 
      value: serviceBookings.filter(b => b.status === 'pending').length, 
      color: 'bg-yellow-50 text-yellow-700' 
    },
    { 
      label: 'Confirmed', 
      value: serviceBookings.filter(b => b.status === 'confirmed').length, 
      color: 'bg-green-50 text-green-700' 
    },
    { 
      label: 'Completed', 
      value: serviceBookings.filter(b => b.status === 'completed').length, 
      color: 'bg-purple-50 text-purple-700' 
    },
  ];

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className={`p-4 ${stat.color}`}>
          <div className="text-center">
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm">{stat.label}</div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default BookingSummaryStats;
