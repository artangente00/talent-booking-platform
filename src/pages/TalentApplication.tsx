
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ImageUpload from '@/components/admin/ImageUpload';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';

interface Service {
  id: string;
  title: string;
}

const TalentApplication = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    birthdate: '',
    experience: '',
    services: [] as string[],
    customService: '',
    description: '',
    availability: '',
    profilePhotoUrl: null as string | null,
    emergencyContactName: '',
    emergencyContactPhone: ''
  });
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('id, title')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching services:', error);
        toast({
          title: "Error",
          description: "Failed to load services. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Error",
        description: "Failed to load services. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingServices(false);
    }
  };

  const calculateAge = (birthdate: string): number | null => {
    if (!birthdate) return null;
    
    const birth = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleImageUpload = (url: string | null) => {
    setFormData(prev => ({ ...prev, profilePhotoUrl: url }));
  };

  const handleServiceToggle = (serviceTitle: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      services: checked 
        ? [...prev.services, serviceTitle]
        : prev.services.filter(s => s !== serviceTitle)
    }));
  };

  const handleCustomServiceToggle = (checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, 'Others']
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        services: prev.services.filter(s => s !== 'Others'),
        customService: ''
      }));
    }
  };

  const removeService = (serviceToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(s => s !== serviceToRemove),
      ...(serviceToRemove === 'Others' ? { customService: '' } : {})
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.services.length === 0) {
      toast({
        title: t('talent.application_error', 'Error'),
        description: t('talent.select_service_error', 'Please select at least one service you can provide.'),
        variant: "destructive",
      });
      return;
    }

    if (formData.services.includes('Others') && !formData.customService.trim()) {
      toast({
        title: t('talent.application_error', 'Error'),
        description: t('talent.specify_service_error', 'Please specify your custom service.'),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const calculatedAge = calculateAge(formData.birthdate);
      
      // Replace 'Others' with the custom service if specified
      const finalServices = formData.services.map(service => 
        service === 'Others' ? formData.customService : service
      );
      
      const { error } = await supabase
        .from('talents')
        .insert({
          full_name: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          birthdate: formData.birthdate || null,
          age: calculatedAge,
          experience: formData.experience || null,
          services: finalServices,
          description: formData.description || null,
          availability: formData.availability || null,
          hourly_rate: null,
          profile_photo_url: formData.profilePhotoUrl,
          emergency_contact_name: formData.emergencyContactName || null,
          emergency_contact_phone: formData.emergencyContactPhone || null,
        });

      if (error) {
        console.error('Error submitting application:', error);
        throw error;
      }
      
      toast({
        title: t('talent.application_submitted', 'Application Submitted!'),
        description: t('talent.application_success', "Thank you for your interest. We'll review your application and get back to you soon."),
      });
      
      // Reset form
      setFormData({
        fullName: '',
        phone: '',
        address: '',
        birthdate: '',
        experience: '',
        services: [],
        customService: '',
        description: '',
        availability: '',
        profilePhotoUrl: null,
        emergencyContactName: '',
        emergencyContactPhone: ''
      });
      
    } catch (error) {
      console.error('Application submission error:', error);
      toast({
        title: t('talent.application_error', 'Error'),
        description: t('talent.application_error', 'Something went wrong. Please try again.'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-kwikie-yellow/20 to-kwikie-orange/20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/10e0a28a-d484-497f-94c4-631bf3eb2452.png" 
                alt="Kwikie Services" 
                className="h-8 w-auto"
              />
            </Link>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-gray-600 hover:text-kwikie-orange transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('talent.back_to_home', '← Back to Home')}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('talent.page_title', 'Join Our Freelancer Network')}
            </h1>
            <p className="text-gray-600">
              {t('talent.page_subtitle', 'Become a trusted service provider and start earning by helping others in your community')}
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">
                {t('talent.form_title', 'Freelancer Application Form')}
              </CardTitle>
              <CardDescription>
                {t('talent.form_description', 'Tell us about yourself and the services you\'d like to offer')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Photo */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t('talent.profile_information', 'Profile Information')}
                  </h3>
                  <ImageUpload
                    value={formData.profilePhotoUrl}
                    onImageUpload={handleImageUpload}
                    disabled={isLoading}
                  />
                </div>

                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t('talent.personal_information', 'Personal Information')}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">
                        {t('talent.full_name', 'Full Name')} {t('talent.required', '*')}
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder={t('talent.full_name', 'Full Name')}
                        value={formData.fullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        {t('talent.phone_number', 'Phone Number')} {t('talent.required', '*')}
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+63 917 123 4567"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="birthdate">{t('talent.birthdate', 'Birthdate')}</Label>
                      <Input
                        id="birthdate"
                        type="date"
                        value={formData.birthdate}
                        onChange={(e) => setFormData(prev => ({ ...prev, birthdate: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">
                        {t('talent.address', 'Address')} {t('talent.required', '*')}
                      </Label>
                      <Select 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, address: value }))} 
                        value={formData.address}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('talent.city_municipality', 'City or Municipality')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bayawan City">Bayawan City</SelectItem>
                          <SelectItem value="Santa Catalina">Santa Catalina</SelectItem>
                          <SelectItem value="Basay">Basay</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t('talent.emergency_contact', 'Emergency Contact')}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t('talent.emergency_contact_description', 'Person to contact in case of emergency')}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactName">
                        {t('talent.emergency_contact_name', 'Emergency Contact Name')}
                      </Label>
                      <Input
                        id="emergencyContactName"
                        type="text"
                        placeholder={t('talent.full_name', 'Full Name')}
                        value={formData.emergencyContactName}
                        onChange={(e) => setFormData(prev => ({ ...prev, emergencyContactName: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactPhone">
                        {t('talent.emergency_contact_phone', 'Emergency Contact Phone')}
                      </Label>
                      <Input
                        id="emergencyContactPhone"
                        type="tel"
                        placeholder="+63 917 123 4567"
                        value={formData.emergencyContactPhone}
                        onChange={(e) => setFormData(prev => ({ ...prev, emergencyContactPhone: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Service Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t('talent.services_you_provide', 'Services You Can Provide')} {t('talent.required', '*')}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t('talent.services_description', 'Select all services you\'re qualified and willing to provide')}
                  </p>
                  
                  {/* Selected Services Display */}
                  {formData.services.length > 0 && (
                    <div className="space-y-2">
                      <Label>{t('talent.selected_services', 'Selected Services:')}</Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.services.map((service) => (
                          <Badge key={service} variant="secondary" className="flex items-center gap-1">
                            {service === 'Others' ? formData.customService || t('talent.others', 'Others') : service}
                            <X 
                              className="w-3 h-3 cursor-pointer" 
                              onClick={() => removeService(service)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Service Checkboxes */}
                  <div className="space-y-3">
                    <Label>{t('talent.available_services', 'Available Services:')}</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-40 overflow-y-auto border rounded-md p-3">
                      {isLoadingServices ? (
                        <div className="col-span-2 text-center py-4">
                          {t('talent.loading_services', 'Loading services...')}
                        </div>
                      ) : (
                        <>
                          {services.map((service) => (
                            <div key={service.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={service.id}
                                checked={formData.services.includes(service.title)}
                                onCheckedChange={(checked) => handleServiceToggle(service.title, checked as boolean)}
                              />
                              <Label htmlFor={service.id} className="text-sm font-normal cursor-pointer">
                                {service.title}
                              </Label>
                            </div>
                          ))}
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="others"
                              checked={formData.services.includes('Others')}
                              onCheckedChange={(checked) => handleCustomServiceToggle(checked as boolean)}
                            />
                            <Label htmlFor="others" className="text-sm font-normal cursor-pointer">
                              {t('talent.others', 'Others')}
                            </Label>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {formData.services.includes('Others') && (
                    <div className="space-y-2">
                      <Label htmlFor="customService">
                        {t('talent.specify_service', 'Please specify your service')} {t('talent.required', '*')}
                      </Label>
                      <Input
                        id="customService"
                        type="text"
                        placeholder={t('talent.enter_service_type', 'Enter your service type')}
                        value={formData.customService}
                        onChange={(e) => setFormData(prev => ({ ...prev, customService: e.target.value }))}
                        required
                      />
                    </div>
                  )}
                </div>

                {/* Experience and Availability */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t('talent.professional_details', 'Professional Details')}
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="experience">{t('talent.years_experience', 'Years of Experience')}</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('talent.select_experience', 'Select your experience level')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="less-than-1">{t('talent.experience_less_1', 'Less than 1 year')}</SelectItem>
                        <SelectItem value="1-2">{t('talent.experience_1_2', '1-2 years')}</SelectItem>
                        <SelectItem value="3-5">{t('talent.experience_3_5', '3-5 years')}</SelectItem>
                        <SelectItem value="5-10">{t('talent.experience_5_10', '5-10 years')}</SelectItem>
                        <SelectItem value="more-than-10">{t('talent.experience_more_10', 'More than 10 years')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availability">{t('talent.availability', 'Availability')}</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('talent.select_availability', 'Select your availability')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">{t('talent.availability_full_time', 'Full-time')}</SelectItem>
                        <SelectItem value="part-time">{t('talent.availability_part_time', 'Part-time')}</SelectItem>
                        <SelectItem value="weekends">{t('talent.availability_weekends', 'Weekends only')}</SelectItem>
                        <SelectItem value="flexible">{t('talent.availability_flexible', 'Flexible schedule')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">{t('talent.tell_about_yourself', 'Tell us about yourself')}</Label>
                    <Textarea
                      id="description"
                      placeholder={t('talent.describe_yourself', 'Describe your experience, skills, and why you\'d be a great addition to our talent network...')}
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-kwikie-orange hover:bg-kwikie-red text-white py-3"
                  disabled={isLoading || isLoadingServices}
                >
                  {isLoading ? t('talent.submitting', 'Submitting Application...') : t('talent.submit_application', 'Submit Application')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TalentApplication;
