
import React from 'react';
import { MapPin } from 'lucide-react';

interface Booking {
  id: string;
  booking_date: string;
  booking_time: string;
  service_address: string;
  status: string;
  customer: {
    full_name: string;
  };
  talent_name?: string;
}

interface BookingCardProps {
  booking: Booking;
  statusColor: string;
}

const BookingCard = ({ booking, statusColor }: BookingCardProps) => {
  return (
    <div className={`rounded p-2 text-xs border ${statusColor}`}>
      <div className="font-medium truncate">
        {booking.talent_name}
      </div>
      <div className="text-gray-600 truncate">
        {booking.customer.full_name}
      </div>
      <div className="flex items-center gap-1 mt-1">
        <MapPin className="w-3 h-3" />
        <span className="truncate">{booking.service_address}</span>
      </div>
    </div>
  );
};

export default BookingCard;
