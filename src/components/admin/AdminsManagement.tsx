
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Settings, UserPlus, Mail, Calendar, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Admin {
  id: string;
  user_id: string;
  is_active: boolean;
  created_at: string;
  created_by: string | null;
  customer: {
    full_name: string;
    email: string;
    phone: string;
  } | null;
  creator: {
    full_name: string;
    email: string;
  } | null;
}

const AdminsManagement = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchAdmins();
    fetchCustomers();
  }, []);

  const fetchAdmins = async () => {
    try {
      const { data: adminsData, error } = await supabase
        .from('admins')
        .select(`
          *,
          customers!admins_user_id_fkey (
            full_name,
            email,
            phone
          ),
          creator:customers!admins_created_by_fkey (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAdmins(adminsData || []);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast({
        title: "Error",
        description: "Failed to load admins data.",
        variant: "destructive",
      });
    }
  };

  const fetchCustomers = async () => {
    try {
      const { data: customersData, error } = await supabase
        .from('customers')
        .select('*')
        .order('full_name');

      if (error) throw error;

      setCustomers(customersData || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const addAdmin = async () => {
    if (!selectedCustomerId) {
      toast({
        title: "Error",
        description: "Please select a customer to make admin.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if customer is already an admin
      const { data: existingAdmin, error: checkError } = await supabase
        .from('admins')
        .select('id')
        .eq('user_id', selectedCustomerId)
        .eq('is_active', true)
        .single();

      if (checkError && checkError.code !== 'PGRST116') throw checkError;

      if (existingAdmin) {
        toast({
          title: "Error",
          description: "This customer is already an admin.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('admins')
        .insert({
          user_id: selectedCustomerId,
          created_by: user.id,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Admin added successfully.",
      });

      setIsDialogOpen(false);
      setSelectedCustomerId('');
      fetchAdmins();
    } catch (error) {
      console.error('Error adding admin:', error);
      toast({
        title: "Error",
        description: "Failed to add admin.",
        variant: "destructive",
      });
    }
  };

  const toggleAdminStatus = async (adminId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('admins')
        .update({ is_active: !currentStatus })
        .eq('id', adminId);

      if (error) throw error;

      setAdmins(prev => prev.map(admin => 
        admin.id === adminId 
          ? { ...admin, is_active: !currentStatus }
          : admin
      ));

      toast({
        title: "Success",
        description: `Admin ${!currentStatus ? 'activated' : 'deactivated'} successfully.`,
      });
    } catch (error) {
      console.error('Error updating admin status:', error);
      toast({
        title: "Error",
        description: "Failed to update admin status.",
        variant: "destructive",
      });
    }
  };

  const availableCustomers = customers.filter(customer => 
    !admins.some(admin => admin.user_id === customer.user_id && admin.is_active) &&
    customer.full_name.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Admins Management
            </CardTitle>
            <CardDescription>
              Manage admin users and their permissions
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-kwikie-orange hover:bg-kwikie-red">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Admin</DialogTitle>
                <DialogDescription>
                  Select a customer to grant admin access to.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="search">Search Customers</Label>
                  <Input
                    id="search"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {availableCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                        selectedCustomerId === customer.user_id ? 'border-kwikie-orange bg-kwikie-yellow/10' : ''
                      }`}
                      onClick={() => setSelectedCustomerId(customer.user_id)}
                    >
                      <div className="font-medium">{customer.full_name}</div>
                      <div className="text-sm text-gray-600">{customer.email}</div>
                    </div>
                  ))}
                  {availableCustomers.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      No available customers found.
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addAdmin} disabled={!selectedCustomerId}>
                  Add Admin
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Admin</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Added By</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No admins found.
                  </TableCell>
                </TableRow>
              ) : (
                admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="font-medium">
                            {admin.customer?.full_name || 'Unknown User'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="w-3 h-3" />
                          {admin.customer?.email || 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {admin.creator?.full_name || 'System'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-3 h-3" />
                        {formatDate(admin.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={admin.is_active ? "default" : "secondary"}>
                        {admin.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleAdminStatus(admin.id, admin.is_active)}
                      >
                        {admin.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
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

export default AdminsManagement;
