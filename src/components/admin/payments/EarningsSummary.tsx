
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download, FileText, Table as TableIcon, DollarSign, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface EarningsData {
  total_bookings: number;
  total_revenue: number;
  total_commission: number;
  confirmed_payments: number;
  pending_payments: number;
}

interface FilteredBooking {
  id: string;
  booking_date: string;
  service_type: string;
  amount_paid: number;
  payment_confirmed_at: string | null;
  customers: {
    first_name: string;
    last_name: string;
  } | null;
}

const EarningsSummary = () => {
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [filteredBookings, setFilteredBookings] = useState<FilteredBooking[]>([]);
  const [filterPeriod, setFilterPeriod] = useState<'weekly' | 'monthly' | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchEarningsData();
  }, [filterPeriod]);

  const getDateRange = () => {
    const now = new Date();
    let startDate: Date;

    switch (filterPeriod) {
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        return null;
    }

    return {
      start: startDate.toISOString().split('T')[0],
      end: now.toISOString().split('T')[0]
    };
  };

  const fetchEarningsData = async () => {
    try {
      setLoading(true);
      const dateRange = getDateRange();

      // Build query for bookings
      let bookingsQuery = supabase
        .from('bookings')
        .select(`
          id,
          booking_date,
          service_type,
          amount_paid,
          payment_confirmed_at,
          customers (
            first_name,
            last_name
          )
        `)
        .not('amount_paid', 'is', null);

      if (dateRange) {
        bookingsQuery = bookingsQuery
          .gte('booking_date', dateRange.start)
          .lte('booking_date', dateRange.end);
      }

      const { data: bookingsData, error: bookingsError } = await bookingsQuery;

      if (bookingsError) throw bookingsError;

      setFilteredBookings(bookingsData || []);

      // Calculate earnings from filtered data
      const totalBookings = bookingsData?.length || 0;
      const totalRevenue = bookingsData?.reduce((sum, booking) => sum + (booking.amount_paid || 0), 0) || 0;
      const totalCommission = totalRevenue * 0.05;
      const confirmedPayments = bookingsData?.filter(booking => booking.payment_confirmed_at).length || 0;
      const pendingPayments = totalBookings - confirmedPayments;

      setEarnings({
        total_bookings: totalBookings,
        total_revenue: totalRevenue,
        total_commission: totalCommission,
        confirmed_payments: confirmedPayments,
        pending_payments: pendingPayments
      });

    } catch (error) {
      console.error('Error fetching earnings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch earnings data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Earnings Summary Report', 20, 20);
    
    // Add filter period
    doc.setFontSize(12);
    const periodText = filterPeriod === 'all' ? 'All Time' : 
                     filterPeriod === 'weekly' ? 'Last 7 Days' : 'This Month';
    doc.text(`Period: ${periodText}`, 20, 35);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
    
    // Add summary stats
    if (earnings) {
      doc.text(`Total Bookings: ${earnings.total_bookings}`, 20, 60);
      doc.text(`Total Revenue: ${formatCurrency(earnings.total_revenue)}`, 20, 70);
      doc.text(`Platform Commission (5%): ${formatCurrency(earnings.total_commission)}`, 20, 80);
      doc.text(`Freelancer Earnings (95%): ${formatCurrency(earnings.total_revenue - earnings.total_commission)}`, 20, 90);
    }
    
    // Add bookings table
    const tableData = filteredBookings.map(booking => [
      new Date(booking.booking_date).toLocaleDateString(),
      booking.customers ? `${booking.customers.first_name} ${booking.customers.last_name}` : 'Unknown',
      booking.service_type,
      formatCurrency(booking.amount_paid),
      booking.payment_confirmed_at ? 'Confirmed' : 'Pending'
    ]);
    
    (doc as any).autoTable({
      head: [['Date', 'Customer', 'Service', 'Amount', 'Status']],
      body: tableData,
      startY: 105,
    });
    
    doc.save(`earnings-summary-${filterPeriod}-${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: "Success",
      description: "PDF report exported successfully.",
    });
  };

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    
    // Summary sheet
    const summaryData = [
      ['Earnings Summary Report'],
      [''],
      ['Period', filterPeriod === 'all' ? 'All Time' : filterPeriod === 'weekly' ? 'Last 7 Days' : 'This Month'],
      ['Generated on', new Date().toLocaleDateString()],
      [''],
      ['Total Bookings', earnings?.total_bookings || 0],
      ['Total Revenue', earnings?.total_revenue || 0],
      ['Platform Commission (5%)', earnings?.total_commission || 0],
      ['Freelancer Earnings (95%)', (earnings?.total_revenue || 0) - (earnings?.total_commission || 0)],
      ['Confirmed Payments', earnings?.confirmed_payments || 0],
      ['Pending Payments', earnings?.pending_payments || 0],
    ];
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
    
    // Bookings detail sheet
    const bookingsData = filteredBookings.map(booking => ({
      Date: new Date(booking.booking_date).toLocaleDateString(),
      Customer: booking.customers ? `${booking.customers.first_name} ${booking.customers.last_name}` : 'Unknown',
      Service: booking.service_type,
      Amount: booking.amount_paid,
      Status: booking.payment_confirmed_at ? 'Confirmed' : 'Pending',
      'Payment Confirmed': booking.payment_confirmed_at ? new Date(booking.payment_confirmed_at).toLocaleDateString() : 'N/A'
    }));
    
    const bookingsSheet = XLSX.utils.json_to_sheet(bookingsData);
    XLSX.utils.book_append_sheet(workbook, bookingsSheet, 'Bookings');
    
    XLSX.writeFile(workbook, `earnings-summary-${filterPeriod}-${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast({
      title: "Success",
      description: "Excel report exported successfully.",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter and Export Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-4">
          <Calendar className="w-5 h-5 text-gray-500" />
          <Select value={filterPeriod} onValueChange={(value: 'weekly' | 'monthly' | 'all') => setFilterPeriod(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="weekly">Last 7 Days</SelectItem>
              <SelectItem value="monthly">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={exportToPDF} variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={exportToExcel} variant="outline" size="sm">
            <TableIcon className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {earnings && (
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
                  <p className="text-2xl font-bold">{formatCurrency(earnings.total_revenue)}</p>
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
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(earnings.total_commission)}</p>
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
      )}

      {/* Revenue Breakdown */}
      {earnings && (
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription>
              Platform commission breakdown for the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Service Revenue:</span>
                <span className="font-medium">{formatCurrency(earnings.total_revenue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Platform Commission (5%):</span>
                <span className="font-medium text-green-600">{formatCurrency(earnings.total_commission)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Freelancer Earnings (95%):</span>
                <span className="font-medium">{formatCurrency(earnings.total_revenue - earnings.total_commission)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-gray-600">Filter Period:</span>
                <Badge variant="outline">
                  {filterPeriod === 'all' ? 'All Time' : 
                   filterPeriod === 'weekly' ? 'Last 7 Days' : 'This Month'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EarningsSummary;
