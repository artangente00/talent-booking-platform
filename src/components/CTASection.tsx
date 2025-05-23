
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-16 bg-brand-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Book a Service?</h2>
        <p className="text-lg text-brand-100 max-w-2xl mx-auto mb-8">
          Our professional team is ready to help with your home service needs.
          Book now and experience the difference.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/services">
            <Button className="bg-white text-brand-600 hover:bg-brand-50 text-lg h-12 px-8">
              Book a Service
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" className="border-white text-white hover:bg-brand-700 text-lg h-12 px-8">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
