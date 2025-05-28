
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import IdPhotoUpload from '@/components/auth/IdPhotoUpload';

interface Customer {
  id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string;
  contact_number: string;
  created_at: string;
  bookingsCount: number;
  lastBooking: string | null;
  birthdate: string | null;
  birthplace: string | null;
  address: string | null;
  valid_government_id: string | null;
  status: string;
  id_photo_link: string | null;
}

interface EditCustomerFormData {
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  contact_number: string;
  birthdate: string;
  birthplace: string;
  address: string;
  valid_government_id: string;
  password: string;
  confirm_password: string;
  status: string;
}

interface EditCustomerDialogProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCustomerUpdated: () => void;
}

const EditCustomerDialog = ({ customer, open, onOpenChange, onCustomerUpdated }: EditCustomerDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [idPhoto, setIdPhoto] = useState<File | null>(null);
  const [idPhotoPreview, setIdPhotoPreview] = useState<string | null>(null);
  const { toast } = useToast();
  
  const form = useForm<EditCustomerFormData>({
    defaultValues: {
      first_name: customer?.first_name || '',
      middle_name: customer?.middle_name || '',
      last_name: customer?.last_name || '',
      email: customer?.email || '',
      contact_number: customer?.contact_number || '',
      birthdate: customer?.birthdate || '',
      birthplace: customer?.birthplace || '',
      address: customer?.address || '',
      valid_government_id: customer?.valid_government_id || '',
      password: '',
      confirm_password: '',
      status: customer?.status || 'pending',
    },
  });

  React.useEffect(() => {
    if (customer) {
      form.reset({
        first_name: customer.first_name || '',
        middle_name: customer.middle_name || '',
        last_name: customer.last_name || '',
        email: customer.email || '',
        contact_number: customer.contact_number || '',
        birthdate: customer.birthdate || '',
        birthplace: customer.birthplace || '',
        address: customer.address || '',
        valid_government_id: customer.valid_government_id || '',
        password: '',
        confirm_password: '',
        status: customer.status || 'pending',
      });
      setIdPhoto(null);
      // Set the existing ID photo preview if it exists
      setIdPhotoPreview(customer.id_photo_link || null);
    }
  }, [customer, form]);

  const handleIdPhotoChange = (file: File | null) => {
    setIdPhoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setIdPhotoPreview(customer?.id_photo_link || null);
    }
  };

  const onSubmit = async (data: EditCustomerFormData) => {
    if (!customer) return;
    
    // Check password confirmation only if password is provided
    if (data.password && data.password !== data.confirm_password) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Updating customer:', data);
      
      const { error } = await supabase
        .from('customers')
        .update({
          first_name: data.first_name,
          middle_name: data.middle_name || null,
          last_name: data.last_name,
          email: data.email,
          contact_number: data.contact_number,
          birthdate: data.birthdate,
          birthplace: data.birthplace,
          address: data.address,
          valid_government_id: data.valid_government_id,
          status: data.status,
        })
        .eq('id', customer.id);

      if (error) {
        console.error('Error updating customer:', error);
        toast({
          title: "Error",
          description: `Failed to update customer: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('Customer updated successfully');
      
      toast({
        title: "Success",
        description: "Customer updated successfully!",
      });
      
      onOpenChange(false);
      onCustomerUpdated();
      
    } catch (error) {
      console.error('Error updating customer:', error);
      toast({
        title: "Error",
        description: "Failed to update customer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
          <DialogDescription>
            Update customer information and status.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John" 
                        {...field}
                        disabled={loading}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="middle_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Michael" 
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Doe" 
                        {...field}
                        disabled={loading}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="john@example.com" 
                      {...field}
                      disabled={loading}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contact_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number *</FormLabel>
                  <FormControl>
                    <Input 
                      type="tel"
                      placeholder="+1 (555) 123-4567" 
                      {...field}
                      disabled={loading}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="birthdate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birthdate *</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
                        {...field}
                        disabled={loading}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="birthplace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birthplace *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="City, Country" 
                        {...field}
                        disabled={loading}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Complete address" 
                      {...field}
                      disabled={loading}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="valid_government_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valid Government ID *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Driver's License, Passport, etc." 
                      {...field}
                      disabled={loading}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <IdPhotoUpload
              idPhoto={idPhoto}
              idPhotoPreview={idPhotoPreview}
              onPhotoChange={handleIdPhotoChange}
              disabled={loading}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password (optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        disabled={loading}
                        minLength={6}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        disabled={loading}
                        minLength={6}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Customer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCustomerDialog;
