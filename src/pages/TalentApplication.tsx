
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const TalentApplication = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    experience: '',
    service: '', // Changed from services array to single service string
    description: '',
    availability: '',
    dailyRate: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const serviceOptions = [
    'House Cleaning',
    'Deep Cleaning',
    'Office Cleaning',
    'Personal Driver',
    'Delivery Driver',
    'Airport Transport',
    'Babysitting',
    'Child Care',
    'Tutoring',
    'Elderly Care',
    'Companion Care',
    'Medical Assistance',
    'Laundry Service',
    'Ironing',
    'Dry Cleaning Pickup'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.service) {
      toast({
        title: "Error",
        description: "Please select a service you can provide.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('talents')
        .insert({
          full_name: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          experience: formData.experience || null,
          services: [formData.service], // Convert single service to array for database
          description: formData.description || null,
          availability: formData.availability || null,
          hourly_rate: formData.dailyRate || null, // Keep as string since database expects string
        });

      if (error) {
        console.error('Error submitting application:', error);
        throw error;
      }
      
      toast({
        title: "Application Submitted!",
        description: "Thank you for your interest. We'll review your application and get back to you soon.",
      });
      
      // Reset form
      setFormData({
        fullName: '',
        phone: '',
        address: '',
        experience: '',
        service: '',
        description: '',
        availability: '',
        dailyRate: ''
      });
      
    } catch (error) {
      console.error('Application submission error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
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
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-gray-600 hover:text-kwikie-orange transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Our Talent Network</h1>
            <p className="text-gray-600">
              Become a trusted service provider and start earning by helping others in your community
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Talent Application Form</CardTitle>
              <CardDescription>
                Tell us about yourself and the service you'd like to offer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
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

                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="City, Province"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                {/* Service Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Service You Can Provide *</h3>
                  <p className="text-sm text-gray-600">Select the service you're qualified and willing to provide</p>
                  
                  <div className="space-y-2">
                    <Label htmlFor="service">Service Type</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, service: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceOptions.map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Experience and Rates */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Professional Details</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your experience level" />
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dailyRate">Preferred Daily Rate (PHP)</Label>
                      <Input
                        id="dailyRate"
                        type="number"
                        placeholder="1500"
                        min="300"
                        value={formData.dailyRate}
                        onChange={(e) => setFormData(prev => ({ ...prev, dailyRate: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="availability">Availability</Label>
                      <Select onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value }))}>
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Tell us about yourself</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your experience, skills, and why you'd be a great addition to our talent network..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-kwikie-orange hover:bg-kwikie-red text-white py-3"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting Application..." : "Submit Application"}
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
