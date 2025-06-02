import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BookingWithCustomer, SuggestedTalent, AssignedTalent } from '../types';

export const useAssignmentsData = () => {
  const [bookings, setBookings] = useState<BookingWithCustomer[]>([]);
  const [assignedTalents, setAssignedTalents] = useState<Record<string, AssignedTalent>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBookings = async () => {
    try {
      const { data: bookingsData, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customers (
            first_name,
            middle_name,
            last_name,
            city_municipality
          )
        `)
        .order('booking_date', { ascending: true });

      if (error) throw error;

      console.log('Bookings data:', bookingsData);
      setBookings(bookingsData || []);

      // Fetch assigned talents for bookings that have assignments
      const assignedBookings = (bookingsData || []).filter(booking => booking.assigned_talent_id);
      if (assignedBookings.length > 0) {
        const talentIds = assignedBookings.map(booking => booking.assigned_talent_id);
        const { data: talentsData, error: talentsError } = await supabase
          .from('talents')
          .select('id, full_name, profile_photo_url, hourly_rate')
          .in('id', talentIds);

        if (talentsError) throw talentsError;

        const talentsMap = (talentsData || []).reduce((acc, talent) => {
          acc[talent.id] = talent;
          return acc;
        }, {} as Record<string, AssignedTalent>);

        setAssignedTalents(talentsMap);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load bookings data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSuggestedTalents = async (customerCity: string, serviceType: string): Promise<SuggestedTalent[]> => {
    try {
      console.log('Getting suggested talents for:', { customerCity, serviceType });
      
      // First, let's check what talents we have and their statuses
      const { data: allTalents, error: allTalentsError } = await supabase
        .from('talents')
        .select('*');
      
      console.log('All talents in database:', allTalents);
      console.log('Talents with status breakdown:', 
        allTalents?.map(t => ({ name: t.full_name, status: t.status, services: t.services, address: t.address }))
      );
      
      if (allTalentsError) {
        console.error('Error fetching all talents:', allTalentsError);
      }

      // Let's also try a direct query to see what we get with different status filters
      const { data: approvedTalents, error: approvedError } = await supabase
        .from('talents')
        .select('*')
        .eq('status', 'approved');
      
      console.log('Approved talents:', approvedTalents);

      const { data: pendingTalents, error: pendingError } = await supabase
        .from('talents')
        .select('*')
        .eq('status', 'pending');
      
      console.log('Pending talents:', pendingTalents);

      // Updated RPC call - let's also try a manual query first to debug
      const { data: manualQuery, error: manualError } = await supabase
        .from('talents')
        .select('*')
        .in('status', ['approved', 'pending']);
      
      console.log('Manual query result:', manualQuery);
      
      // Check if any talents match the service
      const matchingTalents = manualQuery?.filter(talent => 
        talent.services && talent.services.includes(serviceType)
      );
      console.log('Talents matching service type:', matchingTalents);

      // Use the RPC function but update to include pending status
      const { data, error } = await supabase.rpc('get_suggested_talents', {
        customer_city: customerCity,
        service_type: serviceType
      });

      console.log('RPC call result:', { data, error });

      if (error) {
        console.error('RPC error:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error getting suggested talents:', error);
      return [];
    }
  };

  const assignTalent = async (bookingId: string, talentId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('bookings')
        .update({
          assigned_talent_id: talentId,
          assigned_at: new Date().toISOString(),
          assigned_by: user?.id,
          status: 'assigned'
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Freelancer assigned successfully.",
      });

      // Refresh data
      fetchBookings();
    } catch (error) {
      console.error('Error assigning talent:', error);
      toast({
        title: "Error",
        description: "Failed to assign freelancer.",
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
          assigned_at: null,
          assigned_by: null,
          status: 'pending'
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Freelancer unassigned successfully.",
      });

      // Refresh data
      fetchBookings();
    } catch (error) {
      console.error('Error unassigning talent:', error);
      toast({
        title: "Error",
        description: "Failed to unassign freelancer.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return { 
    bookings, 
    assignedTalents, 
    loading, 
    getSuggestedTalents, 
    assignTalent, 
    unassignTalent,
    refreshData: fetchBookings
  };
};
