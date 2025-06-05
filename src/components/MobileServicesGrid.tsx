
import React from 'react';
import { Sparkles, Car, Baby, Shirt } from 'lucide-react';

const services = [
  {
    name: 'Cleaning',
    icon: Sparkles,
    color: 'bg-blue-100'
  },
  {
    name: 'Driver',
    icon: Car,
    color: 'bg-green-100'
  },
  {
    name: 'Babysitting',
    icon: Baby,
    color: 'bg-pink-100'
  },
  {
    name: 'Laundry',
    icon: Shirt,
    color: 'bg-purple-100'
  }
];

const MobileServicesGrid = () => {
  return (
    <section className="py-6 px-4 md:hidden">
      <div className="container mx-auto">
        <h2 className="text-xl font-bold mb-4">Our Services</h2>
        <div className="grid grid-cols-2 gap-4">
          {services.map((service) => (
            <div
              key={service.name}
              className={`${service.color} rounded-lg p-6 flex flex-col items-center justify-center min-h-[120px]`}
            >
              <service.icon className="w-8 h-8 text-gray-700 mb-2" />
              <span className="text-gray-700 font-medium">{service.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MobileServicesGrid;
