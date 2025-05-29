import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const checkUserRoleAndRedirect = async (userId: string, skipRedirect = false) => {
    if (skipRedirect) return;
    
    // Don't redirect if we're already on an admin page
    if (window.location.pathname.startsWith('/admin')) {
      console.log('Already on admin page, skipping redirect');
      return;
    }
    
    try {
      // Check if user is admin
      const { data: isAdminData, error: adminError } = await supabase.rpc('is_admin', { user_uuid: userId });
      
      if (adminError) {
        console.error('Error checking admin status:', adminError);
      } else if (isAdminData) {
        navigate('/admin');
        return;
      }

      // Check if user is booker
      const { data: isBookerData, error: bookerError } = await supabase.rpc('is_booker', { user_uuid: userId });
      
      if (bookerError) {
        console.error('Error checking booker status:', bookerError);
      } else if (isBookerData) {
        navigate('/dashboard');
        return;
      }

      // Default redirect for regular customers
      navigate('/');
    } catch (error) {
      console.error('Error checking user roles:', error);
      navigate('/');
    }
  };

  const uploadIdPhoto = async (userId: string, file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/id-photo.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('id-photos')
        .upload(fileName, file, {
          upsert: true
        });

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('id-photos')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error in uploadIdPhoto:', error);
      return null;
    }
  };

  const signUp = async (formData: any, idPhoto: File) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            middle_name: formData.middleName,
            last_name: formData.lastName,
            contact_number: formData.contactNumber,
            birthdate: formData.birthdate,
            birthplace: formData.birthplace,
            address: formData.address,
            valid_government_id: formData.validGovernmentId,
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast({
            title: "Account exists",
            description: "This email is already registered. Please try logging in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } else if (data.user) {
        // Upload ID photo and update customer record
        const idPhotoUrl = await uploadIdPhoto(data.user.id, idPhoto);
        
        if (idPhotoUrl) {
          // Update the customer record with the photo URL
          const { error: updateError } = await supabase
            .from('customers')
            .update({ id_photo_link: idPhotoUrl })
            .eq('user_id', data.user.id);
            
          if (updateError) {
            console.error('Error updating customer with photo URL:', updateError);
          }
        }

        toast({
          title: "Success!",
          description: "Account created successfully. Please check your email to verify your account.",
        });
        
        return true;
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
    
    return false;
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Error",
            description: "Invalid email or password. Please check your credentials and try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been successfully logged in.",
        });
        
        // Check user role and redirect accordingly
        if (data.user) {
          await checkUserRoleAndRedirect(data.user.id);
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Signin error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    signUp,
    signIn
  };
};
