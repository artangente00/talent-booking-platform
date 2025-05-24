
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ServiceCard from './ServiceCard';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';

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
}

const ServicesSection = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

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
      setServices(data || []);
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

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide a wide range of professional home services with fixed rates and verified talent.
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We provide a wide range of professional home services with fixed rates and verified talent.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              icon={getIcon(service.icon_name)}
              price={service.price_range}
              route={service.route}
              color={service.color_class}
            />
          ))}
        </div>

        {services.length > 0 && (
          <div className="mt-12 text-center">
            <Link 
              to="/services"
              className="inline-flex items-center text-brand-600 font-medium hover:underline"
            >
              View all services
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
