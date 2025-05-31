import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, UserPlus, Mail, Calendar, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Admin {
  id: string;
  user_id: string | null;
  is_active: boolean;
  created_at: string;
  created_by: string | null;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  email: string | null;
  customer: {
    first_name: string;
    middle_name: string | null;
    last_name: string;
    email: string;
    contact_number: string;
  } | null;
  creator: {
    first_name: string;
    middle_name: string | null;
    last_name: string;
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
  
  // New state for manual admin creation
  const [manualAdminData, setManualAdminData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: ''
  });
  
  const { toast } = useToast();

  useEffect(() => {
    fetchAdmins();
    fetchCustomers();
  }, []);

  const fetchAdmins = async () => {
    try {
      console.log('Attempting to fetch admins...');
      
      // First get the admins with better error handling
      const { data: adminsData, error: adminsError } = await supabase
        .from('admins')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Admins query result:', { adminsData, adminsError });

      if (adminsError) {
        console.error('Error fetching admins:', adminsError);
        throw adminsError;
      }

      if (!adminsData) {
        console.log('No admins data returned');
        setAdmins([]);
        return;
      }

      console.log('Found admins:', adminsData.length);

      // Then get customer data for each admin (only for those with user_id)
      const adminsWithCustomers = await Promise.all(
        adminsData.map(async (admin) => {
          let customerData = null;
          
          // Only fetch customer data if admin has a user_id (linked to customers table)
          if (admin.user_id) {
            console.log('Fetching customer data for admin:', admin.user_id);
            
            const { data: customer, error: customerError } = await supabase
              .from('customers')
              .select('first_name, middle_name, last_name, email, contact_number')
              .eq('user_id', admin.user_id)
              .single();

            if (customerError) {
              console.error('Error fetching customer for admin:', admin.user_id, customerError);
            } else {
              customerData = customer;
            }
          }

          // Get creator data if exists
          let creatorData = null;
          if (admin.created_by) {
            const { data: creator, error: creatorError } = await supabase
              .from('customers')
              .select('first_name, middle_name, last_name, email')
              .eq('user_id', admin.created_by)
              .single();
            
            if (creatorError) {
              console.error('Error fetching creator for admin:', admin.created_by, creatorError);
            } else {
              creatorData = creator;
            }
          }

          return {
            ...admin,
            customer: customerData,
            creator: creatorData
          };
        })
      );

      console.log('Admins with customer data:', adminsWithCustomers);
      setAdmins(adminsWithCustomers);
    } catch (error) {
      console.error('Error in fetchAdmins:', error);
      toast({
        title: "Error",
        description: `Failed to load admins data: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const fetchCustomers = async () => {
    try {
      console.log('Fetching customers...');
      const { data: customersData, error } = await supabase
        .from('customers')
        .select('*')
        .order('full_name');

      if (error) {
        console.error('Error fetching customers:', error);
        throw error;
      }

      console.log('Found customers:', customersData?.length || 0);
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

  const addManualAdmin = async () => {
    if (!manualAdminData.firstName.trim() || !manualAdminData.lastName.trim() || 
        !manualAdminData.email.trim() || !manualAdminData.password.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (First Name, Last Name, Email, Password).",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) throw new Error('Not authenticated');

      // Insert directly into admins table
      const { error } = await supabase
        .from('admins')
        .insert({
          first_name: manualAdminData.firstName,
          middle_name: manualAdminData.middleName || null,
          last_name: manualAdminData.lastName,
          email: manualAdminData.email,
          password_hash: manualAdminData.password, // Note: In production, this should be properly hashed
          created_by: currentUser.id,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Admin added successfully.",
      });

      setIsDialogOpen(false);
      setManualAdminData({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        password: ''
      });
      fetchAdmins();
    } catch (error) {
      console.error('Error adding manual admin:', error);
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

  const availableCustomers = customers.filter(customer => {
    const fullName = `${customer.first_name || ''} ${customer.middle_name || ''} ${customer.last_name || ''}`.trim();
    return !admins.some(admin => admin.user_id === customer.user_id && admin.is_active) &&
           fullName.toLowerCase().includes(searchTerm.toLowerCase())
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDisplayName = (admin: Admin) => {
    // For admins linked to customers, use customer data
    if (admin.customer) {
      return `${admin.customer.first_name || ''} ${admin.customer.middle_name || ''} ${admin.customer.last_name || ''}`.trim();
    }
    // For manually created admins, use admin table data
    if (admin.first_name || admin.last_name) {
      return `${admin.first_name || ''} ${admin.middle_name || ''} ${admin.last_name || ''}`.trim();
    }
    return 'Unknown User';
  };

  const getDisplayEmail = (admin: Admin) => {
    // For admins linked to customers, use customer email
    if (admin.customer?.email) {
      return admin.customer.email;
    }
    // For manually created admins, use admin table email
    return admin.email || 'N/A';
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
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Admin</DialogTitle>
                <DialogDescription>
                  Choose how to add a new admin user.
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="existing" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="existing">From Existing Customers</TabsTrigger>
                  <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                </TabsList>
                
                <TabsContent value="existing" className="space-y-4">
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
                        <div className="font-medium">{getCustomerDisplayName(customer)}</div>
                        <div className="text-sm text-gray-600">{customer.email}</div>
                      </div>
                    ))}
                    {availableCustomers.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        No available customers found.
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="manual" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={manualAdminData.firstName}
                        onChange={(e) => setManualAdminData(prev => ({ ...prev, firstName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="middleName">Middle Name</Label>
                      <Input
                        id="middleName"
                        placeholder="Michael"
                        value={manualAdminData.middleName}
                        onChange={(e) => setManualAdminData(prev => ({ ...prev, middleName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={manualAdminData.lastName}
                        onChange={(e) => setManualAdminData(prev => ({ ...prev, lastName: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      value={manualAdminData.email}
                      onChange={(e) => setManualAdminData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={manualAdminData.password}
                      onChange={(e) => setManualAdminData(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Tabs defaultValue="existing" className="hidden">
                  <TabsContent value="existing">
                    <Button onClick={addAdmin} disabled={!selectedCustomerId}>
                      Add Admin
                    </Button>
                  </TabsContent>
                  <TabsContent value="manual">
                    <Button onClick={addManualAdmin}>
                      Create Admin
                    </Button>
                  </TabsContent>
                </Tabs>
                <Button 
                  onClick={() => {
                    const activeTab = document.querySelector('[data-state="active"]')?.getAttribute('value');
                    if (activeTab === 'manual') {
                      addManualAdmin();
                    } else {
                      addAdmin();
                    }
                  }}
                  disabled={(() => {
                    const activeTab = document.querySelector('[data-state="active"]')?.getAttribute('value');
                    return activeTab === 'manual' 
                      ? !manualAdminData.firstName.trim() || !manualAdminData.lastName.trim() || !manualAdminData.email.trim() || !manualAdminData.password.trim()
                      : !selectedCustomerId;
                  })()}
                >
                  {(() => {
                    const activeTab = document.querySelector('[data-state="active"]')?.getAttribute('value');
                    return activeTab === 'manual' ? 'Create Admin' : 'Add Admin';
                  })()}
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
                            {getDisplayName(admin)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="w-3 h-3" />
                          {getDisplayEmail(admin)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {admin.creator ? getCustomerDisplayName(admin.creator) : 'System'}
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
