
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Edit, Plus, Trash2 } from 'lucide-react';

const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  icon_name: z.string().min(1, 'Icon is required'),
  price_range: z.string().min(1, 'Price range is required'),
  route: z.string().min(1, 'Route is required'),
  color_class: z.string().min(1, 'Color class is required'),
  is_active: z.boolean(),
  sort_order: z.number().int().min(0)
});

type ServiceFormData = z.infer<typeof serviceSchema>;

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

const ServicesManagement = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const { toast } = useToast();

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: '',
      description: '',
      icon_name: 'Home',
      price_range: '',
      route: '',
      color_class: 'hover:border-blue-300',
      is_active: true,
      sort_order: 0
    }
  });

  const availableIcons = [
    'Home', 'Car', 'Baby', 'Heart', 'ScrollText', 'Users', 'Shield', 'Clock', 'Star', 'Settings'
  ];

  const colorClasses = [
    'hover:border-blue-300',
    'hover:border-green-300',
    'hover:border-purple-300',
    'hover:border-red-300',
    'hover:border-yellow-300',
    'hover:border-pink-300',
    'hover:border-indigo-300',
    'hover:border-orange-300'
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
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
        description: "Failed to load services.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ServiceFormData) => {
    try {
      if (editingService) {
        // Update existing service
        const { error } = await supabase
          .from('services')
          .update(data)
          .eq('id', editingService.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Service updated successfully.",
        });
      } else {
        // Create new service
        const { error } = await supabase
          .from('services')
          .insert([data]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Service created successfully.",
        });
      }

      setIsDialogOpen(false);
      setEditingService(null);
      form.reset();
      fetchServices();
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
    form.reset(service);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

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

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingService(null);
    form.reset();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading services...</div>
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
              <CardTitle>Services Management</CardTitle>
              <CardDescription>
                Manage your services that appear on the homepage
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingService(null)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingService ? 'Edit Service' : 'Add New Service'}
                  </DialogTitle>
                  <DialogDescription>
                    Fill in the details for the service
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Service title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="price_range"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price Range</FormLabel>
                            <FormControl>
                              <Input placeholder="₱500 or ₱500 - ₱1,000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Service description" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="icon_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Icon</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an icon" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {availableIcons.map((icon) => (
                                  <SelectItem key={icon} value={icon}>
                                    {icon}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="color_class"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Color Theme</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a color" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {colorClasses.map((color) => (
                                  <SelectItem key={color} value={color}>
                                    {color.replace('hover:border-', '').replace('-300', '')}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="route"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Route</FormLabel>
                            <FormControl>
                              <Input placeholder="/services/service-name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="sort_order"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sort Order</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0" 
                                {...field} 
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="is_active"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Active (visible on homepage)</FormLabel>
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={handleDialogClose}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingService ? 'Update Service' : 'Create Service'}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Price Range</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sort Order</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{service.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {service.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{service.price_range}</TableCell>
                  <TableCell>{service.icon_name}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      service.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {service.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>{service.sort_order}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(service)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(service.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesManagement;
