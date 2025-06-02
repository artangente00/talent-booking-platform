
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, MapPin, User, UserCheck, UserX } from 'lucide-react';
import { BookingWithCustomer, SuggestedTalent, AssignedTalent } from './types';
import TalentSelector from './TalentSelector';

interface BookingAssignmentCardProps {
  booking: BookingWithCustomer;
  assignedTalent?: AssignedTalent;
  onGetSuggestedTalents: (customerCity: string, serviceType: string) => Promise<SuggestedTalent[]>;
  onAssignTalent: (bookingId: string, talentId: string) => void;
  onUnassignTalent: (bookingId: string) => void;
}

const BookingAssignmentCard = ({
  booking,
  assignedTalent,
  onGetSuggestedTalents,
  onAssignTalent,
  onUnassignTalent
}: BookingAssignmentCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [suggestedTalents, setSuggestedTalents] = useState<SuggestedTalent[]>([]);
  const [loading, setLoading] = useState(false);

  const customerName = booking.customers 
    ? `${booking.customers.first_name || ''} ${booking.customers.middle_name || ''} ${booking.customers.last_name || ''}`.trim()
    : 'Unknown Customer';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleOpenDialog = async () => {
    setIsDialogOpen(true);
    setLoading(true);
    
    const customerCity = booking.customers?.city_municipality || '';
    console.log('Opening dialog for booking:', {
      bookingId: booking.id,
      serviceType: booking.service_type,
      customerCity,
      customerData: booking.customers
    });
    
    const talents = await onGetSuggestedTalents(customerCity, booking.service_type);
    console.log('Received talents:', talents);
    setSuggestedTalents(talents);
    setLoading(false);
  };

  const handleSelectTalent = (talentId: string) => {
    onAssignTalent(booking.id, talentId);
    setIsDialogOpen(false);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{booking.service_type}</CardTitle>
          <Badge className={`${getStatusColor(booking.status)} border-0`}>
            {booking.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Customer:</span>
              <span>{customerName}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Date:</span>
              <span>{formatDate(booking.booking_date)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Time:</span>
              <span>{booking.booking_time}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
              <span className="font-medium">Address:</span>
              <span className="text-right flex-1">{booking.service_address}</span>
            </div>
            
            {booking.customers?.city_municipality && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="font-medium">City:</span>
                <span>{booking.customers.city_municipality}</span>
              </div>
            )}
          </div>
        </div>

        {/* Assignment Section */}
        <div className="pt-4 border-t">
          {assignedTalent ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={assignedTalent.profile_photo_url || undefined} />
                  <AvatarFallback>
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{assignedTalent.full_name}</p>
                  <p className="text-xs text-gray-600">
                    {assignedTalent.hourly_rate ? `₱${assignedTalent.hourly_rate}/day` : 'Rate not specified'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={handleOpenDialog}>
                      <UserCheck className="w-4 h-4 mr-2" />
                      Reassign
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Select Freelancer for {booking.service_type}</DialogTitle>
                    </DialogHeader>
                    <TalentSelector
                      suggestedTalents={suggestedTalents}
                      onSelectTalent={handleSelectTalent}
                      loading={loading}
                    />
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onUnassignTalent(booking.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <UserX className="w-4 h-4 mr-2" />
                  Unassign
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleOpenDialog} className="w-full">
                    <UserCheck className="w-4 h-4 mr-2" />
                    Assign Freelancer
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Select Freelancer for {booking.service_type}</DialogTitle>
                    <p className="text-sm text-gray-600">
                      Customer location: {booking.customers?.city_municipality || 'Not specified'}
                    </p>
                  </DialogHeader>
                  <TalentSelector
                    suggestedTalents={suggestedTalents}
                    onSelectTalent={handleSelectTalent}
                    loading={loading}
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingAssignmentCard;
