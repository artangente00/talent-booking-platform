
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Search, UserPlus, Mail, Phone, Calendar, MoreHorizontal } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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

const BookersManagement = () => {
  const [bookers, setBookers] = useState<Booker[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newBooker, setNewBooker] = useState({
    full_name: '',
    email: '',
    phone: '',
  });
  const { toast } = useToast();

  const fetchBookers = async () => {
    try {
      const { data, error } = await supabase
        .from('bookers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookers(data || []);
    } catch (error) {
      console.error('Error fetching bookers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch bookers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookers();
  }, []);

  const handleAddBooker = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newBooker.full_name || !newBooker.email || !newBooker.phone) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // First create a user account for the booker
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newBooker.email,
        password: 'TempPassword123!', // Temporary password
        options: {
          data: {
            full_name: newBooker.full_name,
            phone: newBooker.phone,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Then create the booker record
        const { error: bookerError } = await supabase
          .from('bookers')
          .insert([{
            user_id: authData.user.id,
            full_name: newBooker.full_name,
            email: newBooker.email,
            phone: newBooker.phone,
          }]);

        if (bookerError) throw bookerError;

        toast({
          title: "Success",
          description: "Booker added successfully. They will receive an email to set their password.",
        });

        setNewBooker({ full_name: '', email: '', phone: '' });
        setIsAddDialogOpen(false);
        fetchBookers();
      }
    } catch (error: any) {
      console.error('Error adding booker:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add booker",
        variant: "destructive",
      });
    }
  };

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
      fetchBookers();
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bookers Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kwikie-orange"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Bookers Management</CardTitle>
              <CardDescription>
                Manage users who handle booking appointments
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-kwikie-orange hover:bg-kwikie-red">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Booker
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Booker</DialogTitle>
                  <DialogDescription>
                    Create a new booker account. They will receive an email to set their password.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddBooker} className="space-y-4">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={newBooker.full_name}
                      onChange={(e) => setNewBooker({ ...newBooker, full_name: e.target.value })}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newBooker.email}
                      onChange={(e) => setNewBooker({ ...newBooker, email: e.target.value })}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={newBooker.phone}
                      onChange={(e) => setNewBooker({ ...newBooker, phone: e.target.value })}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-kwikie-orange hover:bg-kwikie-red">
                      Add Booker
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search bookers by name, email, or phone..."
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
        </CardContent>
      </Card>
    </div>
  );
};

export default BookersManagement;
