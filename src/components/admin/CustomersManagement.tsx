
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Mail, Phone, Calendar, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
  bookingsCount: number;
  lastBooking: string | null;
}

const CustomersManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredCustomers = customers.filter(customer =>
    customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Customers Management
        </CardTitle>
        <CardDescription>
          View and manage all registered customers ({customers.length} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search customers by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Last Booking</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No customers found matching your search.' : 'No customers found.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{customer.full_name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="w-3 h-3" />
                          {customer.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="w-3 h-3" />
                          {customer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-3 h-3" />
                        {formatDate(customer.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {customer.bookingsCount} booking{customer.bookingsCount !== 1 ? 's' : ''}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {customer.lastBooking ? (
                        <span className="text-sm">{formatDate(customer.lastBooking)}</span>
                      ) : (
                        <span className="text-sm text-gray-500">No bookings</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomersManagement;
