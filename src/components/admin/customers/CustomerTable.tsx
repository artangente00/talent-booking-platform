
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import CustomerTableRow from './CustomerTableRow';

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
  payment_status: string;
}

interface CustomerTableProps {
  customers: Customer[];
  searchTerm: string;
  onEditCustomer: (customer: Customer) => void;
  onUpdatePaymentStatus: (customerId: string, paymentStatus: string) => void;
}

const CustomerTable = ({ customers, searchTerm, onEditCustomer, onUpdatePaymentStatus }: CustomerTableProps) => {
  const filteredCustomers = customers.filter(customer => {
    const fullName = `${customer.first_name || ''} ${customer.middle_name || ''} ${customer.last_name || ''}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return fullName.includes(searchLower) || 
           customer.email.toLowerCase().includes(searchLower) ||
           (customer.contact_number && customer.contact_number.includes(searchTerm));
  });

  return (
    <div className="rounded-md border mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Bookings</TableHead>
            <TableHead>Assignment Status</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCustomers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                {searchTerm ? 'No customers found matching your search.' : 'No customers found.'}
              </TableCell>
            </TableRow>
          ) : (
            filteredCustomers.map((customer) => (
              <CustomerTableRow
                key={customer.id}
                customer={customer}
                onEditCustomer={onEditCustomer}
                onUpdatePaymentStatus={onUpdatePaymentStatus}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomerTable;
