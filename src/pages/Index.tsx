
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ServicesSection from '@/components/ServicesSection';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import CTASection from '@/components/CTASection';
import MobileWelcomeSection from '@/components/MobileWelcomeSection';
import MobileServicesGrid from '@/components/MobileServicesGrid';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Mobile Welcome Section - only shows for logged in users on mobile */}
        <MobileWelcomeSection />
        
        {/* Mobile Services Grid - only shows on mobile */}
        <MobileServicesGrid />
        
        {/* Desktop Hero - hidden on mobile when user is logged in */}
        <div className="md:block">
          <Hero />
        </div>
        
        {/* Desktop Services Section - hidden on mobile */}
        <div className="hidden md:block">
          <ServicesSection />
        </div>
        
        <HowItWorks />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
