
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import BookingForm from './BookingForm';

interface Customer {
  id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string;
  contact_number: string;
}

const MobileWelcomeSection = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);

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
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
  };

  const getCustomerDisplayName = (customer: Customer) => {
    return `${customer.first_name || ''} ${customer.middle_name || ''} ${customer.last_name || ''}`.trim();
  };

  if (!user || !customer) {
    return null;
  }

  return (
    <section className="py-8 px-4 bg-gray-50 md:hidden">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-2">
          Welcome, {getCustomerDisplayName(customer)}!
        </h1>
        <p className="text-gray-600 mb-6">
          Browse services and make a booking.
        </p>

        {/* Booking Status Section */}
        <div className="bg-white rounded-lg border border-kwikie-orange p-4 mb-6">
          <div className="flex items-center mb-3">
            <Calendar className="w-5 h-5 text-kwikie-orange mr-2" />
            <span className="text-gray-700">You have no bookings yet</span>
          </div>
          <p className="text-gray-500 text-sm mb-4">
            Schedule a service to get started
          </p>
          <BookingForm>
            <Button className="w-full bg-kwikie-orange hover:bg-kwikie-red text-white py-3">
              Book a Service
            </Button>
          </BookingForm>
        </div>
      </div>
    </section>
  );
};

export default MobileWelcomeSection;
