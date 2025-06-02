
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

      // Fetch bookings with customer details, including the new booking_status field
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

      // Transform bookings data to match the Booking interface
      const transformedBookings = (bookingsData || []).map(booking => ({
        id: booking.id,
        booking_date: booking.booking_date,
        booking_time: booking.booking_time,
        service_address: booking.service_address,
        service_type: booking.service_type,
        status: booking.status,
        booking_status: booking.booking_status || 'active',
        customer: {
          first_name: booking.customers?.first_name || '',
          middle_name: booking.customers?.middle_name || null,
          last_name: booking.customers?.last_name || ''
        },
        talent_name: booking.assigned_talent_id ? 'Assigned Talent' : undefined,
        cancelled_at: booking.cancelled_at,
        cancellation_reason: booking.cancellation_reason
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
