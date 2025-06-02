
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar, Clock, MapPin, User, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface BookingFormProps {
  children: React.ReactNode;
  preselectedService?: string;
}

interface Customer {
  id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string;
  contact_number: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ children, preselectedService }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    service: preselectedService || '',
    name: '',
    email: '',
    phone: '',
    address: '',
    date: '',
    time: '',
    duration: '',
    notes: ''
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchCustomerData(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchCustomerData(session.user.id);
      } else {
        setCustomer(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchCustomerData = async (userId: string) => {
    try {
      const { data: customerData, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching customer data:', error);
        return;
      }

      setCustomer(customerData);
      // Pre-fill form with customer data
      const fullName = `${customerData.first_name || ''} ${customerData.middle_name || ''} ${customerData.last_name || ''}`.trim();
      setFormData(prev => ({
        ...prev,
        name: fullName,
        email: customerData.email,
        phone: customerData.contact_number
      }));
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
  };

  const handleBookingClick = () => {
    if (!user) {
      // Redirect to auth page if user is not signed in
      navigate('/auth');
      return;
    }
    // Open booking form if user is authenticated
    setIsOpen(true);
  };

  const services = [
    'Cleaning Services',
    'Driver Services',
    'Babysitting',
    'Elderly Care',
    'Laundry Services'
  ];

  const timeSlots = [
    '12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM', '05:00 AM',
    '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM'
  ];

  const durations = [
    '3 hours',
    '4 hours',
    '6 hours',
    '8 hours',
    '12 hours',
    '24 hours'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customer) {
      toast({
        title: "Error",
        description: "Customer data not found. Please try signing in again.",
        variant: "destructive"
      });
      return;
    }

    // Basic validation
    if (!formData.service || !formData.name || !formData.email || !formData.phone || !formData.address || !formData.date || !formData.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert booking into database
      const { error } = await supabase
        .from('bookings')
        .insert({
          customer_id: customer.id,
          service_type: formData.service,
          service_address: formData.address,
          booking_date: formData.date,
          booking_time: formData.time,
          duration: formData.duration || null,
          special_instructions: formData.notes || null
        });

      if (error) throw error;

      toast({
        title: "Booking Submitted!",
        description: "We'll contact you within 2 hours to confirm your booking.",
      });

      // Reset form and close modal
      const fullName = `${customer.first_name || ''} ${customer.middle_name || ''} ${customer.last_name || ''}`.trim();
      setFormData({
        service: preselectedService || '',
        name: fullName,
        email: customer.email,
        phone: customer.contact_number,
        address: '',
        date: '',
        time: '',
        duration: '',
        notes: ''
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast({
        title: "Error",
        description: "Failed to submit booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div onClick={handleBookingClick}>
          {children}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-kwikie-orange flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Book Your Service
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Selection */}
          <div className="space-y-2">
            <Label htmlFor="service" className="text-sm font-medium">
              Service Type *
            </Label>
            <Select value={formData.service} onValueChange={(value) => handleInputChange('service', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium flex items-center gap-1">
                <User className="w-4 h-4" />
                Full Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                disabled
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-1">
                <Phone className="w-4 h-4" />
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+63 9XX XXX XXXX"
                disabled
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium flex items-center gap-1">
              <Mail className="w-4 h-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="your.email@example.com"
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Service Address *
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter complete address where service will be provided"
              rows={3}
            />
          </div>

          {/* Scheduling */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Preferred Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-medium flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Preferred Time *
              </Label>
              <Select value={formData.time} onValueChange={(value) => handleInputChange('time', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration" className="text-sm font-medium">
              Expected Duration
            </Label>
            <Select value={formData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration (optional)" />
              </SelectTrigger>
              <SelectContent>
                {durations.map((duration) => (
                  <SelectItem key={duration} value={duration}>
                    {duration}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Special Instructions
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any specific requirements or instructions for the service provider..."
              rows={3}
            />
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-kwikie-orange hover:bg-kwikie-red flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 text-center">
            * Required fields. We'll contact you within 2 hours to confirm your booking.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingForm;
