
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
}

interface CustomerTableProps {
  customers: Customer[];
  searchTerm: string;
  onEditCustomer: (customer: Customer) => void;
}

const CustomerTable = ({ customers, searchTerm, onEditCustomer }: CustomerTableProps) => {
  const filteredCustomers = customers.filter(customer => {
    const fullName = `${customer.first_name || ''} ${customer.middle_name || ''} ${customer.last_name || ''}`.trim();
    return fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           customer.contact_number.includes(searchTerm);
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Bookings</TableHead>
            <TableHead>Last Booking</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCustomers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                {searchTerm ? 'No customers found matching your search.' : 'No customers found.'}
              </TableCell>
            </TableRow>
          ) : (
            filteredCustomers.map((customer) => (
              <CustomerTableRow 
                key={customer.id} 
                customer={customer} 
                onEditCustomer={onEditCustomer}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomerTable;
