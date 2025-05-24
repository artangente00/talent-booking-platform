import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Search, Package, Plus, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import * as LucideIcons from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  price_range: string;
  route: string;
  color_class: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface ServiceFormData {
  title: string;
  description: string;
  icon_name: string;
  price_range: string;
  route: string;
  color_class: string;
  is_active: boolean;
  sort_order: number;
}

const ServicesManagement = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    description: '',
    icon_name: 'Home',
    price_range: '',
    route: '',
    color_class: 'hover:border-blue-300',
    is_active: true,
    sort_order: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Error",
        description: "Failed to load services data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingService.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Service updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('services')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Service created successfully.",
        });
      }

      fetchServices();
      resetForm();
      setIsAddDialogOpen(false);
      setEditingService(null);
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: "Error",
        description: "Failed to save service.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon_name: service.icon_name,
      price_range: service.price_range,
      route: service.route,
      color_class: service.color_class,
      is_active: service.is_active,
      sort_order: service.sort_order,
    });
  };

  const handleDelete = async (serviceId: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Service deleted successfully.",
      });
      
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "Error",
        description: "Failed to delete service.",
        variant: "destructive",
      });
    }
  };

  const moveService = async (serviceId: string, direction: 'up' | 'down') => {
    const currentIndex = services.findIndex(s => s.id === serviceId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= services.length) return;

    const updates = [
      { id: services[currentIndex].id, sort_order: services[newIndex].sort_order },
      { id: services[newIndex].id, sort_order: services[currentIndex].sort_order }
    ];

    try {
      for (const update of updates) {
        const { error } = await supabase
          .from('services')
          .update({ sort_order: update.sort_order, updated_at: new Date().toISOString() })
          .eq('id', update.id);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Service order updated successfully.",
      });
      
      fetchServices();
    } catch (error) {
      console.error('Error updating service order:', error);
      toast({
        title: "Error",
        description: "Failed to update service order.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      icon_name: 'Home',
      price_range: '',
      route: '',
      color_class: 'hover:border-blue-300',
      is_active: true,
      sort_order: services.length,
    });
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Home;
    return <IconComponent size={20} />;
  };

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const iconOptions = ['Home', 'Car', 'Baby', 'Heart', 'ScrollText', 'Wrench', 'Paintbrush', 'Zap', 'Scissors', 'Shield'];
  const colorOptions = [
    'hover:border-blue-300',
    'hover:border-green-300',
    'hover:border-purple-300',
    'hover:border-red-300',
    'hover:border-yellow-300',
    'hover:border-pink-300',
    'hover:border-indigo-300',
    'hover:border-gray-300',
  ];

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
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Services Management
        </CardTitle>
        <CardDescription>
          Manage your service offerings, pricing, and availability
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Service</DialogTitle>
                <DialogDescription>
                  Create a new service offering for your business.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Service Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Cleaning Services"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price_range">Price Range</Label>
                    <Input
                      id="price_range"
                      value={formData.price_range}
                      onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
                      placeholder="e.g., ₱500 - ₱1,000"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the service"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="icon_name">Icon</Label>
                    <Select value={formData.icon_name} onValueChange={(value) => setFormData({ ...formData, icon_name: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((icon) => (
                          <SelectItem key={icon} value={icon}>
                            <div className="flex items-center gap-2">
                              {getIcon(icon)}
                              {icon}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="color_class">Hover Color</Label>
                    <Select value={formData.color_class} onValueChange={(value) => setFormData({ ...formData, color_class: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.map((color) => (
                          <SelectItem key={color} value={color}>
                            {color.replace('hover:border-', '').replace('-300', '')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="route">Route</Label>
                    <Input
                      id="route"
                      value={formData.route}
                      onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                      placeholder="e.g., /services/cleaning"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="sort_order">Sort Order</Label>
                    <Input
                      id="sort_order"
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Service</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Price Range</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No services found matching your search.' : 'No services found.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredServices.map((service, index) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getIcon(service.icon_name)}
                        <div>
                          <div className="font-medium">{service.title}</div>
                          <div className="text-sm text-gray-600 line-clamp-1">{service.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{service.price_range}</TableCell>
                    <TableCell className="font-mono text-sm">{service.route}</TableCell>
                    <TableCell>
                      <Badge variant={service.is_active ? "default" : "secondary"}>
                        {service.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveService(service.id, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <span className="text-sm">{service.sort_order}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveService(service.id, 'down')}
                          disabled={index === filteredServices.length - 1}
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(service)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Service</DialogTitle>
                              <DialogDescription>
                                Update the service information.
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="edit_title">Service Title</Label>
                                  <Input
                                    id="edit_title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit_price_range">Price Range</Label>
                                  <Input
                                    id="edit_price_range"
                                    value={formData.price_range}
                                    onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
                                    required
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <Label htmlFor="edit_description">Description</Label>
                                <Textarea
                                  id="edit_description"
                                  value={formData.description}
                                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                  required
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="edit_icon_name">Icon</Label>
                                  <Select value={formData.icon_name} onValueChange={(value) => setFormData({ ...formData, icon_name: value })}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {iconOptions.map((icon) => (
                                        <SelectItem key={icon} value={icon}>
                                          <div className="flex items-center gap-2">
                                            {getIcon(icon)}
                                            {icon}
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="edit_color_class">Hover Color</Label>
                                  <Select value={formData.color_class} onValueChange={(value) => setFormData({ ...formData, color_class: value })}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {colorOptions.map((color) => (
                                        <SelectItem key={color} value={color}>
                                          {color.replace('hover:border-', '').replace('-300', '')}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="edit_route">Route</Label>
                                  <Input
                                    id="edit_route"
                                    value={formData.route}
                                    onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                                    required
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit_sort_order">Sort Order</Label>
                                  <Input
                                    id="edit_sort_order"
                                    type="number"
                                    value={formData.sort_order}
                                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                                    min="0"
                                    required
                                  />
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="edit_is_active"
                                  checked={formData.is_active}
                                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                                />
                                <Label htmlFor="edit_is_active">Active</Label>
                              </div>

                              <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setEditingService(null)}>
                                  Cancel
                                </Button>
                                <Button type="submit">Update Service</Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(service.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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

export default ServicesManagement;
