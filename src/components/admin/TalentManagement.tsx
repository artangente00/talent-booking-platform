import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, UserPlus, Mail, Phone, Calendar, Star, Users, User, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import TalentFormFields from '@/components/admin/TalentFormFields';

interface Talent {
  id: string;
  full_name: string;
  phone: string;
  address: string;
  services: string[];
  experience: string | null;
  availability: string | null;
  hourly_rate: string | null;
  status: string;
  created_at: string;
  description: string | null;
  profile_photo_url: string | null;
}

const TalentManagement = () => {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);
  const [newTalent, setNewTalent] = useState({
    full_name: '',
    phone: '',
    address: '',
    services: [] as string[],
    experience: '',
    availability: '',
    hourly_rate: null as string | null,
    description: '',
    profile_photo_url: null as string | null
  });
  const [editTalent, setEditTalent] = useState({
    full_name: '',
    phone: '',
    address: '',
    services: [] as string[],
    experience: '',
    availability: '',
    hourly_rate: null as string | null,
    description: '',
    profile_photo_url: null as string | null
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
    const { full_name, phone, address, services, experience, hourly_rate, availability, description, profile_photo_url } = newTalent;
  
    if (!full_name || !phone || !address || services.length === 0) {
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
          full_name,
          phone,
          address,
          services,
          experience,
          hourly_rate,
          availability,
          description,
          profile_photo_url,
          status: 'pending'
        });
  
      if (error) throw error;
  
      toast({ title: "Success", description: "Talent added successfully." });
      setIsAddDialogOpen(false);
      setNewTalent({ 
        full_name: '', 
        phone: '', 
        address: '', 
        services: [], 
        experience: '', 
        availability: '', 
        hourly_rate: null, 
        description: '',
        profile_photo_url: null
      });
      fetchTalents();
    } catch (error) {
      toast({ title: "Error", description: "Failed to add talent.", variant: "destructive" });
    }
  };

  const updateTalent = async () => {
    if (!selectedTalent) return;

    const { full_name, phone, address, services, experience, hourly_rate, availability, description, profile_photo_url } = editTalent;
  
    if (!full_name || !phone || !address || services.length === 0) {
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
        .update({
          full_name,
          phone,
          address,
          services,
          experience,
          hourly_rate,
          availability,
          description,
          profile_photo_url
        })
        .eq('id', selectedTalent.id);
  
      if (error) throw error;
  
      toast({ title: "Success", description: "Talent updated successfully." });
      setIsEditDialogOpen(false);
      setSelectedTalent(null);
      fetchTalents();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update talent.", variant: "destructive" });
    }
  };

  const deleteTalent = async () => {
    if (!selectedTalent) return;

    try {
      const { error } = await supabase
        .from('talents')
        .delete()
        .eq('id', selectedTalent.id);

      if (error) throw error;

      toast({ title: "Success", description: "Talent deleted successfully." });
      setIsDeleteDialogOpen(false);
      setSelectedTalent(null);
      fetchTalents();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete talent.", variant: "destructive" });
    }
  };

  const handleEditClick = (talent: Talent) => {
    setSelectedTalent(talent);
    setEditTalent({
      full_name: talent.full_name,
      phone: talent.phone,
      address: talent.address,
      services: talent.services,
      experience: talent.experience || '',
      availability: talent.availability || '',
      hourly_rate: talent.hourly_rate,
      description: talent.description || '',
      profile_photo_url: talent.profile_photo_url
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (talent: Talent) => {
    setSelectedTalent(talent);
    setIsDeleteDialogOpen(true);
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
              Freelancers Management
            </CardTitle>
            <CardDescription>
              Manage service providers and their applications
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-kwikie-orange hover:bg-kwikie-red">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Freelancer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Freelancer</DialogTitle>
                <DialogDescription>Add a new service provider to your team.</DialogDescription>
              </DialogHeader>
            
              <TalentFormFields formData={newTalent} setFormData={setNewTalent} />
            
              <DialogFooter className="sticky bottom-0 bg-white pt-4 mt-4 border-t">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={addTalent}>Add Freelancer</Button>
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
                <TableHead>Freelancer</TableHead>
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
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={talent.profile_photo_url || undefined} />
                          <AvatarFallback>
                            <User className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{talent.full_name}</div>
                          <div className="text-sm text-gray-600">
                            Applied {formatDate(talent.created_at)}
                          </div>
                        </div>
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
                      <div className="flex items-center gap-2">
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleEditClick(talent)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClick(talent)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Freelancer</DialogTitle>
            <DialogDescription>Update freelancer information.</DialogDescription>
          </DialogHeader>
        
          <TalentFormFields formData={editTalent} setFormData={setEditTalent} />
        
          <DialogFooter className="sticky bottom-0 bg-white pt-4 mt-4 border-t">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={updateTalent}>Update Freelancer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedTalent?.full_name}'s profile and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteTalent} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default TalentManagement;
