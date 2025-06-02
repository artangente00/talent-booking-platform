
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Booking, AssignedTalent, SuggestedTalent } from '../types';
import { useToast } from '@/hooks/use-toast';

export const useAssignmentsData = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [assignedTalents, setAssignedTalents] = useState<Record<string, AssignedTalent>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch bookings with customer details and assigned talent info
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          customers (
            first_name,
            middle_name,
            last_name,
            city_municipality
          ),
          talents (
            id,
            full_name,
            address,
            phone,
            profile_photo_url,
            hourly_rate,
            experience
          )
        `)
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;

      console.log('Fetched bookings data:', bookingsData);

      // Transform booking data and extract assigned talents
      const transformedBookings: Booking[] = [];
      const talentsMap: Record<string, AssignedTalent> = {};

      (bookingsData || []).forEach((booking) => {
        const transformedBooking: Booking = {
          id: booking.id,
          service_type: booking.service_type,
          service_address: booking.service_address,
          booking_date: booking.booking_date,
          booking_time: booking.booking_time,
          status: booking.status,
          booking_status: booking.booking_status || 'active',
          assigned_talent_id: booking.assigned_talent_id,
          assigned_at: booking.assigned_at,
          assigned_by: booking.assigned_by,
          customers: booking.customers,
          created_at: booking.created_at,
          updated_at: booking.updated_at,
          special_instructions: booking.special_instructions,
          duration: booking.duration,
          cancelled_at: booking.cancelled_at,
          cancellation_reason: booking.cancellation_reason
        };

        transformedBookings.push(transformedBooking);

        // If there's an assigned talent, add to the talents map
        if (booking.assigned_talent_id && booking.talents) {
          talentsMap[booking.assigned_talent_id] = {
            id: booking.talents.id,
            full_name: booking.talents.full_name,
            address: booking.talents.address,
            phone: booking.talents.phone,
            profile_photo_url: booking.talents.profile_photo_url,
            hourly_rate: booking.talents.hourly_rate,
            experience: booking.talents.experience
          };
        }
      });

      console.log('Transformed bookings:', transformedBookings);
      setBookings(transformedBookings);
      setAssignedTalents(talentsMap);
    } catch (error) {
      console.error('Error fetching assignments data:', error);
      toast({
        title: "Error",
        description: "Failed to load assignments data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSuggestedTalents = async (customerCity: string, serviceType: string): Promise<SuggestedTalent[]> => {
    try {
      const { data, error } = await supabase.rpc('get_suggested_talents', {
        customer_city: customerCity,
        service_type: serviceType
      });

      if (error) throw error;

      return (data || []).map((talent: any) => ({
        talent_id: talent.talent_id,
        full_name: talent.full_name,
        address: talent.address,
        services: talent.services,
        profile_photo_url: talent.profile_photo_url,
        hourly_rate: talent.hourly_rate,
        experience: talent.experience,
        match_score: talent.match_score
      }));
    } catch (error) {
      console.error('Error fetching suggested talents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch suggested talents.",
        variant: "destructive",
      });
      return [];
    }
  };

  const assignTalent = async (bookingId: string, talentId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('bookings')
        .update({
          assigned_talent_id: talentId,
          assigned_by: user.id,
          assigned_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Talent assigned successfully!",
      });

      // Refresh data
      await fetchData();
    } catch (error) {
      console.error('Error assigning talent:', error);
      toast({
        title: "Error",
        description: "Failed to assign talent. Please try again.",
        variant: "destructive",
      });
    }
  };

  const unassignTalent = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          assigned_talent_id: null,
          assigned_by: null,
          assigned_at: null
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Talent unassigned successfully!",
      });

      // Refresh data
      await fetchData();
    } catch (error) {
      console.error('Error unassigning talent:', error);
      toast({
        title: "Error",
        description: "Failed to unassign talent. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    bookings,
    assignedTalents,
    loading,
    getSuggestedTalents,
    assignTalent,
    unassignTalent,
    refetch: fetchData
  };
};
