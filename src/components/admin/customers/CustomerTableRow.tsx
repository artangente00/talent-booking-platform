
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal, CheckCircle, XCircle } from 'lucide-react';

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
}

interface CustomerTableRowProps {
  customer: Customer;
  onEditCustomer: (customer: Customer) => void;
}

const CustomerTableRow = ({ customer, onEditCustomer }: CustomerTableRowProps) => {
  const getFullName = (customer: Customer) => {
    const parts = [customer.first_name, customer.middle_name, customer.last_name].filter(Boolean);
    return parts.join(' ') || 'Unknown';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
    <TableRow>
      <TableCell>
        <div>
          <div className="font-medium">{getFullName(customer)}</div>
          <div className="text-sm text-gray-600">{customer.email}</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm">{customer.contact_number || 'Not provided'}</div>
      </TableCell>
      <TableCell>
        <div className="text-sm">{customer.address || 'Not provided'}</div>
      </TableCell>
      <TableCell>
        <div className="text-center">
          <div className="font-medium">{customer.bookingsCount}</div>
          {customer.lastBooking && (
            <div className="text-xs text-gray-500">
              Last: {formatDate(customer.lastBooking)}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          {customer.has_assigned_booking ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-600" />
              <Badge className="bg-green-100 text-green-800 border-0">
                Assigned
              </Badge>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 text-gray-600" />
              <Badge className="bg-gray-100 text-gray-800 border-0">
                Pending
              </Badge>
            </>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge className={`${getStatusColor(customer.status)} border-0`}>
          {customer.status.toUpperCase()}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="text-sm">{formatDate(customer.created_at)}</div>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onEditCustomer(customer)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Customer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default CustomerTableRow;
