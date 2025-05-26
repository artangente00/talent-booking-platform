
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Service, Booking } from '../types';
import { getMockTalentName } from '../utils';

export const useBookingsData = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      // Fetch services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('id, title, icon_name')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (servicesError) throw servicesError;
      
      console.log('Services data:', servicesData);
      setServices(servicesData || []);

      // Fetch bookings with customer data
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          customers (
            first_name,
            middle_name,
            last_name
          )
        `)
        .order('booking_date', { ascending: true });

      if (bookingsError) throw bookingsError;

      console.log('Raw bookings data:', bookingsData);

      // Process bookings and add mock talent data
      const processedBookings = (bookingsData || []).map(booking => ({
        id: booking.id,
        booking_date: booking.booking_date,
        booking_time: booking.booking_time,
        service_address: booking.service_address,
        service_type: booking.service_type,
        status: booking.status,
        customer: booking.customers,
        talent_name: getMockTalentName(),
      }));

      console.log('Processed bookings:', processedBookings);
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

  useEffect(() => {
    fetchData();
  }, []);

  return { services, bookings, loading };
};
