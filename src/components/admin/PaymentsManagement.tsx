
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, CheckCircle, Clock, TrendingUp, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Booking {
  id: string;
  booking_date: string;
  booking_time: string;
  service_type: string;
  service_address: string;
  service_rate: number;
  amount_paid: number;
  payment_confirmed_at: string | null;
  payment_confirmed_by: string | null;
  status: string;
  customers: {
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
  } | null;
}

interface EarningsData {
  total_bookings: number;
  total_revenue: number;
  total_commission: number;
  confirmed_payments: number;
  pending_payments: number;
}

const PaymentsManagement = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPayment, setEditingPayment] = useState<{ bookingId: string; amount: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
    fetchEarnings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          booking_date,
          booking_time,
          service_type,
          service_address,
          service_rate,
          amount_paid,
          payment_confirmed_at,
          payment_confirmed_by,
          status,
          customers (
            first_name,
            middle_name,
            last_name,
            email
          )
        `)
        .order('booking_date', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch bookings data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchEarnings = async () => {
    try {
      const { data, error } = await supabase.rpc('calculate_total_earnings');
      
      if (error) throw error;
      if (data && data.length > 0) {
        setEarnings(data[0]);
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch earnings data.",
        variant: "destructive",
      });
    }
  };

  const updatePayment = async (bookingId: string, amount: number) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          amount_paid: amount,
          service_rate: amount 
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment amount updated successfully.",
      });

      fetchBookings();
      fetchEarnings();
      setEditingPayment(null);
    } catch (error) {
      console.error('Error updating payment:', error);
      toast({
        title: "Error",
        description: "Failed to update payment amount.",
        variant: "destructive",
      });
    }
  };

  const confirmPayment = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          payment_confirmed_at: new Date().toISOString(),
          payment_confirmed_by: (await supabase.auth.getUser()).data.user?.id 
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment confirmed successfully.",
      });

      fetchBookings();
      fetchEarnings();
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast({
        title: "Error",
        description: "Failed to confirm payment.",
        variant: "destructive",
      });
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const customerName = booking.customers 
      ? `${booking.customers.first_name || ''} ${booking.customers.middle_name || ''} ${booking.customers.last_name || ''}`.trim().toLowerCase()
      : '';
    
    return !searchTerm || 
      customerName.includes(searchTerm.toLowerCase()) ||
      booking.service_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service_address.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatCurrency = (amount: number | null) => {
    return amount ? `₱${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '₱0.00';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Payments Management
        </CardTitle>
        <CardDescription>
          Manage customer payments and track earnings
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="payments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="payments">Payment Tracking</TabsTrigger>
            <TabsTrigger value="earnings">Earnings Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="payments">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by customer name, service, or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {booking.customers 
                                ? `${booking.customers.first_name || ''} ${booking.customers.middle_name || ''} ${booking.customers.last_name || ''}`.trim()
                                : 'Unknown Customer'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.customers?.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{booking.service_type}</div>
                            <div className="text-sm text-gray-500">{booking.service_address}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>{new Date(booking.booking_date).toLocaleDateString()}</div>
                            <div className="text-sm text-gray-500">{booking.booking_time}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {editingPayment?.bookingId === booking.id ? (
                            <div className="flex gap-2">
                              <Input
                                type="number"
                                value={editingPayment.amount}
                                onChange={(e) => setEditingPayment({
                                  bookingId: booking.id,
                                  amount: e.target.value
                                })}
                                className="w-24"
                                step="0.01"
                              />
                              <Button
                                size="sm"
                                onClick={() => updatePayment(booking.id, parseFloat(editingPayment.amount))}
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingPayment(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <div 
                              className="cursor-pointer hover:bg-gray-50 p-1 rounded"
                              onClick={() => setEditingPayment({
                                bookingId: booking.id,
                                amount: booking.amount_paid?.toString() || booking.service_rate?.toString() || '0'
                              })}
                            >
                              {formatCurrency(booking.amount_paid || booking.service_rate)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {booking.payment_confirmed_at ? (
                            <Badge variant="default" className="bg-green-500">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Confirmed
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {!booking.payment_confirmed_at && (
                            <Button
                              size="sm"
                              onClick={() => confirmPayment(booking.id)}
                              disabled={!booking.amount_paid}
                            >
                              Confirm Payment
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="earnings">
            {earnings && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                          <p className="text-2xl font-bold">{earnings.total_bookings}</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                          <p className="text-2xl font-bold">{formatCurrency(Number(earnings.total_revenue))}</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Commission (5%)</p>
                          <p className="text-2xl font-bold text-green-600">{formatCurrency(Number(earnings.total_commission))}</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Confirmed Payments</p>
                          <p className="text-2xl font-bold text-green-500">{earnings.confirmed_payments}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                          <p className="text-2xl font-bold text-orange-500">{earnings.pending_payments}</p>
                        </div>
                        <Clock className="w-8 h-8 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Breakdown</CardTitle>
                    <CardDescription>
                      Our platform takes a 5% commission on each completed service
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Service Revenue:</span>
                        <span className="font-medium">{formatCurrency(Number(earnings.total_revenue))}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Platform Commission (5%):</span>
                        <span className="font-medium text-green-600">{formatCurrency(Number(earnings.total_commission))}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Freelancer Earnings (95%):</span>
                        <span className="font-medium">{formatCurrency(Number(earnings.total_revenue) - Number(earnings.total_commission))}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PaymentsManagement;
