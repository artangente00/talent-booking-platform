
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, User, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, startOfWeek, isSameDay, addWeeks, subWeeks } from 'date-fns';
import * as LucideIcons from 'lucide-react';

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

  const currentService = services.find(s => s.id === activeService);
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
              {/* Week Navigation */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <h2 className="text-xl font-semibold">
                    {format(weekDays[0], 'MMMM d')} - {format(weekDays[6], 'd, yyyy')}
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setCurrentWeek(new Date())}
                >
                  Today
                </Button>
              </div>

              {/* Weekly Calendar Grid */}
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
                      const booking = getBookingForTimeSlot(day, timeSlot, service.title);
                      return (
                        <div key={dayIndex} className="border-r last:border-r-0 min-h-[80px] p-1">
                          {booking && (
                            <div className={`rounded p-2 text-xs border ${getStatusColor(booking.status)}`}>
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
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Summary Stats for Service */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Bookings', value: getServiceBookings(service.title).length, color: 'bg-blue-50 text-blue-700' },
                  { label: 'Pending', value: getServiceBookings(service.title).filter(b => b.status === 'pending').length, color: 'bg-yellow-50 text-yellow-700' },
                  { label: 'Confirmed', value: getServiceBookings(service.title).filter(b => b.status === 'confirmed').length, color: 'bg-green-50 text-green-700' },
                  { label: 'Completed', value: getServiceBookings(service.title).filter(b => b.status === 'completed').length, color: 'bg-purple-50 text-purple-700' },
                ].map((stat, index) => (
                  <Card key={index} className={`p-4 ${stat.color}`}>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-sm">{stat.label}</div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BookingsManagement;
