
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Phone, Calendar, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Booker {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface BookersTableProps {
  bookers: Booker[];
  searchTerm: string;
  onBookerUpdated: () => void;
}

const BookersTable = ({ bookers, searchTerm, onBookerUpdated }: BookersTableProps) => {
  const { toast } = useToast();

  const toggleBookerStatus = async (bookerId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('bookers')
        .update({ is_active: !currentStatus })
        .eq('id', bookerId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Booker ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
      onBookerUpdated();
    } catch (error) {
      console.error('Error updating booker status:', error);
      toast({
        title: "Error",
        description: "Failed to update booker status",
        variant: "destructive",
      });
    }
  };

  const filteredBookers = bookers.filter(booker =>
    booker.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booker.phone.includes(searchTerm)
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBookers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                {searchTerm ? 'No bookers found matching your search.' : 'No bookers found.'}
              </TableCell>
            </TableRow>
          ) : (
            filteredBookers.map((booker) => (
              <TableRow key={booker.id}>
                <TableCell className="font-medium">{booker.full_name}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {booker.email}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    {booker.phone}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={booker.is_active ? "default" : "secondary"}>
                    {booker.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {new Date(booker.created_at).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => toggleBookerStatus(booker.id, booker.is_active)}
                      >
                        {booker.is_active ? 'Deactivate' : 'Activate'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BookersTable;
