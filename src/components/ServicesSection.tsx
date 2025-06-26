
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import TranslatedServiceCard from './TranslatedServiceCard';
import { Link } from 'react-router-dom';
import { usePageContent } from '@/hooks/usePageContent';
import { useLanguage } from '@/contexts/LanguageContext';
import * as LucideIcons from 'lucide-react';

interface SpecialPricing {
  duration: string;
  price: string;
}

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
  has_special_pricing: boolean;
  special_pricing: SpecialPricing[] | null;
}

// Mapping of service titles to translation keys
const serviceKeyMapping: Record<string, string> = {
  'Cleaning Services': 'cleaning',
  'Driver Services': 'driver', 
  'Babysitting': 'babysitting',
  'Elderly Care': 'elderly',
  'Laundry Services': 'laundry'
};

const ServicesSection = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { getContent, loading: contentLoading } = usePageContent('home');
  const { t } = useLanguage();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      
      // Transform the data to properly type the special_pricing field
      const transformedData = (data || []).map(service => ({
        ...service,
        special_pricing: Array.isArray(service.special_pricing)
          ? (service.special_pricing as unknown as SpecialPricing[])
          : [],
      }));
      
      setServices(transformedData);
    } catch (error) {
      console.error('Error fetching services:', error);
      // Fallback to empty array if there's an error
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Home;
    return <IconComponent size={24} className="text-brand-600" />;
  };

  // Helper function to render HTML content safely
  const renderContent = (content: string) => {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  };

  if (loading || contentLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('services.title', 'Our Services')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('services.description', 'We provide a wide range of professional home services with fixed rates and verified talent.')}
            </p>
          </div>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kwikie-orange"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {renderContent(getContent('services_title', t('services.title', 'Our Services')))}
          </h2>
          <div className="text-lg text-gray-600 max-w-2xl mx-auto">
            {renderContent(getContent('services_description', t('services.description', 'We provide a wide range of professional home services with fixed rates and verified talent.')))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const serviceKey = serviceKeyMapping[service.title] || 'cleaning';
            return (
              <TranslatedServiceCard
                key={service.id}
                serviceKey={serviceKey}
                icon={getIcon(service.icon_name)}
                price={service.price_range}
                route={service.route}
                color={service.color_class}
                hasSpecialPricing={service.has_special_pricing || false}
                specialPricing={service.special_pricing || []}
              />
            );
          })}
        </div>

        {services.length > 0 && (
          <div className="mt-12 text-center">
            <Link 
              to="/services"
              className="inline-flex items-center text-brand-600 font-medium hover:underline"
            >
              {t('services.view_all', 'View all services')}
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
