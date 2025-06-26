import React from 'react';
import { Rocket, ShieldCheck, Users2, Truck, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { usePageContent } from '@/hooks/usePageContent';
import { useTranslationContext } from '@/contexts/TranslationContext';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, link }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
    <div className="flex items-center mb-4">
      <span className="mr-3 text-kwikie-orange">{icon}</span>
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
    </div>
    <p className="text-gray-600 mb-4">{description}</p>
    <Link to={link}>
      <Button className="w-full bg-kwikie-orange hover:bg-kwikie-red">Learn More</Button>
    </Link>
  </div>
);

const ServicesSection = () => {
  const { getContent } = usePageContent('home');
  const { t } = useTranslationContext();

  const services = [
    {
      icon: <Home size={28} />,
      title: 'Cleaning Services',
      description: 'Professional cleaning for your home',
      link: '/services#cleaning'
    },
    {
      icon: <Truck size={28} />,
      title: 'Driver Services',
      description: 'Reliable drivers for your transportation needs',
      link: '/services#drivers'
    },
    {
      icon: <Users2 size={28} />,
      title: 'Babysitting',
      description: 'Trusted caregivers for your children',
      link: '/services#babysitting'
    },
    {
      icon: <ShieldCheck size={28} />,
      title: 'Elderly Care',
      description: 'Compassionate care for senior family members',
      link: '/services#elderly-care'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t(getContent('services_title', 'Our Services'))}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t(getContent('services_description', 'Choose from our range of professional home services'))}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={t(service.title)}
              description={t(service.description)}
              link={service.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
