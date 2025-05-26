
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
      
      // Create the user account with specific metadata to identify as booker
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: bookerData.email,
        password: bookerData.password,
        options: {
          data: {
            full_name: bookerData.full_name,
            phone: bookerData.phone,
            user_type: 'booker' // Mark this user as a booker
          }
        }
      });

      console.log('Auth signup result:', { authData, authError });

      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }

      if (authData.user) {
        console.log('User created successfully, now creating booker record for user:', authData.user.id);
        
        // Wait a moment to ensure any triggers have completed
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Delete any customer record that might have been auto-created
        try {
          const { error: deleteError } = await supabase
            .from('customers')
            .delete()
            .eq('user_id', authData.user.id);
          
          if (deleteError) {
            console.log('No customer record to delete or deletion failed:', deleteError);
          } else {
            console.log('Successfully removed auto-created customer record');
          }
        } catch (deleteError) {
          console.log('Could not delete customer record:', deleteError);
        }
        
        // Create the booker record
        const { data: bookerRecord, error: bookerError } = await supabase
          .from('bookers')
          .insert([{
            user_id: authData.user.id,
            full_name: bookerData.full_name,
            email: bookerData.email,
            phone: bookerData.phone,
            is_active: true
          }])
          .select();

        console.log('Booker insert result:', { bookerRecord, bookerError });

        if (bookerError) {
          console.error('Booker insert error:', bookerError);
          throw bookerError;
        }

        toast({
          title: "Success",
          description: "Booker added successfully.",
        });

        onSuccess();
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
