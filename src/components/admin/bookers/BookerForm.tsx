
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BookerFormData {
  full_name: string;
  email: string;
  phone: string;
  password: string;
}

interface BookerFormProps {
  formData: BookerFormData;
  onFormDataChange: (data: BookerFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onCancel: () => void;
}

const BookerForm = ({ 
  formData, 
  onFormDataChange, 
  onSubmit, 
  isLoading, 
  onCancel 
}: BookerFormProps) => {
  const handleInputChange = (field: keyof BookerFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onFormDataChange({
      ...formData,
      [field]: e.target.value
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          value={formData.full_name}
          onChange={handleInputChange('full_name')}
          placeholder="Enter full name"
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          placeholder="Enter email address"
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange('phone')}
          placeholder="Enter phone number"
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange('password')}
          placeholder="Enter password"
          required
          minLength={6}
          disabled={isLoading}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-kwikie-orange hover:bg-kwikie-red"
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add Booker'}
        </Button>
      </div>
    </form>
  );
};

export default BookerForm;
