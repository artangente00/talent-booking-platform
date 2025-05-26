
import * as LucideIcons from 'lucide-react';
import { isSameDay } from 'date-fns';
import { Booking } from './types';

export const getMockTalentName = () => {
  const talents = ['Maria Santos', 'Juan Cruz', 'Anna Reyes', 'Pedro Garcia', 'Sofia Mendoza', 'Carlos Dela Cruz'];
  return talents[Math.floor(Math.random() * talents.length)];
};

export const getIcon = (iconName: string) => {
  const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Home;
  return <IconComponent size={16} />;
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'in_progress': return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'completed': return 'bg-green-100 text-green-800 border-green-300';
    case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

export const getBookingForTimeSlot = (
  date: Date, 
  timeSlot: string, 
  serviceBookings: Booking[]
) => {
  console.log(`Looking for booking on ${date.toDateString()} at ${timeSlot}`);
  
  const booking = serviceBookings.find(booking => {
    const bookingDate = new Date(booking.booking_date);
    const dateMatch = isSameDay(bookingDate, date);
    
    // Extract hour from booking_time and timeSlot for comparison
    const bookingTime = booking.booking_time.toLowerCase();
    const slotTime = timeSlot.toLowerCase();
    
    // Parse booking time (e.g., "08:00 am" or "2:30 pm")
    const bookingTimeMatch = bookingTime.match(/(\d{1,2}):?(\d{0,2})\s*(am|pm)/);
    const slotTimeMatch = slotTime.match(/(\d{1,2})\s*(am|pm)/);
    
    if (!bookingTimeMatch || !slotTimeMatch) {
      console.log(`Time parsing failed - Booking: ${bookingTime}, Slot: ${slotTime}`);
      return false;
    }
    
    let bookingHour = parseInt(bookingTimeMatch[1]);
    let slotHour = parseInt(slotTimeMatch[1]);
    const bookingPeriod = bookingTimeMatch[3];
    const slotPeriod = slotTimeMatch[2];
    
    // Convert to 24-hour format
    if (bookingPeriod === 'pm' && bookingHour !== 12) {
      bookingHour += 12;
    }
    if (bookingPeriod === 'am' && bookingHour === 12) {
      bookingHour = 0;
    }
    
    if (slotPeriod === 'pm' && slotHour !== 12) {
      slotHour += 12;
    }
    if (slotPeriod === 'am' && slotHour === 12) {
      slotHour = 0;
    }
    
    const timeMatch = bookingHour === slotHour;
    
    console.log(`Booking: ${booking.booking_date} ${booking.booking_time}, Date match: ${dateMatch}, Time match: ${timeMatch}, Booking hour: ${bookingHour}, Slot hour: ${slotHour}`);
    
    return dateMatch && timeMatch;
  });
  
  if (booking) {
    console.log(`Found booking:`, booking);
  }
  
  return booking;
};
