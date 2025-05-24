import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, UserPlus, Mail, Phone, Calendar, Star, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Talent {
  id: string;
  full_name: string;
  phone: string;
  address: string;
  services: string[];
  experience: string | null;
  availability: string | null;
  hourly_rate: number | null;
  status: string;
  created_at: string;
  description: string | null;
}

const TalentManagement = () => {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTalent, setNewTalent] = useState({
    full_name: '',
    phone: '',
    address: '',
    services: [] as string[],
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTalents();
  }, []);

  const fetchTalents = async () => {
    try {
      const { data, error } = await supabase
        .from('talents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching talents:', error);
        throw error;
      }

      setTalents(data || []);
    } catch (error) {
      console.error('Error fetching talents:', error);
      toast({
        title: "Error",
        description: "Failed to load talents data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTalent = async () => {
    if (!newTalent.full_name || !newTalent.phone || !newTalent.address) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('talents')
        .insert({
          full_name: newTalent.full_name,
          phone: newTalent.phone,
          address: newTalent.address,
          services: newTalent.services,
        });

      if (error) {
        console.error('Error adding talent:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Talent added successfully.",
      });

      setIsDialogOpen(false);
      setNewTalent({
        full_name: '',
        phone: '',
        address: '',
        services: [],
      });
      
      // Refresh the list
      fetchTalents();
    } catch (error) {
      console.error('Error adding talent:', error);
      toast({
        title: "Error",
        description: "Failed to add talent.",
        variant: "destructive",
      });
    }
  };

  const updateTalentStatus = async (talentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('talents')
        .update({ status: newStatus })
        .eq('id', talentId);

      if (error) {
        console.error('Error updating talent status:', error);
        throw error;
      }

      setTalents(prev => prev.map(talent => 
        talent.id === talentId 
          ? { ...talent, status: newStatus }
          : talent
      ));

      toast({
        title: "Success",
        description: "Talent status updated successfully.",
      });
    } catch (error) {
      console.error('Error updating talent status:', error);
      toast({
        title: "Error",
        description: "Failed to update talent status.",
        variant: "destructive",
      });
    }
  };

  const filteredTalents = talents.filter(talent =>
    talent.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    talent.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
              <Users className="w-5 h-5" />
              Talent Management
            </CardTitle>
            <CardDescription>
              Manage service providers and their applications
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-kwikie-orange hover:bg-kwikie-red">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Talent
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Talent</DialogTitle>
                <DialogDescription>
                  Add a new service provider to your team.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    value={newTalent.full_name}
                    onChange={(e) => setNewTalent(prev => ({ ...prev, full_name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="Enter phone number"
                    value={newTalent.phone}
                    onChange={(e) => setNewTalent(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Enter address"
                    value={newTalent.address}
                    onChange={(e) => setNewTalent(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addTalent}>
                  Add Talent
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search talents by name or services..."
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
                <TableHead>Talent</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTalents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No talents found matching your search.' : 'No talents found.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTalents.map((talent) => (
                  <TableRow key={talent.id}>
                    <TableCell>
                      <div className="font-medium">{talent.full_name}</div>
                      <div className="text-sm text-gray-600">
                        Applied {formatDate(talent.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="w-3 h-3" />
                          {talent.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {talent.services.slice(0, 2).map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                        {talent.services.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{talent.services.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{talent.experience || 'Not specified'}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {talent.hourly_rate ? `₱${talent.hourly_rate}/day` : 'Not specified'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(talent.status)} border-0`}>
                        {talent.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={talent.status}
                        onValueChange={(value) => updateTalentStatus(talent.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
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

export default TalentManagement;
