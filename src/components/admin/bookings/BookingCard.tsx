
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, User, AlertTriangle, X } from 'lucide-react';
import { Booking } from './types';

interface BookingCardProps {
  booking: Booking;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCustomerName = (customer: any) => {
    if (!customer) return 'Unknown Customer';
    return `${customer.first_name || ''} ${customer.middle_name || ''} ${customer.last_name || ''}`.trim();
  };

  const isCancelled = booking.booking_status === 'cancelled';

  return (
    <Card className={`h-full transition-all duration-200 hover:shadow-md ${isCancelled ? 'opacity-75 border-red-200 bg-red-50' : ''}`}>
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className={`font-semibold truncate ${isCancelled ? 'text-red-700' : 'text-gray-900'}`}>
              {booking.service_type}
              {isCancelled && (
                <X className="w-4 h-4 inline ml-2 text-red-600" />
              )}
            </h3>
            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
              <Clock className="w-3 h-3" />
              <span>{booking.booking_time}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Badge className={`${getStatusColor(booking.status)} text-xs`}>
              {booking.status.replace('_', ' ').toUpperCase()}
            </Badge>
            {isCancelled && (
              <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
                <AlertTriangle className="w-3 h-3 mr-1" />
                CANCELLED
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <User className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
            <span className={`text-sm truncate ${isCancelled ? 'text-red-600' : 'text-gray-700'}`}>
              {formatCustomerName(booking.customer)}
            </span>
          </div>
          
          <div className="flex items-start gap-2">
            <MapPin className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
            <span className={`text-sm line-clamp-2 ${isCancelled ? 'text-red-600' : 'text-gray-700'}`}>
              {booking.service_address}
            </span>
          </div>
        </div>

        {booking.talent_name && !isCancelled && (
          <div className="pt-2 border-t border-gray-100">
            <div className="text-xs text-gray-600">
              <span className="font-medium">Assigned:</span> {booking.talent_name}
            </div>
          </div>
        )}

        {isCancelled && (
          <div className="pt-2 border-t border-red-200">
            <div className="text-xs text-red-700 bg-red-100 p-2 rounded">
              <span className="font-medium">Booking Cancelled</span>
              {booking.cancellation_reason && (
                <div className="mt-1 text-red-600">
                  Reason: {booking.cancellation_reason}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingCard;
