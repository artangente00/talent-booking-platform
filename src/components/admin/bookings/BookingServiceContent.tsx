
import React from 'react';
import { addDays, startOfWeek } from 'date-fns';
import WeekNavigation from './WeekNavigation';
import BookingCalendarGrid from './BookingCalendarGrid';
import BookingSummaryStats from './BookingSummaryStats';
import { Service, Booking } from './types';
import { TIME_SLOTS } from './constants';
import { getBookingForTimeSlot, getStatusColor } from './utils';

interface BookingServiceContentProps {
  service: Service;
  bookings: Booking[];
  currentWeek: Date;
  setCurrentWeek: (week: Date) => void;
}

const BookingServiceContent = ({ 
  service, 
  bookings, 
  currentWeek, 
  setCurrentWeek 
}: BookingServiceContentProps) => {
  const getServiceBookings = (serviceId: string) => {
    // Map service ID to service title for filtering
    const serviceObj = service;
    if (!serviceObj) return [];
    
    console.log(`Getting bookings for service: ${serviceObj.title}`);
    
    // Filter bookings by service_type matching the service title
    const filteredBookings = bookings.filter(booking => {
      const serviceTypeMatch = booking.service_type.toLowerCase() === serviceObj.title.toLowerCase();
      console.log(`Booking service_type: ${booking.service_type}, Service title: ${serviceObj.title}, Match: ${serviceTypeMatch}`);
      return serviceTypeMatch;
    });
    
    console.log(`Found ${filteredBookings.length} bookings for ${serviceObj.title}`);
    return filteredBookings;
  };

  const getWeekDays = () => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const serviceBookings = getServiceBookings(service.id);
  const weekDays = getWeekDays();

  const handleGetBookingForTimeSlot = (date: Date, timeSlot: string) => {
    return getBookingForTimeSlot(date, timeSlot, serviceBookings);
  };

  return (
    <>
      <WeekNavigation 
        currentWeek={currentWeek}
        weekDays={weekDays}
        onWeekChange={setCurrentWeek}
      />

      <BookingCalendarGrid
        weekDays={weekDays}
        timeSlots={TIME_SLOTS}
        serviceId={service.id}
        getBookingForTimeSlot={handleGetBookingForTimeSlot}
        getStatusColor={getStatusColor}
      />

      <BookingSummaryStats 
        serviceBookings={serviceBookings}
      />
    </>
  );
};

export default BookingServiceContent;
