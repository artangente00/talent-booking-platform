
import React from 'react';
import { format, isSameDay } from 'date-fns';
import BookingCard from './BookingCard';

interface Booking {
  id: string;
  booking_date: string;
  booking_time: string;
  service_address: string;
  service_type: string;
  status: string;
  customer: {
    full_name: string;
  };
  talent_name?: string;
}

interface BookingCalendarGridProps {
  weekDays: Date[];
  timeSlots: string[];
  serviceId: string;
  getBookingForTimeSlot: (date: Date, timeSlot: string, serviceId: string) => Booking | undefined;
  getStatusColor: (status: string) => string;
}

const BookingCalendarGrid = ({ 
  weekDays, 
  timeSlots, 
  serviceId, 
  getBookingForTimeSlot, 
  getStatusColor 
}: BookingCalendarGridProps) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Header with days */}
      <div className="grid grid-cols-8 bg-gray-50">
        <div className="p-3 text-sm font-medium text-gray-600 border-r">Time</div>
        {weekDays.map((day, index) => (
          <div key={index} className="p-3 text-center border-r last:border-r-0">
            <div className="text-sm font-medium text-gray-900">
              {format(day, 'EEE')}
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      {/* Time slots grid */}
      {timeSlots.map((timeSlot, timeIndex) => (
        <div key={timeSlot} className="grid grid-cols-8 border-t">
          <div className="p-3 text-sm font-medium text-gray-600 border-r bg-gray-50">
            {timeSlot}
          </div>
          {weekDays.map((day, dayIndex) => {
            const booking = getBookingForTimeSlot(day, timeSlot, serviceId);
            return (
              <div key={dayIndex} className="border-r last:border-r-0 min-h-[80px] p-1">
                {booking && (
                  <BookingCard 
                    booking={booking} 
                    statusColor={getStatusColor(booking.status)} 
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default BookingCalendarGrid;
