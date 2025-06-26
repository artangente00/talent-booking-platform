
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import BookingForm from './BookingForm';
import { useLanguage } from '@/contexts/LanguageContext';

interface SpecialPricing {
  duration: string;
  price: string;
}

interface TranslatedServiceCardProps {
  serviceKey: string;
  icon: React.ReactNode;
  price: string;
  route: string;
  color: string;
  hasSpecialPricing?: boolean;
  specialPricing?: SpecialPricing[];
}

const TranslatedServiceCard = ({ 
  serviceKey, 
  icon, 
  price, 
  route, 
  color, 
  hasSpecialPricing = false, 
  specialPricing = [] 
}: TranslatedServiceCardProps) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleBookNowClick = () => {
    if (!user) {
      navigate('/auth?tab=signup');
    }
  };

  const title = t(`service.${serviceKey}.title`);
  const description = t(`service.${serviceKey}.description`);
  const bookNowText = t('service.book_now', 'Book Now');
  const startingAtText = t('service.starting_at', 'Starting at');

  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border-t-4 ${color}`}>
      <div className="flex items-center mb-4">
        <div className={`p-3 rounded-lg ${color.replace('border-', 'bg-').replace('-600', '-100')}`}>
          {icon}
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-3 text-gray-900">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-4 text-sm leading-relaxed">
        {description}
      </p>
      
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">{startingAtText}</p>
        <p className="text-2xl font-bold text-kwikie-orange">{price}</p>
        
        {hasSpecialPricing && specialPricing.length > 0 && (
          <div className="mt-2">
            {specialPricing.map((pricing, index) => (
              <div key={index} className="text-xs text-gray-500">
                {pricing.duration}: <span className="font-semibold text-kwikie-orange">{pricing.price}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {user ? (
        <BookingForm>
          <Button className="w-full bg-kwikie-orange hover:bg-kwikie-red">
            {bookNowText}
          </Button>
        </BookingForm>
      ) : (
        <Button 
          onClick={handleBookNowClick}
          className="w-full bg-kwikie-orange hover:bg-kwikie-red"
        >
          {bookNowText}
        </Button>
      )}
    </div>
  );
};

export default TranslatedServiceCard;
