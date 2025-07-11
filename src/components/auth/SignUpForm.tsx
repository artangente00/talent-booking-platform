
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Eye, EyeOff } from 'lucide-react';
import IdPhotoUpload from './IdPhotoUpload';

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [birthplace, setBirthplace] = useState('');
  const [cityMunicipality, setCityMunicipality] = useState('');
  const [completeAddress, setCompleteAddress] = useState('');
  const [validGovernmentId, setValidGovernmentId] = useState('');
  const [idPhoto, setIdPhoto] = useState<File | null>(null);
  const [idPhotoPreview, setIdPhotoPreview] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { isLoading, signUp } = useAuth();
  const { t } = useLanguage();

  // Calculate age automatically when birthdate changes
  useEffect(() => {
    if (birthdate) {
      const today = new Date();
      const birth = new Date(birthdate);
      let calculatedAge = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        calculatedAge--;
      }
      
      setAge(calculatedAge);
    } else {
      setAge(null);
    }
  }, [birthdate]);

  const handleIdPhotoChange = (file: File | null) => {
    setIdPhoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setIdPhotoPreview(null);
    }
  };

  const validateForm = () => {
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive",
      });
      return false;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return false;
    }

    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: "Error",
        description: "First name and last name are required",
        variant: "destructive",
      });
      return false;
    }

    if (!contactNumber.trim()) {
      toast({
        title: "Error",
        description: "Contact number is required",
        variant: "destructive",
      });
      return false;
    }

    if (!birthdate) {
      toast({
        title: "Error",
        description: "Birthdate is required",
        variant: "destructive",
      });
      return false;
    }

    if (!birthplace.trim()) {
      toast({
        title: "Error",
        description: "Birthplace is required",
        variant: "destructive",
      });
      return false;
    }

    if (!cityMunicipality) {
      toast({
        title: "Error",
        description: "City or Municipality is required",
        variant: "destructive",
      });
      return false;
    }

    if (!completeAddress.trim()) {
      toast({
        title: "Error",
        description: "Street and Barangay is required",
        variant: "destructive",
      });
      return false;
    }

    if (!validGovernmentId.trim()) {
      toast({
        title: "Error",
        description: "Valid government ID is required",
        variant: "destructive",
      });
      return false;
    }

    if (!idPhoto) {
      toast({
        title: "Error",
        description: "ID photo is required",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setMiddleName('');
    setLastName('');
    setContactNumber('');
    setBirthdate('');
    setAge(null);
    setBirthplace('');
    setCityMunicipality('');
    setCompleteAddress('');
    setValidGovernmentId('');
    setIdPhoto(null);
    setIdPhotoPreview(null);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const formData = {
      email,
      password,
      firstName,
      middleName,
      lastName,
      contactNumber,
      birthdate,
      age,
      birthplace,
      address: `${completeAddress}, ${cityMunicipality}`,
      city_municipality: cityMunicipality,
      street_barangay: completeAddress,
      validGovernmentId,
    };

    const success = await signUp(formData, idPhoto!);
    if (success) {
      clearForm();
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            {t('auth.first_name', 'First Name')} {t('auth.required_field', '*')}
          </Label>
          <Input
            id="firstName"
            type="text"
            placeholder="John"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="middleName">{t('auth.middle_name', 'Middle Name')}</Label>
          <Input
            id="middleName"
            type="text"
            placeholder="Michael"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">
            {t('auth.last_name', 'Last Name')} {t('auth.required_field', '*')}
          </Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">
          {t('auth.email', 'Email')} {t('auth.required_field', '*')}
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="contactNumber">
          {t('auth.contact_number', 'Contact Number')} {t('auth.required_field', '*')}
        </Label>
        <Input
          id="contactNumber"
          type="tel"
          placeholder="+63 917 123 4567"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="birthdate">
            {t('auth.birthdate', 'Birthdate')} {t('auth.required_field', '*')}
          </Label>
          <Input
            id="birthdate"
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="birthplace">
            {t('auth.birthplace', 'Birthplace')} {t('auth.required_field', '*')}
          </Label>
          <Input
            id="birthplace"
            type="text"
            placeholder="City, Province"
            value={birthplace}
            onChange={(e) => setBirthplace(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold">
          {t('auth.current_address', 'Current Address')} {t('auth.required_field', '*')}
        </Label>
        
        <div className="space-y-2">
          <Label htmlFor="cityMunicipality">
            {t('auth.city_municipality', 'City or Municipality')} {t('auth.required_field', '*')}
          </Label>
          <Select value={cityMunicipality} onValueChange={setCityMunicipality}>
            <SelectTrigger>
              <SelectValue placeholder="Select city or municipality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bayawan City">Bayawan City</SelectItem>
              <SelectItem value="Santa Catalina">Santa Catalina</SelectItem>
              <SelectItem value="Basay">Basay</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="completeAddress">
            {t('auth.street_barangay', 'Street and Barangay')} {t('auth.required_field', '*')}
          </Label>
          <Input
            id="completeAddress"
            type="text"
            placeholder="Street, Barangay"
            value={completeAddress}
            onChange={(e) => setCompleteAddress(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="validGovernmentId">
          {t('auth.valid_government_id', 'Valid Government ID')} {t('auth.required_field', '*')}
        </Label>
        <Input
          id="validGovernmentId"
          type="text"
          placeholder="Driver's License, Passport, etc."
          value={validGovernmentId}
          onChange={(e) => setValidGovernmentId(e.target.value)}
          required
        />
      </div>

      <IdPhotoUpload
        idPhoto={idPhoto}
        idPhotoPreview={idPhotoPreview}
        onPhotoChange={handleIdPhotoChange}
        disabled={isLoading}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">
            {t('auth.password', 'Password')} {t('auth.required_field', '*')}
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? t('auth.hide_password', 'Hide password') : t('auth.show_password', 'Show password')}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">
            {t('auth.confirm_password', 'Confirm Password')} {t('auth.required_field', '*')}
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? t('auth.hide_password', 'Hide password') : t('auth.show_password', 'Show password')}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-kwikie-orange hover:bg-kwikie-red"
        disabled={isLoading}
      >
        {isLoading ? t('auth.creating_account', 'Creating Account...') : t('auth.create_account', 'Create Account')}
      </Button>
    </form>
  );
};

export default SignUpForm;
