
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { addDays, startOfWeek, isSameDay } from 'date-fns';
import * as LucideIcons from 'lucide-react';
import WeekNavigation from './bookings/WeekNavigation';
import BookingCalendarGrid from './bookings/BookingCalendarGrid';
import BookingSummaryStats from './bookings/BookingSummaryStats';

interface Service {
  id: string;
  title: string;
  icon_name: string;
}

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

const BookingsManagement = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [activeService, setActiveService] = useState<string>('');
  const { toast } = useToast();

  // Time slots for the calendar (9 AM to 9 PM)
  const timeSlots = [
    '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', 
    '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('id, title, icon_name')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (servicesError) throw servicesError;
      setServices(servicesData || []);
      if (servicesData && servicesData.length > 0) {
        setActiveService(servicesData[0].id);
      }

      // Fetch bookings with customer data
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          customers (
            full_name
          )
        `)
        .order('booking_date', { ascending: true });

      if (bookingsError) throw bookingsError;

      // Process bookings and add mock talent data
      const processedBookings = (bookingsData || []).map(booking => ({
        id: booking.id,
        booking_date: booking.booking_date,
        booking_time: booking.booking_time,
        service_address: booking.service_address,
        status: booking.status,
        customer: booking.customers,
        talent_name: getMockTalentName(),
      }));

      setBookings(processedBookings);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load bookings data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getMockTalentName = () => {
    const talents = ['Maria Santos', 'Juan Cruz', 'Anna Reyes', 'Pedro Garcia', 'Sofia Mendoza', 'Carlos Dela Cruz'];
    return talents[Math.floor(Math.random() * talents.length)];
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Home;
    return <IconComponent size={16} />;
  };

  const getServiceBookings = (serviceTitle: string) => {
    return bookings.filter(booking => 
      booking.service_address.toLowerCase().includes(serviceTitle.toLowerCase()) ||
      serviceTitle.toLowerCase().includes(booking.service_address.toLowerCase())
    );
  };

  const getWeekDays = () => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const getBookingForTimeSlot = (date: Date, timeSlot: string, serviceTitle: string) => {
    const serviceBookings = getServiceBookings(serviceTitle);
    return serviceBookings.find(booking => 
      isSameDay(new Date(booking.booking_date), date) && 
      booking.booking_time.includes(timeSlot.split(' ')[0])
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'in_progress': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const weekDays = getWeekDays();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Bookings Management
        </CardTitle>
        <CardDescription>
          Monitor talent assignments and bookings by service category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeService} onValueChange={setActiveService}>
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${services.length}, minmax(0, 1fr))` }}>
            {services.map((service) => (
              <TabsTrigger key={service.id} value={service.id} className="flex items-center gap-2">
                {getIcon(service.icon_name)}
                <span className="hidden sm:inline">{service.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {services.map((service) => (
            <TabsContent key={service.id} value={service.id} className="mt-6">
              <WeekNavigation 
                currentWeek={currentWeek}
                weekDays={weekDays}
                onWeekChange={setCurrentWeek}
              />

              <BookingCalendarGrid
                weekDays={weekDays}
                timeSlots={timeSlots}
                serviceTitle={service.title}
                getBookingForTimeSlot={getBookingForTimeSlot}
                getStatusColor={getStatusColor}
              />

              <BookingSummaryStats 
                serviceBookings={getServiceBookings(service.title)}
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BookingsManagement;
