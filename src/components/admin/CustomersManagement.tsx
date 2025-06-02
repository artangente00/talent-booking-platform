import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CustomerSearch from './customers/CustomerSearch';
import CustomerTable from './customers/CustomerTable';
import CustomersLoadingState from './customers/CustomersLoadingState';
import AddCustomerDialog from './customers/AddCustomerDialog';
import EditCustomerDialog from './customers/EditCustomerDialog';

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
  has_assigned_booking: boolean;
  city_municipality: string | null;
  street_barangay: string | null;
  payment_status: string;
}

const CustomersManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      console.log('Fetching customers data...');
      
      // Check if user is authenticated first
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error('User not authenticated');
        toast({
          title: "Authentication Required",
          description: "Please log in to view customers.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      console.log('User authenticated, fetching customers...');
      
      // Fetch customers with their booking counts, excluding those who are also admins
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select(`
          id,
          first_name,
          middle_name,
          last_name,
          email,
          contact_number,
          created_at,
          birthdate,
          birthplace,
          address,
          valid_government_id,
          status,
          id_photo_link,
          has_assigned_booking,
          city_municipality,
          street_barangay,
          payment_status,
          user_id,
          bookings!bookings_customer_id_fkey (
            id,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (customersError) {
        console.error('Error fetching customers:', customersError);
        toast({
          title: "Error",
          description: `Failed to load customers: ${customersError.message}`,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      console.log('Customers data fetched successfully:', customersData);

      if (!customersData || customersData.length === 0) {
        console.log('No customers found');
        setCustomers([]);
        setLoading(false);
        return;
      }

      // Get all admin user_ids to filter them out
      const { data: adminsData, error: adminsError } = await supabase
        .from('admins')
        .select('user_id')
        .eq('is_active', true);

      if (adminsError) {
        console.error('Error fetching admins:', adminsError);
        // Continue without filtering admins if query fails
      }

      const adminUserIds = new Set(adminsData?.map(admin => admin.user_id) || []);
      console.log('Admin user IDs to exclude:', Array.from(adminUserIds));

      // Filter out customers who are also admins and process the data
      const filteredCustomersData = customersData.filter(customer => 
        !adminUserIds.has(customer.user_id)
      );

      console.log('Filtered customers (excluding admins):', filteredCustomersData.length, 'out of', customersData.length);

      // Process the filtered data to include booking counts and last booking
      const processedCustomers = filteredCustomersData.map((customer) => {
        const bookings = customer.bookings || [];
        const lastBooking = bookings.length > 0 
          ? new Date(Math.max(...bookings.map(b => new Date(b.created_at).getTime()))).toISOString()
          : null;

        return {
          id: customer.id,
          first_name: customer.first_name,
          middle_name: customer.middle_name,
          last_name: customer.last_name,
          email: customer.email,
          contact_number: customer.contact_number,
          created_at: customer.created_at,
          birthdate: customer.birthdate,
          birthplace: customer.birthplace,
          address: customer.address,
          valid_government_id: customer.valid_government_id,
          status: customer.status,
          id_photo_link: customer.id_photo_link,
          has_assigned_booking: customer.has_assigned_booking,
          city_municipality: customer.city_municipality,
          street_barangay: customer.street_barangay,
          payment_status: customer.payment_status || 'pending',
          bookingsCount: bookings.length,
          lastBooking,
        };
      });

      console.log('Processed customers with bookings:', processedCustomers);
      setCustomers(processedCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: "Error",
        description: "Failed to load customers data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsEditDialogOpen(true);
  };

  const handleUpdatePaymentStatus = async (customerId: string, paymentStatus: string) => {
    try {
      console.log('Updating payment status for customer:', customerId, 'to:', paymentStatus);
      
      const { error } = await supabase
        .from('customers')
        .update({ payment_status: paymentStatus })
        .eq('id', customerId);

      if (error) {
        console.error('Error updating payment status:', error);
        toast({
          title: "Error",
          description: `Failed to update payment status: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('Payment status updated successfully');
      
      toast({
        title: "Success",
        description: "Payment status updated successfully!",
      });
      
      // Refresh customers data
      fetchCustomers();
      
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast({
        title: "Error",
        description: "Failed to update payment status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (customerId: string, status: string) => {
    try {
      console.log('Updating status for customer:', customerId, 'to:', status);
      
      const { error } = await supabase
        .from('customers')
        .update({ status: status })
        .eq('id', customerId);

      if (error) {
        console.error('Error updating status:', error);
        toast({
          title: "Error",
          description: `Failed to update status: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('Status updated successfully');
      
      toast({
        title: "Success",
        description: "Customer status updated successfully!",
      });
      
      // Refresh customers data
      fetchCustomers();
      
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update customer status. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <CustomersLoadingState />;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Customers Management
              </CardTitle>
              <CardDescription>
                View and manage all registered customers ({customers.length} total)
              </CardDescription>
            </div>
            <AddCustomerDialog onCustomerAdded={fetchCustomers} />
          </div>
        </CardHeader>
        <CardContent>
          <CustomerSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <CustomerTable 
            customers={customers} 
            searchTerm={searchTerm} 
            onEditCustomer={handleEditCustomer}
            onUpdatePaymentStatus={handleUpdatePaymentStatus}
            onUpdateStatus={handleUpdateStatus}
          />
        </CardContent>
      </Card>

      <EditCustomerDialog
        customer={editingCustomer}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onCustomerUpdated={fetchCustomers}
      />
    </>
  );
};

export default CustomersManagement;
