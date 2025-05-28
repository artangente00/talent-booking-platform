
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Calendar, Edit } from 'lucide-react';

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

interface CustomerTableRowProps {
  customer: Customer;
  onEditCustomer: (customer: Customer) => void;
}

const CustomerTableRow = ({ customer, onEditCustomer }: CustomerTableRowProps) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
      <TableCell>
        <Badge className={`${getStatusColor(customer.status)} border-0`}>
          {customer.status.toUpperCase()}
        </Badge>
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEditCustomer(customer)}
          className="flex items-center gap-1"
        >
          <Edit className="w-4 h-4" />
          Edit
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default CustomerTableRow;
