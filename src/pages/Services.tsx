
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ServiceDetail from '@/components/ServiceDetail';
import ServicesHero from '@/components/ServicesHero';
import { servicesData } from '@/data/servicesData';

const Services = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <ServicesHero />

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
              
              {servicesData.map((service) => (
                <TabsContent key={service.id} value={service.id} className="mt-6">
                  <ServiceDetail 
                    title={service.title}
                    description={service.description}
                    pricing={service.pricing}
                    conditions={service.conditions}
                    icon={<service.icon size={24} />}
                    image={service.image}
                  />
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
