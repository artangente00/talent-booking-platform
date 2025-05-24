
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
  email: string;
  phone: string;
  specialty: string;
  rating: number;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  completed_jobs: number;
}

const TalentManagement = () => {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTalent, setNewTalent] = useState({
    full_name: '',
    email: '',
    phone: '',
    specialty: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTalents();
  }, []);

  const fetchTalents = async () => {
    try {
      // For now, we'll use mock data since talent table doesn't exist yet
      // In a real implementation, you would fetch from a 'talents' table
      const mockTalents: Talent[] = [
        {
          id: '1',
          full_name: 'John Smith',
          email: 'john.smith@example.com',
          phone: '+1 (555) 123-4567',
          specialty: 'Plumbing',
          rating: 4.8,
          status: 'active',
          created_at: '2024-01-15T10:00:00Z',
          completed_jobs: 25
        },
        {
          id: '2',
          full_name: 'Sarah Johnson',
          email: 'sarah.johnson@example.com',
          phone: '+1 (555) 234-5678',
          specialty: 'Electrical',
          rating: 4.9,
          status: 'active',
          created_at: '2024-02-01T14:30:00Z',
          completed_jobs: 18
        },
        {
          id: '3',
          full_name: 'Mike Davis',
          email: 'mike.davis@example.com',
          phone: '+1 (555) 345-6789',
          specialty: 'Cleaning',
          rating: 4.6,
          status: 'pending',
          created_at: '2024-03-10T09:15:00Z',
          completed_jobs: 0
        }
      ];

      setTalents(mockTalents);
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
    if (!newTalent.full_name || !newTalent.email || !newTalent.phone || !newTalent.specialty) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real implementation, you would insert into a 'talents' table
      const mockNewTalent: Talent = {
        id: Date.now().toString(),
        ...newTalent,
        rating: 0,
        status: 'pending',
        created_at: new Date().toISOString(),
        completed_jobs: 0
      };

      setTalents(prev => [mockNewTalent, ...prev]);

      toast({
        title: "Success",
        description: "Talent added successfully.",
      });

      setIsDialogOpen(false);
      setNewTalent({
        full_name: '',
        email: '',
        phone: '',
        specialty: '',
      });
    } catch (error) {
      console.error('Error adding talent:', error);
      toast({
        title: "Error",
        description: "Failed to add talent.",
        variant: "destructive",
      });
    }
  };

  const updateTalentStatus = async (talentId: string, newStatus: 'active' | 'inactive' | 'pending') => {
    try {
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
    talent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    talent.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
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
              Manage service providers and their information
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
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={newTalent.email}
                    onChange={(e) => setNewTalent(prev => ({ ...prev, email: e.target.value }))}
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
                  <Label htmlFor="specialty">Specialty</Label>
                  <Select value={newTalent.specialty} onValueChange={(value) => setNewTalent(prev => ({ ...prev, specialty: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Plumbing">Plumbing</SelectItem>
                      <SelectItem value="Electrical">Electrical</SelectItem>
                      <SelectItem value="Cleaning">Cleaning</SelectItem>
                      <SelectItem value="HVAC">HVAC</SelectItem>
                      <SelectItem value="Handyman">Handyman</SelectItem>
                      <SelectItem value="Landscaping">Landscaping</SelectItem>
                    </SelectContent>
                  </Select>
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
              placeholder="Search talents by name, email, or specialty..."
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
                <TableHead>Specialty</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Jobs</TableHead>
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
                        Joined {formatDate(talent.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="w-3 h-3" />
                          {talent.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="w-3 h-3" />
                          {talent.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{talent.specialty}</Badge>
                    </TableCell>
                    <TableCell>
                      {talent.rating > 0 ? (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{talent.rating}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500">No rating</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{talent.completed_jobs} completed</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(talent.status)} border-0`}>
                        {talent.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={talent.status}
                        onValueChange={(value) => updateTalentStatus(talent.id, value as 'active' | 'inactive' | 'pending')}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
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
