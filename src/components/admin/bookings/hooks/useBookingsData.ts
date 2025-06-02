
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Service, Booking } from '../types';

export const useBookingsData = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch services from the database
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (servicesError) throw servicesError;

      // Transform services data to match the expected format
      const transformedServices = (servicesData || []).map(service => ({
        id: service.id,
        title: service.title,
        icon_name: service.icon_name
      }));

      setServices(transformedServices);

      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          customers (
            first_name,
            middle_name,
            last_name,
            address
          )
        `)
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;

      // Transform bookings data
      const transformedBookings = (bookingsData || []).map(booking => ({
        id: booking.id,
        service_type: booking.service_type,
        customer_name: booking.customers 
          ? `${booking.customers.first_name || ''} ${booking.customers.middle_name || ''} ${booking.customers.last_name || ''}`.trim()
          : 'Unknown Customer',
        address: booking.service_address,
        city: booking.customers?.address || '',
        date: booking.booking_date,
        time: booking.booking_time,
        status: booking.status,
        assigned_talent_id: booking.assigned_talent_id,
        customer_id: booking.customer_id
      }));

      setBookings(transformedBookings);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    services,
    bookings,
    loading,
    refetch: fetchData
  };
};
