
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
      
      // Get the current session to include auth token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      // Call the edge function to create the booker
      const { data, error } = await supabase.functions.invoke('create-booker', {
        body: bookerData,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      console.log('Edge function result:', { data, error });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.success) {
        toast({
          title: "Success",
          description: "Booker account created successfully!",
        });
        
        onSuccess(); // trigger success callback
        return true;
      } else {
        throw new Error('Unexpected response from server');
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
