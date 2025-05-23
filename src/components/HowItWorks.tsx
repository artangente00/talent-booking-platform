
import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Browse Services',
      description: 'Explore our range of services and choose what you need',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      number: '02',
      title: 'Select Talent',
      description: 'View profiles, ratings, and availability of our verified professionals',
      color: 'bg-green-100 text-green-600',
    },
    {
      number: '03',
      title: 'Book & Pay',
      description: 'Schedule a time and complete payment securely online',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      number: '04',
      title: 'Enjoy the Service',
      description: 'Our professionals will arrive on time and complete the job',
      color: 'bg-amber-100 text-amber-600',
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Booking professional home services has never been easier. Follow these simple steps:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className={`${step.color} w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-4`}>
                {step.number}
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-16 w-full h-0.5 bg-gray-200"></div>
              )}
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
