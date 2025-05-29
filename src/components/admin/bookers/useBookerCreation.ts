
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BookerFormData {
  full_name: string;
  email: string;
  phone: string;
  password: string;
}

export const useBookerCreation = (onSuccess: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createBooker = async (bookerData: BookerFormData) => {
    if (!bookerData.full_name || !bookerData.email || !bookerData.phone || !bookerData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return false;
    }

    if (bookerData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);

    try {
      console.log('Creating booker with data:', bookerData);
      
      // Get the current session to restore it later
      const { data: currentSession } = await supabase.auth.getSession();
      
      // Create the user account using the Admin API instead of signUp
      // This prevents triggering auth state changes for the current session
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: bookerData.email,
        password: bookerData.password,
        user_metadata: {
          full_name: bookerData.full_name,
          phone: bookerData.phone,
          user_type: 'booker'
        },
        email_confirm: true // Auto-confirm the email
      });

      console.log('Auth admin createUser result:', { authData, authError });

      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }

      if (authData.user) {
        console.log('User created successfully, now creating booker record for user:', authData.user.id);
        
        // Wait a moment to ensure any triggers have completed
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if a customer record was auto-created and delete it
        const { data: existingCustomer } = await supabase
          .from('customers')
          .select('id')
          .eq('user_id', authData.user.id)
          .single();
          
        if (existingCustomer) {
          console.log('Deleting auto-created customer record:', existingCustomer.id);
          await supabase
            .from('customers')
            .delete()
            .eq('id', existingCustomer.id);
        }
      
        // Insert into bookers table
        const { error: insertError } = await supabase.from('bookers').insert([
          {
            user_id: authData.user.id,
            full_name: bookerData.full_name,
            email: bookerData.email,
            phone: bookerData.phone,
          }
        ]);
      
        if (insertError) {
          console.error('Error inserting into bookers table:', insertError);
          toast({
            title: "Database Error",
            description: "Failed to save booker data.",
            variant: "destructive",
          });
          return false;
        }
      
        toast({
          title: "Success",
          description: "Booker account created successfully!",
        });
      
        onSuccess(); // trigger success callback
        return true;
      } else {
        throw new Error('User creation failed - no user returned');
      }
    } catch (error: any) {
      console.error('Error adding booker:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add booker",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createBooker,
    isLoading
  };
};
