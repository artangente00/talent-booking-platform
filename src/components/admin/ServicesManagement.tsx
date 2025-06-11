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
import { Search, Package, Plus, Edit, Trash2, ArrowUp, ArrowDown, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import * as LucideIcons from 'lucide-react';
import type { Json } from '@/integrations/supabase/types';

interface SpecialPricing {
  duration: string;
  price: string;
}

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
  has_special_pricing: boolean;
  special_pricing: SpecialPricing[] | null;
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
  has_special_pricing: boolean;
  special_pricing: SpecialPricing[];
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
    has_special_pricing: false,
    special_pricing: [],
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
      
      // Transform the data to properly type the special_pricing field
      const transformedData = (data || []).map(service => ({
        ...service,
        special_pricing: Array.isArray(service.special_pricing)
        ? (service.special_pricing as unknown as SpecialPricing[])
        : [],


      }));
      
      setServices(transformedData);
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
      const submitData = {
        ...formData,
        special_pricing: formData.has_special_pricing ? (formData.special_pricing as unknown as Json) : null,

      };

      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update({
            ...submitData,
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
          .insert([submitData]);

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
      has_special_pricing: service.has_special_pricing || false,
      special_pricing: service.special_pricing || [],
    });
  };

  const addSpecialPricing = () => {
    setFormData({
      ...formData,
      special_pricing: [...formData.special_pricing, { duration: '', price: '' }]
    });
  };

  const removeSpecialPricing = (index: number) => {
    setFormData({
      ...formData,
      special_pricing: formData.special_pricing.filter((_, i) => i !== index)
    });
  };

  const updateSpecialPricing = (index: number, field: 'duration' | 'price', value: string) => {
    const updated = [...formData.special_pricing];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({
      ...formData,
      special_pricing: updated
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
      has_special_pricing: false,
      special_pricing: [],
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

  const ServiceForm = ({ isEdit = false }) => (
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
            required={!formData.has_special_pricing}
            disabled={formData.has_special_pricing}
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

      {/* Special Pricing Section */}
      <div className="space-y-4 border-t pt-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="has_special_pricing"
            checked={formData.has_special_pricing}
            onCheckedChange={(checked) => setFormData({ 
              ...formData, 
              has_special_pricing: checked,
              special_pricing: checked ? formData.special_pricing : []
            })}
          />
          <Label htmlFor="has_special_pricing">Enable Special Pricing</Label>
        </div>

        {formData.has_special_pricing && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Special Pricing Options</Label>
              <Button type="button" variant="outline" size="sm" onClick={addSpecialPricing}>
                <Plus className="w-4 h-4 mr-1" />
                Add Option
              </Button>
            </div>
            
            {formData.special_pricing.map((pricing, index) => (
              <div key={index} className="grid grid-cols-2 gap-2 items-end">
                <div>
                  <Label htmlFor={`duration-${index}`}>Duration</Label>
                  <Input
                    id={`duration-${index}`}
                    value={pricing.duration}
                    onChange={(e) => updateSpecialPricing(index, 'duration', e.target.value)}
                    placeholder="e.g., 12hr"
                  />
                </div>
                <div>
                  <Label htmlFor={`price-${index}`}>Price</Label>
                  <div className="flex gap-1">
                    <Input
                      id={`price-${index}`}
                      value={pricing.price}
                      onChange={(e) => updateSpecialPricing(index, 'price', e.target.value)}
                      placeholder="e.g., ₱525"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeSpecialPricing(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
        <Button type="button" variant="outline" onClick={() => {
          setIsAddDialogOpen(false);
          setEditingService(null);
        }}>
          Cancel
        </Button>
        <Button type="submit">{isEdit ? 'Update' : 'Create'} Service</Button>
      </DialogFooter>
    </form>
  );

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
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Service</DialogTitle>
                <DialogDescription>
                  Create a new service offering for your business.
                </DialogDescription>
              </DialogHeader>
              <ServiceForm />
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Pricing</TableHead>
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
                    <TableCell>
                      {service.has_special_pricing && service.special_pricing ? (
                        <div className="space-y-1">
                          {service.special_pricing.map((pricing, idx) => (
                            <div key={idx} className="text-sm">
                              <Badge variant="secondary" className="mr-1">
                                {pricing.duration}
                              </Badge>
                              {pricing.price}
                            </div>
                          ))}
                        </div>
                      ) : (
                        service.price_range
                      )}
                    </TableCell>
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
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Service</DialogTitle>
                              <DialogDescription>
                                Update the service information.
                              </DialogDescription>
                            </DialogHeader>
                            <ServiceForm isEdit={true} />
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

