
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, User, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format, isSameDay } from 'date-fns';
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
  talent_name?: string; // Mock data for now
}

const BookingsManagement = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeService, setActiveService] = useState<string>('');
  const { toast } = useToast();

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
        talent_name: getMockTalentName(), // Mock talent assignment
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

  // Mock function to generate talent names
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

  const getBookingsForDate = (date: Date, serviceTitle: string) => {
    const serviceBookings = getServiceBookings(serviceTitle);
    return serviceBookings.filter(booking => 
      isSameDay(new Date(booking.booking_date), date)
    );
  };

  const getDatesWithBookings = (serviceTitle: string) => {
    const serviceBookings = getServiceBookings(serviceTitle);
    return serviceBookings.map(booking => new Date(booking.booking_date));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const currentService = services.find(s => s.id === activeService);
  const selectedDateBookings = selectedDate && currentService 
    ? getBookingsForDate(selectedDate, currentService.title)
    : [];

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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calendar View */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {getIcon(service.icon_name)}
                    {service.title} Calendar
                  </h3>
                  <div className="border rounded-lg p-4">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="w-full pointer-events-auto"
                      modifiers={{
                        hasBookings: getDatesWithBookings(service.title)
                      }}
                      modifiersStyles={{
                        hasBookings: {
                          backgroundColor: '#fef3c7',
                          color: '#92400e',
                          fontWeight: 'bold'
                        }
                      }}
                    />
                    <div className="mt-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-200 rounded"></div>
                        <span>Days with bookings</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bookings for Selected Date */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    {selectedDate ? `Bookings for ${format(selectedDate, 'MMMM d, yyyy')}` : 'Select a date'}
                  </h3>
                  
                  {selectedDate && (
                    <div className="space-y-3">
                      {selectedDateBookings.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>No bookings for this date</p>
                        </div>
                      ) : (
                        selectedDateBookings.map((booking) => (
                          <Card key={booking.id} className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-sm font-medium">
                                    <Clock className="w-4 h-4" />
                                    {booking.booking_time}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <User className="w-4 h-4" />
                                    {booking.customer.full_name}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    {booking.service_address}
                                  </div>
                                </div>
                                <Badge className={`${getStatusColor(booking.status)} border-0`}>
                                  {booking.status.replace('_', ' ').toUpperCase()}
                                </Badge>
                              </div>
                              
                              {/* Talent Assignment - Mock Data */}
                              <div className="pt-2 border-t">
                                <div className="flex items-center justify-between">
                                  <div className="text-sm">
                                    <span className="text-gray-600">Assigned Talent:</span>
                                    <span className="ml-2 font-medium text-blue-600">
                                      {booking.talent_name}
                                    </span>
                                  </div>
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-blue-600" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))
                      )}
                    </div>
                  )}
                </div>
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
