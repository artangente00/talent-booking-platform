
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Heart, Upload } from 'lucide-react';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Customer registration fields
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [birthplace, setBirthplace] = useState('');
  const [address, setAddress] = useState('');
  const [validGovernmentId, setValidGovernmentId] = useState('');
  const [idPhoto, setIdPhoto] = useState<File | null>(null);
  const [idPhotoPreview, setIdPhotoPreview] = useState<string | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  const checkUserRoleAndRedirect = async (userId: string) => {
    try {
      // Check if user is admin
      const { data: isAdminData, error: adminError } = await supabase.rpc('is_admin', { user_uuid: userId });
      
      if (adminError) {
        console.error('Error checking admin status:', adminError);
      } else if (isAdminData) {
        navigate('/admin');
        return;
      }

      // Check if user is booker
      const { data: isBookerData, error: bookerError } = await supabase.rpc('is_booker', { user_uuid: userId });
      
      if (bookerError) {
        console.error('Error checking booker status:', bookerError);
      } else if (isBookerData) {
        navigate('/dashboard');
        return;
      }

      // Default redirect for regular customers
      navigate('/');
    } catch (error) {
      console.error('Error checking user roles:', error);
      navigate('/');
    }
  };

  const handleIdPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadIdPhoto = async (userId: string, file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/id-photo.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('id-photos')
        .upload(fileName, file, {
          upsert: true
        });

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('id-photos')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error in uploadIdPhoto:', error);
      return null;
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    // Validate required fields
    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: "Error",
        description: "First name and last name are required",
        variant: "destructive",
      });
      return;
    }

    if (!contactNumber.trim()) {
      toast({
        title: "Error",
        description: "Contact number is required",
        variant: "destructive",
      });
      return;
    }

    if (!birthdate) {
      toast({
        title: "Error",
        description: "Birthdate is required",
        variant: "destructive",
      });
      return;
    }

    if (!birthplace.trim()) {
      toast({
        title: "Error",
        description: "Birthplace is required",
        variant: "destructive",
      });
      return;
    }

    if (!address.trim()) {
      toast({
        title: "Error",
        description: "Address is required",
        variant: "destructive",
      });
      return;
    }

    if (!validGovernmentId.trim()) {
      toast({
        title: "Error",
        description: "Valid government ID is required",
        variant: "destructive",
      });
      return;
    }

    if (!idPhoto) {
      toast({
        title: "Error",
        description: "ID photo is required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            contact_number: contactNumber,
            birthdate: birthdate,
            birthplace: birthplace,
            address: address,
            valid_government_id: validGovernmentId,
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast({
            title: "Account exists",
            description: "This email is already registered. Please try logging in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } else if (data.user) {
        // Upload ID photo and update customer record
        const idPhotoUrl = await uploadIdPhoto(data.user.id, idPhoto);
        
        if (idPhotoUrl) {
          // Update the customer record with the photo URL
          const { error: updateError } = await supabase
            .from('customers')
            .update({ id_photo_link: idPhotoUrl })
            .eq('user_id', data.user.id);
            
          if (updateError) {
            console.error('Error updating customer with photo URL:', updateError);
          }
        }

        toast({
          title: "Success!",
          description: "Account created successfully. Please check your email to verify your account.",
        });
        
        // Clear form
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFirstName('');
        setMiddleName('');
        setLastName('');
        setContactNumber('');
        setBirthdate('');
        setBirthplace('');
        setAddress('');
        setValidGovernmentId('');
        setIdPhoto(null);
        setIdPhotoPreview(null);
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Error",
            description: "Invalid email or password. Please check your credentials and try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been successfully logged in.",
        });
        
        // Check user role and redirect accordingly
        if (data.user) {
          await checkUserRoleAndRedirect(data.user.id);
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Signin error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-kwikie-yellow/20 to-kwikie-orange/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <img 
              src="/lovable-uploads/10e0a28a-d484-497f-94c4-631bf3eb2452.png" 
              alt="Kwikie Services" 
              className="h-12 w-auto"
            />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to Kwikie Services</h1>
          <p className="text-gray-600 mt-2">Your trusted partner for home services</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Get Started</CardTitle>
            <CardDescription className="text-center">
              Create an account or sign in to book services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signup" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                <TabsTrigger value="signin">Sign In</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
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
                      <Label htmlFor="middleName">Middle Name</Label>
                      <Input
                        id="middleName"
                        type="text"
                        placeholder="Michael"
                        value={middleName}
                        onChange={(e) => setMiddleName(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
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
                    <Label htmlFor="email">Email *</Label>
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
                    <Label htmlFor="contactNumber">Contact Number *</Label>
                    <Input
                      id="contactNumber"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="birthdate">Birthdate *</Label>
                      <Input
                        id="birthdate"
                        type="date"
                        value={birthdate}
                        onChange={(e) => setBirthdate(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="birthplace">Birthplace *</Label>
                      <Input
                        id="birthplace"
                        type="text"
                        placeholder="City, Country"
                        value={birthplace}
                        onChange={(e) => setBirthplace(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="Complete address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="validGovernmentId">Valid Government ID *</Label>
                    <Input
                      id="validGovernmentId"
                      type="text"
                      placeholder="Driver's License, Passport, etc."
                      value={validGovernmentId}
                      onChange={(e) => setValidGovernmentId(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="idPhoto">ID Photo *</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <input
                        id="idPhoto"
                        type="file"
                        accept="image/*"
                        onChange={handleIdPhotoChange}
                        className="hidden"
                        required
                      />
                      <label
                        htmlFor="idPhoto"
                        className="flex flex-col items-center justify-center cursor-pointer"
                      >
                        {idPhotoPreview ? (
                          <img
                            src={idPhotoPreview}
                            alt="ID Preview"
                            className="max-w-32 max-h-32 object-cover rounded"
                          />
                        ) : (
                          <div className="text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-500">
                              Click to upload your ID photo
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-kwikie-orange hover:bg-kwikie-red"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-kwikie-orange hover:bg-kwikie-red"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 text-center">
              <Link 
                to="/" 
                className="text-sm text-kwikie-orange hover:text-kwikie-red transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
