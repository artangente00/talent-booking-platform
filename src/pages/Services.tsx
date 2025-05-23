import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Home, Car, Baby, Heart, ScrollText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import BookingForm from '@/components/BookingForm';

interface ServiceDetailProps {
  title: string;
  description: string;
  pricing: {
    label: string;
    price: string;
  }[];
  conditions: string[];
  icon: React.ReactNode;
  image: string;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({
  title,
  description,
  pricing,
  conditions,
  icon,
  image
}) => {
  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/3">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
        <CardContent className="md:w-2/3 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-kwikie-yellow/20 text-kwikie-orange">
              {icon}
            </div>
            <h3 className="text-2xl font-bold">{title}</h3>
          </div>
          
          <p className="text-gray-600 mb-6">{description}</p>
          
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3">Pricing</h4>
            <div className="space-y-2">
              {pricing.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-bold text-kwikie-orange">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3">Conditions</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              {conditions.map((condition, index) => (
                <li key={index}>{condition}</li>
              ))}
            </ul>
          </div>
          
          <BookingForm preselectedService={title}>
            <Button className="bg-kwikie-orange hover:bg-kwikie-red w-full md:w-auto">
              Book Now
            </Button>
          </BookingForm>
        </CardContent>
      </div>
    </Card>
  );
};

const Services = () => {
  const services = [
    {
      id: 'cleaning',
      title: 'Cleaning Services',
      description: 'Our professional cleaning services ensure your home is spotless and sanitized. We use eco-friendly products and pay attention to every detail.',
      pricing: [
        { label: 'Basic Cleaning (3 hours)', price: '₱350' },
        { label: 'Deep Cleaning (5 hours)', price: '₱650' },
        { label: 'Move-in/Move-out Cleaning', price: '₱1,200' }
      ],
      conditions: [
        'Cleaning supplies provided by the professional',
        'Additional fee for homes larger than 100 sq meters',
        'Minimum booking: 3 hours',
        'Cancellation requires 24-hour notice'
      ],
      icon: <Home size={24} />,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 'drivers',
      title: 'Driver Services',
      description: 'Our experienced drivers provide safe and reliable transportation. All drivers are licensed, background-checked, and have extensive driving experience.',
      pricing: [
        { label: '12-hour service', price: '₱500' },
        { label: '24-hour service', price: '₱1,000' },
        { label: 'Weekly contract', price: '₱5,000' }
      ],
      conditions: [
        'Fuel costs not included',
        'Drivers are available 24/7',
        'Advance booking recommended',
        'Multi-day discounts available'
      ],
      icon: <Car size={24} />,
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 'babysitting',
      title: 'Babysitting',
      description: 'Our professional babysitters provide attentive care for your children in the comfort of your home. All sitters are experienced, background-checked, and trained in first aid.',
      pricing: [
        { label: '4-hour minimum', price: '₱400' },
        { label: '8-hour service', price: '₱750' },
        { label: 'Overnight (12 hours)', price: '₱1,100' }
      ],
      conditions: [
        'Maximum 3 children per sitter',
        'Light meal preparation included',
        'Educational activities provided',
        'Minimum 3-hour advance booking'
      ],
      icon: <Baby size={24} />,
      image: 'https://images.unsplash.com/photo-1595118216221-63caa91a5c68?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 'elderly-care',
      title: 'Elderly Care',
      description: 'Our compassionate caregivers provide personalized care for seniors. Services include companionship, meal preparation, medication reminders, and assistance with daily activities.',
      pricing: [
        { label: '4-hour visit', price: '₱600' },
        { label: '8-hour service', price: '₱1,100' },
        { label: '24-hour care', price: '₱2,500' }
      ],
      conditions: [
        'All caregivers are trained in elder care',
        'Medication management available',
        'Light housekeeping included',
        'Regular care plans available at discounted rates'
      ],
      icon: <Heart size={24} />,
      image: 'https://images.unsplash.com/photo-1577896851674-61d1dd733277?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 'laundry',
      title: 'Laundry Services',
      description: 'Our laundry service takes care of your washing, drying, and folding needs with professional care. We ensure your clothes are cleaned properly and returned neatly folded.',
      pricing: [
        { label: 'Wash & Fold (per kg)', price: '₱70' },
        { label: 'Wash, Dry & Iron (per kg)', price: '₱120' },
        { label: 'Dry Cleaning (per item)', price: 'From ₱200' }
      ],
      conditions: [
        'Same-day service available for orders before 10am',
        'Free pickup and delivery for orders over ₱500',
        'Eco-friendly detergents used',
        'Special care for delicate fabrics'
      ],
      icon: <ScrollText size={24} />,
      image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-kwikie-yellow to-kwikie-orange py-16">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Discover our range of professional home services tailored to your needs.
            </p>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="cleaning" className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-8">
                <TabsTrigger value="cleaning" className="text-sm md:text-base">Cleaning</TabsTrigger>
                <TabsTrigger value="drivers" className="text-sm md:text-base">Drivers</TabsTrigger>
                <TabsTrigger value="babysitting" className="text-sm md:text-base">Babysitting</TabsTrigger>
                <TabsTrigger value="elderly-care" className="text-sm md:text-base">Elderly Care</TabsTrigger>
                <TabsTrigger value="laundry" className="text-sm md:text-base">Laundry</TabsTrigger>
              </TabsList>
              
              {services.map((service) => (
                <TabsContent key={service.id} value={service.id} className="mt-6">
                  <ServiceDetail {...service} />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
