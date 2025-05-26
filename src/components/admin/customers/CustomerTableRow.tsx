
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Calendar } from 'lucide-react';

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
}

interface CustomerTableRowProps {
  customer: Customer;
}

const CustomerTableRow = ({ customer }: CustomerTableRowProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFullName = (customer: Customer) => {
    return `${customer.first_name || ''} ${customer.middle_name || ''} ${customer.last_name || ''}`.trim();
  };

  return (
    <TableRow key={customer.id}>
      <TableCell>
        <div>
          <div className="font-medium">{getFullName(customer)}</div>
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
            {customer.contact_number}
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
  );
};

export default CustomerTableRow;
