
import React from 'react';
import { Home, Car, Baby, Heart, ScrollText } from 'lucide-react';
import ServiceCard from './ServiceCard';
import { Link } from 'react-router-dom';

const ServicesSection = () => {
  const services = [
    {
      title: 'Cleaning Services',
      description: 'Professional house cleaners to keep your home spotless',
      icon: <Home size={24} className="text-brand-600" />,
      price: '₱500',
      route: '/services/cleaning',
      color: 'hover:border-blue-300'
    },
    {
      title: 'Driver Services',
      description: 'Experienced drivers available for 12h or 24h periods',
      icon: <Car size={24} className="text-brand-600" />,
      price: '₱500 - ₱1,000',
      route: '/services/drivers',
      color: 'hover:border-green-300'
    },
    {
      title: 'Babysitting',
      description: 'Loving and attentive care for your children',
      icon: <Baby size={24} className="text-brand-600" />,
      price: '₱400',
      route: '/services/babysitting',
      color: 'hover:border-purple-300'
    },
    {
      title: 'Elderly Care',
      description: 'Compassionate caregivers for your loved ones',
      icon: <Heart size={24} className="text-brand-600" />,
      price: '₱600',
      route: '/services/elderly-care',
      color: 'hover:border-red-300'
    },
    {
      title: 'Laundry Services',
      description: 'Efficient laundry services with attention to detail',
      icon: <ScrollText size={24} className="text-brand-600" />,
      price: '₱350',
      route: '/services/laundry',
      color: 'hover:border-yellow-300'
    }
  ];

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
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
              price={service.price}
              route={service.route}
              color={service.color}
            />
          ))}
        </div>

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
      </div>
    </section>
  );
};

export default ServicesSection;
