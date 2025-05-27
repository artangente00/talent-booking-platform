import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

interface Service {
  title: string;
  price_range: string;
}

interface TalentFormFieldsProps {
  formData: any;
  setFormData: (val: any) => void;
}

const TalentFormFields = ({ formData, setFormData }: TalentFormFieldsProps) => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('title, price_range');

      if (error) {
        console.error('Error fetching services:', error);
        return;
      }

      setServices(data || []);
    };

    fetchServices();
  }, []);

  const handleServiceChange = (selectedTitle: string) => {
    const selected = services.find(service => service.title === selectedTitle);
    if (selected) {
      setFormData((prev: any) => ({
        ...prev,
        services: [selected.title],
        hourly_rate: selected.price_range ? parseFloat(selected.price_range.replace(/[^\d.]/g, '')) : ''
      }));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full Name *</Label>
        <Input
          id="fullName"
          value={formData.full_name}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, full_name: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone *</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, phone: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="address">Address *</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, address: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="service">Service *</Label>
        <Select
          onValueChange={handleServiceChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service.title} value={service.title}>
                {service.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="experience">Experience</Label>
        <Select
          onValueChange={(value) => setFormData((prev: any) => ({ ...prev, experience: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Years of experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="less-than-1">Less than 1 year</SelectItem>
            <SelectItem value="1-2">1-2 years</SelectItem>
            <SelectItem value="3-5">3-5 years</SelectItem>
            <SelectItem value="5-10">5-10 years</SelectItem>
            <SelectItem value="more-than-10">More than 10 years</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="hourly_rate">Preferred Daily Rate (PHP)</Label>
        <Input
          id="hourly_rate"
          type="number"
          min="300"
          value={formData.hourly_rate || ''}
          onChange={(e) =>
            setFormData((prev: any) => ({ ...prev, hourly_rate: parseFloat(e.target.value) }))
          }
        />
      </div>
      <div>
        <Label htmlFor="availability">Availability</Label>
        <Select
          onValueChange={(value) => setFormData((prev: any) => ({ ...prev, availability: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full-time">Full-time</SelectItem>
            <SelectItem value="part-time">Part-time</SelectItem>
            <SelectItem value="weekends">Weekends only</SelectItem>
            <SelectItem value="flexible">Flexible schedule</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) =>
            setFormData((prev: any) => ({ ...prev, description: e.target.value }))
          }
        />
      </div>
    </div>
  );
};

export default TalentFormFields;
