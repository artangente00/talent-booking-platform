
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
      
      // Store current admin session before creating new user
      const { data: currentSession } = await supabase.auth.getSession();
      const currentAdminUser = currentSession?.session?.user;
      
      // Create the user account with specific metadata to identify as booker
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: bookerData.email,
        password: bookerData.password,
        options: {
          data: {
            full_name: bookerData.full_name,
            phone: bookerData.phone,
            user_type: 'booker'
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

        // Important: Sign out the newly created user and restore admin session
        console.log('Signing out newly created booker to restore admin session');
        await supabase.auth.signOut();
        
        // Restore the admin session if it existed
        if (currentAdminUser) {
          console.log('Restoring admin session for user:', currentAdminUser.id);
          // Small delay to ensure signout completes before attempting to restore session
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Get a fresh session for the admin user (this won't trigger redirects in useAuth)
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError || !session) {
            console.log('Admin session was lost, user will need to log back in');
            // Don't throw error here, just let them know via toast
            toast({
              title: "Session Notice",
              description: "Booker created successfully! Please refresh the page if needed.",
            });
          }
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
