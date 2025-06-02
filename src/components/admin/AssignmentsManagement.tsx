
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserCheck, Search, Filter } from 'lucide-react';
import { useAssignmentsData } from './assignments/hooks/useAssignmentsData';
import BookingAssignmentCard from './assignments/BookingAssignmentCard';

const AssignmentsManagement = () => {
  const { 
    bookings, 
    assignedTalents, 
    loading, 
    getSuggestedTalents, 
    assignTalent, 
    unassignTalent 
  } = useAssignmentsData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');

  const filteredBookings = bookings.filter(booking => {
    const customerName = booking.customers 
      ? `${booking.customers.first_name || ''} ${booking.customers.middle_name || ''} ${booking.customers.last_name || ''}`.trim().toLowerCase()
      : '';
    
    const matchesSearch = !searchTerm || 
      customerName.includes(searchTerm.toLowerCase()) ||
      booking.service_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service_address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesService = serviceFilter === 'all' || booking.service_type === serviceFilter;
    
    return matchesSearch && matchesStatus && matchesService;
  });

  const uniqueServices = [...new Set(bookings.map(booking => booking.service_type))];

  const getBookingStats = () => {
    const total = bookings.length;
    const assigned = bookings.filter(b => b.assigned_talent_id).length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    
    return { total, assigned, pending, unassigned: total - assigned };
  };

  const stats = getBookingStats();

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.assigned}</div>
            <div className="text-sm text-gray-600">Assigned</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{stats.unassigned}</div>
            <div className="text-sm text-gray-600">Unassigned</div>
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
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {uniqueServices.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bookings Grid */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <UserCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No bookings found</p>
            <p className="text-sm">
              {searchTerm || statusFilter !== 'all' || serviceFilter !== 'all' 
                ? 'Try adjusting your filters or search terms.' 
                : 'No bookings available for assignment.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => (
              <BookingAssignmentCard
                key={booking.id}
                booking={booking}
                assignedTalent={booking.assigned_talent_id ? assignedTalents[booking.assigned_talent_id] : undefined}
                onGetSuggestedTalents={getSuggestedTalents}
                onAssignTalent={assignTalent}
                onUnassignTalent={unassignTalent}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssignmentsManagement;
