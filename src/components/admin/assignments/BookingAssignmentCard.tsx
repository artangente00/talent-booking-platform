
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, Clock, MapPin, User, UserPlus, UserX, Star, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Booking, AssignedTalent, SuggestedTalent } from './types';
import TalentSelector from './TalentSelector';

interface BookingAssignmentCardProps {
  booking: Booking;
  assignedTalent?: AssignedTalent;
  onGetSuggestedTalents: (customerCity: string, serviceType: string) => Promise<SuggestedTalent[]>;
  onAssignTalent: (bookingId: string, talentId: string) => Promise<void>;
  onUnassignTalent: (bookingId: string) => Promise<void>;
  onUpdateBookingStatus?: (bookingId: string, status: string) => Promise<void>;
}

const BookingAssignmentCard: React.FC<BookingAssignmentCardProps> = ({
  booking,
  assignedTalent,
  onGetSuggestedTalents,
  onAssignTalent,
  onUnassignTalent,
  onUpdateBookingStatus
}) => {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'assigned': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCustomerName = (customers: any) => {
    if (!customers) return 'Unknown Customer';
    return `${customers.first_name || ''} ${customers.middle_name || ''} ${customers.last_name || ''}`.trim();
  };

  const handleStatusChange = async (newStatus: string) => {
    if (onUpdateBookingStatus) {
      await onUpdateBookingStatus(booking.id, newStatus);
    }
  };

  const canChangeToCompleted = booking.status === 'assigned' && assignedTalent;
  const canAssignTalent = booking.status === 'pending' || booking.status === 'assigned';

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
            {booking.service_type}
          </CardTitle>
          <Badge className={`${getStatusColor(booking.status)} text-xs`}>
            {booking.status.toUpperCase()}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">{formatCustomerName(booking.customers)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 flex-shrink-0" />
            <span>{format(new Date(booking.booking_date), 'MMM dd, yyyy')}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>{booking.booking_time}</span>
          </div>
          
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-2">{booking.service_address}</span>
          </div>
          
          {booking.customers?.city_municipality && (
            <div className="text-xs text-gray-500">
              City: {booking.customers.city_municipality}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Assigned Talent Section */}
        {assignedTalent ? (
          <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={assignedTalent.profile_photo_url || ''} alt={assignedTalent.full_name} />
                <AvatarFallback>
                  {assignedTalent.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-green-800 truncate">{assignedTalent.full_name}</h4>
                <p className="text-xs text-green-600 line-clamp-2">{assignedTalent.address}</p>
                <div className="flex items-center gap-4 mt-1 text-xs text-green-600">
                  {assignedTalent.hourly_rate && (
                    <span>₱{assignedTalent.hourly_rate}/hr</span>
                  )}
                  {assignedTalent.experience && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      <span>{assignedTalent.experience}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800 font-medium">No talent assigned</p>
            <p className="text-xs text-yellow-600">Click "Assign Freelancer" to assign a talent to this booking.</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {canAssignTalent && (
            <div className="flex gap-2">
              <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    disabled={booking.status === 'completed' || booking.status === 'cancelled'}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {assignedTalent ? 'Reassign' : 'Assign Freelancer'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Assign Freelancer to Booking</DialogTitle>
                  </DialogHeader>
                  <TalentSelector
                    booking={booking}
                    onGetSuggestedTalents={onGetSuggestedTalents}
                    onAssignTalent={async (talentId) => {
                      await onAssignTalent(booking.id, talentId);
                      setIsAssignDialogOpen(false);
                    }}
                  />
                </DialogContent>
              </Dialog>
              
              {assignedTalent && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onUnassignTalent(booking.id)}
                  disabled={booking.status === 'completed' || booking.status === 'cancelled'}
                >
                  <UserX className="w-4 h-4 mr-2" />
                  Unassign
                </Button>
              )}
            </div>
          )}

          {/* Status Change Button */}
          {canChangeToCompleted && onUpdateBookingStatus && (
            <Button 
              onClick={() => handleStatusChange('completed')}
              className="w-full bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark as Completed
            </Button>
          )}

          {/* Status Selector for other status changes */}
          {onUpdateBookingStatus && booking.status !== 'completed' && booking.status !== 'cancelled' && (
            <Select onValueChange={handleStatusChange} value={booking.status}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Change Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingAssignmentCard;
