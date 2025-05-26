
import React from 'react';
import { MapPin } from 'lucide-react';
import { Booking } from './types';

interface BookingCardProps {
  booking: Booking;
  statusColor: string;
}

const BookingCard = ({ booking, statusColor }: BookingCardProps) => {
  const getFullName = (customer: { first_name: string; middle_name: string | null; last_name: string }) => {
    const middleName = customer.middle_name ? ` ${customer.middle_name}` : '';
    return `${customer.first_name}${middleName} ${customer.last_name}`;
  };

  return (
    <div className={`rounded p-2 text-xs border ${statusColor}`}>
      <div className="font-medium truncate">
        {booking.talent_name}
      </div>
      <div className="text-gray-600 truncate">
        {getFullName(booking.customer)}
      </div>
      <div className="flex items-center gap-1 mt-1">
        <MapPin className="w-3 h-3" />
        <span className="truncate">{booking.service_address}</span>
      </div>
    </div>
  );
};

export default BookingCard;
