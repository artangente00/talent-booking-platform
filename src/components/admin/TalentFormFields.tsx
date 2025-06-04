import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { X } from 'lucide-react';
import ImageUpload from './ImageUpload';

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

  // Calculate age when birthdate changes
  useEffect(() => {
    if (formData.birthdate) {
      const birthDate = new Date(formData.birthdate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      setFormData((prev: any) => ({
        ...prev,
        age: age.toString()
      }));
    }
  }, [formData.birthdate, setFormData]);

  const handleServiceToggle = (serviceTitle: string, checked: boolean) => {
    const currentServices = Array.isArray(formData.services) ? formData.services : [];
    
    if (checked) {
      const updatedServices = [...currentServices, serviceTitle];
      setFormData((prev: any) => ({
        ...prev,
        services: updatedServices
      }));
      
      // Set price range from the first selected service for now
      const selectedService = services.find(s => s.title === serviceTitle);
      if (selectedService && currentServices.length === 0) {
        setFormData((prev: any) => ({
          ...prev,
          hourly_rate: selectedService.price_range || ''
        }));
      }
    } else {
      const updatedServices = currentServices.filter((s: string) => s !== serviceTitle);
      setFormData((prev: any) => ({
        ...prev,
        services: updatedServices,
        // Clear hourly_rate if no services selected
        ...(updatedServices.length === 0 ? { hourly_rate: '' } : {})
      }));
    }
  };

  const removeService = (serviceToRemove: string) => {
    const currentServices = Array.isArray(formData.services) ? formData.services : [];
    const updatedServices = currentServices.filter((s: string) => s !== serviceToRemove);
    
    setFormData((prev: any) => ({
      ...prev,
      services: updatedServices,
      // Clear hourly_rate if no services selected
      ...(updatedServices.length === 0 ? { hourly_rate: '' } : {})
    }));
  };

  const handleImageUpload = (url: string | null) => {
    setFormData((prev: any) => ({
      ...prev,
      profile_photo_url: url
    }));
  };

  const currentServices = Array.isArray(formData.services) ? formData.services : [];

  return (
    <div className="space-y-4">
      <ImageUpload
        value={formData.profile_photo_url || null}
        onImageUpload={handleImageUpload}
      />
      
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
        <Select
          onValueChange={(value) => setFormData((prev: any) => ({ ...prev, address: value }))}
          value={formData.address}
        >
          <SelectTrigger>
            <SelectValue placeholder="City or Municipality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Bayawan City">Bayawan City</SelectItem>
            <SelectItem value="Santa Catalina">Santa Catalina</SelectItem>
            <SelectItem value="Basay">Basay</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="birthdate">Birthdate</Label>
          <Input
            id="birthdate"
            type="date"
            value={formData.birthdate || ''}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, birthdate: e.target.value }))}
          />
        </div>
        
        <div>
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            placeholder="Age"
            min="18"
            max="100"
            value={formData.age || ''}
            readOnly
            className="bg-gray-50"
          />
        </div>
      </div>

      {/* Emergency Contact Section */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-medium text-gray-900">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
            <Input
              id="emergencyContactName"
              value={formData.emergency_contact_name || ''}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, emergency_contact_name: e.target.value }))}
              placeholder="Full Name"
            />
          </div>
          
          <div>
            <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
            <Input
              id="emergencyContactPhone"
              value={formData.emergency_contact_phone || ''}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, emergency_contact_phone: e.target.value }))}
              placeholder="+63 917 123 4567"
            />
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div>
        <Label htmlFor="service">Services *</Label>
        
        {/* Selected Services Display */}
        {currentServices.length > 0 && (
          <div className="mb-3">
            <Label className="text-sm">Selected Services:</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {currentServices.map((service: string) => (
                <Badge key={service} variant="secondary" className="flex items-center gap-1">
                  {service}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => removeService(service)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Service Selection */}
        <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
          <Label className="text-sm font-medium">Available Services:</Label>
          {services.map((service) => (
            <div key={service.title} className="flex items-center space-x-2">
              <Checkbox
                id={`service-${service.title}`}
                checked={currentServices.includes(service.title)}
                onCheckedChange={(checked) => handleServiceToggle(service.title, checked as boolean)}
              />
              <Label htmlFor={`service-${service.title}`} className="text-sm font-normal cursor-pointer">
                {service.title}
              </Label>
            </div>
          ))}
        </div>
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
          type="text"
          value={formData.hourly_rate || ''}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, hourly_rate: e.target.value }))}
          placeholder="Enter daily rate"
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
