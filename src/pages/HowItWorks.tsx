
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: 'Choose a Service',
      description: 'Browse our available services and select the one that fits your needs. We offer cleaning, driving, babysitting, elderly care, and laundry services.',
      image: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    },
    {
      number: 2,
      title: 'Select a Professional',
      description: 'View profiles of available professionals. Check their ratings, reviews, and experience to find the perfect match for your requirements.',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    },
    {
      number: 3,
      title: 'Book and Schedule',
      description: 'Choose a date and time that works for you. Our simple booking system allows you to schedule services in just a few clicks.',
      image: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    },
    {
      number: 4,
      title: 'Confirm and Pay',
      description: 'Review your booking details and confirm. Make a secure payment online to finalize your booking.',
      image: 'https://images.unsplash.com/photo-1580048915913-4f8f5cb481c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    },
    {
      number: 5,
      title: 'Enjoy Quality Service',
      description: 'Our professional will arrive at the scheduled time. Sit back and relax while we take care of your needs.',
      image: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    }
  ];

  const features = [
    'Verified and background-checked professionals',
    'Fixed pricing with no hidden fees',
    'Easy online booking system',
    'Secure payment processing',
    'Customer support 7 days a week',
    'Satisfaction guarantee'
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-kwikie-yellow to-kwikie-orange py-16">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Booking home services with Kwikie is simple, safe, and convenient.
              Follow these easy steps to get started.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center mb-16 last:mb-0`}
              >
                <div className="md:w-1/2 mb-6 md:mb-0 md:px-6">
                  <div className="bg-kwikie-yellow/20 text-kwikie-orange w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-lg text-gray-600 mb-6">
                    {step.description}
                  </p>
                  {index === steps.length - 1 && (
                    <Link to="/services">
                      <Button className="bg-kwikie-orange hover:bg-kwikie-red">
                        Book a Service Now
                      </Button>
                    </Link>
                  )}
                </div>
                <div className="md:w-1/2 md:px-6">
                  <img 
                    src={step.image} 
                    alt={step.title} 
                    className="rounded-lg shadow-lg w-full object-cover h-64 md:h-80"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Kwikie?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We're committed to providing the best home service experience for our clients.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="mt-1 bg-green-100 rounded-full p-1">
                    <Check size={16} className="text-kwikie-orange" />
                  </div>
                  <p className="text-gray-700">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;
