
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
import ServicePricing from './ServicePricing';

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

interface SpecialPricing {
  duration: string;
  price: string;
}

interface Service {
  id: string;
  title: string;
  has_special_pricing: boolean;
  special_pricing: SpecialPricing[] | null;
}

const BookingForm: React.FC<BookingFormProps> = ({ children, preselectedService }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
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
      console.log('Auth session:', session?.user?.id);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchCustomerData(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchCustomerData(session.user.id);
      } else {
        setCustomer(null);
      }
    });

    // Fetch services data
    fetchServices();

    return () => subscription.unsubscribe();
  }, []);

  const fetchServices = async () => {
    try {
      console.log('Fetching services...');
      const { data, error } = await supabase
        .from('services')
        .select('id, title, has_special_pricing, special_pricing')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching services:', error);
        throw error;
      }
      
      console.log('Services fetched:', data?.length);
      const transformedData = (data || []).map(service => ({
        ...service,
        special_pricing: Array.isArray(service.special_pricing)
          ? (service.special_pricing as unknown as SpecialPricing[])
          : [],
      }));
      
      setServices(transformedData);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchCustomerData = async (userId: string) => {
    try {
      console.log('Fetching customer data for user:', userId);
      const { data: customerData, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching customer data:', error);
        // If customer doesn't exist, that's okay for now
        if (error.code === 'PGRST116') {
          console.log('Customer record not found - this is expected for new users');
          return;
        }
        throw error;
      }

      console.log('Customer data fetched:', customerData);
      setCustomer(customerData);
      // Pre-fill form with customer data
      const fullName = `${customerData.first_name || ''} ${customerData.middle_name || ''} ${customerData.last_name || ''}`.trim();
      setFormData(prev => ({
        ...prev,
        name: fullName,
        email: customerData.email,
        phone: customerData.contact_number || ''
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

  const serviceNames = [
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

  const defaultDurations = [
    '3 hours',
    '4 hours',
    '6 hours',
    '8 hours',
    '12 hours',
    '24 hours'
  ];

  const handleInputChange = (field: string, value: string) => {
    console.log(`Field changed: ${field} = ${value}`);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // When service changes, find the selected service and reset duration
    if (field === 'service') {
      const service = services.find(s => s.title === value);
      setSelectedService(service || null);
      setFormData(prev => ({
        ...prev,
        duration: '' // Reset duration when service changes
      }));
    }
  };

  const getDurationOptions = () => {
    if (selectedService?.has_special_pricing && selectedService.special_pricing?.length > 0) {
      return selectedService.special_pricing.map(pricing => ({
        value: pricing.duration,
        label: `${pricing.duration} - ${pricing.price}`
      }));
    }
    return defaultDurations.map(duration => ({
      value: duration,
      label: duration
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== BOOKING SUBMISSION STARTED ===');
    console.log('User ID:', user?.id);
    console.log('Customer:', customer);
    console.log('Form data:', formData);
    
    // Check if user is authenticated
    if (!user) {
      console.error('User not authenticated');
      toast({
        title: "Authentication Required",
        description: "Please sign in to make a booking.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    // If no customer record exists, create one first
    if (!customer) {
      console.log('No customer record found, creating one...');
      try {
        const newCustomerData = {
          user_id: user.id,
          first_name: formData.name.split(' ')[0] || '',
          middle_name: null,
          last_name: formData.name.split(' ').slice(1).join(' ') || '',
          email: formData.email,
          contact_number: formData.phone
        };

        console.log('Creating customer with data:', newCustomerData);
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert(newCustomerData)
          .select()
          .single();

        if (customerError) {
          console.error('Error creating customer:', customerError);
          throw customerError;
        }

        console.log('Customer created successfully:', newCustomer);
        setCustomer(newCustomer);
      } catch (error) {
        console.error('Failed to create customer:', error);
        toast({
          title: "Error",
          description: "Failed to create customer record. Please try again.",
          variant: "destructive"
        });
        return;
      }
    }

    // Validate required fields
    const requiredFields = ['service', 'name', 'email', 'phone', 'address', 'date', 'time'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      toast({
        title: "Missing Information",
        description: `Please fill in all required fields: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare selected pricing data for services with special pricing
      let selectedPricingData = null;
      if (selectedService?.has_special_pricing && formData.duration) {
        const selectedPricing = selectedService.special_pricing?.find(
          pricing => pricing.duration === formData.duration
        );
        if (selectedPricing) {
          selectedPricingData = {
            duration: selectedPricing.duration,
            price: selectedPricing.price
          };
        }
      }

      console.log('Selected pricing data:', selectedPricingData);

      // Use the customer we have (either existing or newly created)
      const customerToUse = customer!;

      // Prepare booking data
      const bookingData = {
        customer_id: customerToUse.id,
        service_type: formData.service,
        service_address: formData.address,
        booking_date: formData.date,
        booking_time: formData.time,
        duration: formData.duration || null,
        special_instructions: formData.notes || null,
        selected_pricing: selectedPricingData
      };

      console.log('Booking data to insert:', bookingData);

      // Insert booking into database
      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select();

      if (error) {
        console.error('Supabase booking insert error:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log('Booking inserted successfully:', data);

      toast({
        title: "Booking Submitted!",
        description: "We'll contact you within 2 hours to confirm your booking.",
      });

      // Reset form and close modal
      const fullName = `${customerToUse.first_name || ''} ${customerToUse.middle_name || ''} ${customerToUse.last_name || ''}`.trim();
      setFormData({
        service: preselectedService || '',
        name: fullName,
        email: customerToUse.email,
        phone: customerToUse.contact_number || '',
        address: '',
        date: '',
        time: '',
        duration: '',
        notes: ''
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting booking:', error);
      
      // Provide more specific error messages
      let errorMessage = "Failed to submit booking. Please try again.";
      if (error && typeof error === 'object' && 'message' in error) {
        const errorObj = error as any;
        if (errorObj.message?.includes('violates row-level security')) {
          errorMessage = "Permission denied. Please try signing out and back in.";
        } else if (errorObj.code === '23503') {
          errorMessage = "Invalid data provided. Please check your inputs.";
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set selected service when form opens with preselected service
  useEffect(() => {
    if (preselectedService && services.length > 0) {
      const service = services.find(s => s.title === preselectedService);
      setSelectedService(service || null);
    }
  }, [preselectedService, services]);

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
                {serviceNames.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Service Pricing Display */}
            {formData.service && (
              <ServicePricing selectedService={formData.service} />
            )}
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
                disabled={!!customer}
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
                disabled={!!customer}
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
              disabled={!!customer}
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
              {selectedService?.has_special_pricing ? 'Service Duration & Price *' : 'Expected Duration'}
            </Label>
            <Select value={formData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
              <SelectTrigger>
                <SelectValue placeholder={selectedService?.has_special_pricing ? "Select duration and price" : "Select duration (optional)"} />
              </SelectTrigger>
              <SelectContent>
                {getDurationOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
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
