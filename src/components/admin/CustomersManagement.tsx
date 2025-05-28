
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
      
      // Fetch customers with their booking counts using a single query
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select(`
          *,
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

      // Process the data to include booking counts and last booking
      const processedCustomers = customersData.map((customer) => {
        const bookings = customer.bookings || [];
        const lastBooking = bookings.length > 0 
          ? new Date(Math.max(...bookings.map(b => new Date(b.created_at).getTime()))).toISOString()
          : null;

        return {
          ...customer,
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
