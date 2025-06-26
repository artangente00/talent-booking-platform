

import React from 'react';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePageContent } from '@/hooks/usePageContent';

const Hero = () => {
  const navigate = useNavigate();
  const { getContent, loading } = usePageContent('home');

  const handleBrowseServicesClick = () => {
    console.log('Browse Services button clicked');
    navigate('/services');
  };

  const handleHowItWorksClick = () => {
    console.log('How It Works button clicked');
    navigate('/how-it-works');
  };

  // Helper function to render HTML content safely
  const renderContent = (content: string) => {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  };

  if (loading) {
    return (
      <div className="relative bg-gradient-to-br from-kwikie-yellow/20 to-kwikie-orange/20 overflow-hidden">
        <div className="container mx-auto px-4 py-20 md:py-24 lg:py-32">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-300 rounded mb-4"></div>
            <div className="h-6 bg-gray-300 rounded mb-8"></div>
          </div>
        </div>
      </div>
    );
  }

  console.log('Hero subtitle content:', getContent('hero_subtitle', 'Default subtitle'));
  console.log('Hero description content:', getContent('hero_description', 'Default description'));

  return (
    <div className="relative bg-gradient-to-br from-kwikie-yellow/20 to-kwikie-orange/20 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10"></div>
      <div className="container mx-auto px-4 py-20 md:py-24 lg:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
              {renderContent(getContent('hero_title', 'Find Trusted Talent for Your Home Services'))}
            </div>
            <div className="text-xl text-gray-600 max-w-lg">
              {renderContent(getContent('hero_subtitle', 'Easily book trusted professionals for cleaning, driving, childcare, elder care, laundry, and a wide range of other services—all in just a few clicks.'))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 relative z-10">
              <Button 
                className="bg-kwikie-orange hover:bg-kwikie-red text-lg h-12 px-8 cursor-pointer"
                onClick={handleBrowseServicesClick}
                type="button"
              >
                Browse Services
              </Button>
              <Button 
                variant="outline" 
                className="border-kwikie-orange text-kwikie-orange hover:bg-kwikie-yellow/10 text-lg h-12 px-8 cursor-pointer"
                onClick={handleHowItWorksClick}
                type="button"
              >
                How It Works
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <div>{renderContent(getContent('hero_feature_1', 'Verified Professionals'))}</div>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <div>{renderContent(getContent('hero_feature_2', 'Fixed Rates'))}</div>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <div>{renderContent(getContent('hero_feature_3', 'Satisfaction Guaranteed'))}</div>
              </div>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="bg-white rounded-2xl shadow-xl p-1 transform rotate-2">
              <img 
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Professional house cleaner" 
                className="rounded-xl" 
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-1 transform -rotate-3 w-64">
              <img 
                src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                alt="Professional driver" 
                className="h-40 w-full object-cover rounded-xl" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

