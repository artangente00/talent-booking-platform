
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import SignUpForm from '@/components/auth/SignUpForm';
import SignInForm from '@/components/auth/SignInForm';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('signup');
  const { t } = useLanguage();

  useEffect(() => {
    // Check URL parameter for tab
    const tab = searchParams.get('tab');
    if (tab === 'signin' || tab === 'signup') {
      setActiveTab(tab);
    }
  }, [searchParams]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-kwikie-yellow/20 to-kwikie-orange/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex justify-end mb-4">
          <LanguageSelector />
        </div>
        
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <img 
              src="/lovable-uploads/10e0a28a-d484-497f-94c4-631bf3eb2452.png" 
              alt="Kwikie Services" 
              className="h-12 w-auto"
            />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('auth.welcome_title', 'Welcome to Kwikie Services')}
          </h1>
          <p className="text-gray-600 mt-2">
            {t('auth.welcome_subtitle', 'Your trusted partner for home services')}
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {t('auth.get_started', 'Get Started')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('auth.get_started_description', 'Create an account or sign in to book services')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signup">{t('auth.sign_up', 'Sign Up')}</TabsTrigger>
                <TabsTrigger value="signin">{t('auth.sign_in', 'Sign In')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signup">
                <SignUpForm />
              </TabsContent>
              
              <TabsContent value="signin">
                <SignInForm />
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 text-center">
              <Link 
                to="/" 
                className="text-sm text-kwikie-orange hover:text-kwikie-red transition-colors"
              >
                {t('auth.back_to_home', '← Back to Home')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
