
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CancelBookingDialogProps {
  bookingId: string;
  onBookingCancelled: () => void;
  children: React.ReactNode;
}

const CancelBookingDialog: React.FC<CancelBookingDialogProps> = ({ 
  bookingId, 
  onBookingCancelled, 
  children 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleCancel = async () => {
    if (!cancellationReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for cancellation.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('Starting cancellation process...');
      console.log('Booking ID:', bookingId);
      console.log('User ID:', user.id);
      console.log('Cancellation reason:', cancellationReason.trim());

      // First, let's check what the current user's customer ID is
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (customerError) {
        console.error('Error fetching customer data:', customerError);
        throw new Error('Unable to find customer profile');
      }

      console.log('Customer ID:', customerData.id);

      // Check if the booking exists and belongs to this customer
      const { data: existingBooking, error: fetchError } = await supabase
        .from('bookings')
        .select('id, customer_id, status, booking_status')
        .eq('id', bookingId)
        .eq('customer_id', customerData.id)
        .single();

      if (fetchError) {
        console.error('Error fetching booking:', fetchError);
        throw new Error('Booking not found or you do not have permission to cancel it');
      }

      console.log('Existing booking:', existingBooking);

      // Prepare the update data
      const updateData = {
        status: 'cancelled',
        booking_status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancelled_by: user.id,
        cancellation_reason: cancellationReason.trim()
      };

      console.log('Update data to be sent:', updateData);

      // Perform the update
      const { data: updatedData, error: updateError } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', bookingId)
        .eq('customer_id', customerData.id)
        .select('*');

      console.log('Supabase response:', { updatedData, updateError });

      if (updateError) {
        console.error('Supabase update error:', updateError);
        throw new Error(`Failed to update booking: ${updateError.message}`);
      }

      if (!updatedData || updatedData.length === 0) {
        console.warn('No data returned from update operation');
        throw new Error('Unable to cancel booking. The booking may not exist or you may not have permission.');
      }

      console.log('Update successful!');
      console.log('Updated booking data:', updatedData);

      toast({
        title: "Booking Cancelled",
        description: "Your booking has been successfully cancelled.",
      });

      setIsOpen(false);
      setCancellationReason('');
      onBookingCancelled();
    } catch (error) {
      console.error('Error in handleCancel:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Cancel Booking
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to cancel this booking? This action cannot be undone.
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium">
              Reason for cancellation *
            </Label>
            <Textarea
              id="reason"
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="Please explain why you're cancelling this booking..."
              rows={3}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              Keep Booking
            </Button>
            <Button
              onClick={handleCancel}
              className="bg-red-600 hover:bg-red-700 flex-1"
              disabled={isSubmitting || !cancellationReason.trim()}
            >
              {isSubmitting ? 'Cancelling...' : 'Cancel Booking'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CancelBookingDialog;
