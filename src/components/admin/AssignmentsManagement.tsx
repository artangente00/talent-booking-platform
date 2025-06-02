
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCheck, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAssignmentsData } from './assignments/hooks/useAssignmentsData';
import BookingAssignmentCard from './assignments/BookingAssignmentCard';

interface Service {
  id: string;
  title: string;
}

const AssignmentsManagement = () => {
  const { 
    bookings, 
    assignedTalents, 
    loading, 
    getSuggestedTalents, 
    assignTalent, 
    unassignTalent,
    updateBookingStatus
  } = useAssignmentsData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);

  // Fetch services from Supabase
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('id, title')
          .eq('is_active', true)
          .order('title', { ascending: true });

        if (error) throw error;

        setServices(data || []);
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices([]);
      } finally {
        setServicesLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredBookings = bookings.filter(booking => {
    const customerName = booking.customers 
      ? `${booking.customers.first_name || ''} ${booking.customers.middle_name || ''} ${booking.customers.last_name || ''}`.trim().toLowerCase()
      : '';
    
    const matchesSearch = !searchTerm || 
      customerName.includes(searchTerm.toLowerCase()) ||
      booking.service_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service_address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesService = serviceFilter === 'all' || booking.service_type === serviceFilter;
    
    return matchesSearch && matchesService;
  });

  const getBookingsByStatus = (status: string) => {
    if (status === 'all') return bookings;
    return bookings.filter(booking => booking.status === status);
  };

  const getBookingStats = () => {
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const assigned = bookings.filter(b => b.status === 'assigned').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    
    return { total, pending, assigned, completed, cancelled };
  };

  const stats = getBookingStats();

  const renderBookingsGrid = (statusBookings: any[]) => {
    const filteredStatusBookings = statusBookings.filter(booking => {
      const customerName = booking.customers 
        ? `${booking.customers.first_name || ''} ${booking.customers.middle_name || ''} ${booking.customers.last_name || ''}`.trim().toLowerCase()
        : '';
      
      const matchesSearch = !searchTerm || 
        customerName.includes(searchTerm.toLowerCase()) ||
        booking.service_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.service_address.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesService = serviceFilter === 'all' || booking.service_type === serviceFilter;
      
      return matchesSearch && matchesService;
    });

    if (filteredStatusBookings.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          <UserCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">No bookings found</p>
          <p className="text-sm">
            {searchTerm || serviceFilter !== 'all' 
              ? 'Try adjusting your filters or search terms.' 
              : 'No bookings available for this status.'}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStatusBookings.map((booking) => (
          <BookingAssignmentCard
            key={booking.id}
            booking={booking}
            assignedTalent={booking.assigned_talent_id ? assignedTalents[booking.assigned_talent_id] : undefined}
            onGetSuggestedTalents={getSuggestedTalents}
            onAssignTalent={assignTalent}
            onUnassignTalent={unassignTalent}
            onUpdateBookingStatus={updateBookingStatus}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="w-5 h-5" />
          Freelancer Assignments
        </CardTitle>
        <CardDescription>
          Manually assign freelancers to customer bookings based on location and service matching
        </CardDescription>
        
        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.assigned}</div>
            <div className="text-sm text-gray-600">Assigned</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            <div className="text-sm text-gray-600">Cancelled</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by customer name, service, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-4">
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {servicesLoading ? (
                  <SelectItem value="loading" disabled>Loading...</SelectItem>
                ) : (
                  services.map((service) => (
                    <SelectItem key={service.id} value={service.title}>
                      {service.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Status Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
            <TabsTrigger value="assigned">Assigned ({stats.assigned})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({stats.cancelled})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {renderBookingsGrid(bookings)}
          </TabsContent>

          <TabsContent value="pending">
            {renderBookingsGrid(getBookingsByStatus('pending'))}
          </TabsContent>

          <TabsContent value="assigned">
            {renderBookingsGrid(getBookingsByStatus('assigned'))}
          </TabsContent>

          <TabsContent value="completed">
            {renderBookingsGrid(getBookingsByStatus('completed'))}
          </TabsContent>

          <TabsContent value="cancelled">
            {renderBookingsGrid(getBookingsByStatus('cancelled'))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AssignmentsManagement;
