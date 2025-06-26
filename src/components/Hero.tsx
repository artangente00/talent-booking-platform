

import React from 'react';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePageContent } from '@/hooks/usePageContent';
import { useTranslationContext } from '@/contexts/TranslationContext';
import { Link } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const { getContent, loading } = usePageContent('home');
  const { t } = useTranslationContext();

  const handleBrowseServicesClick = () => {
    console.log('Browse Services button clicked');
    navigate('/services');
  };

  const handleHowItWorksClick = () => {
    console.log('How It Works button clicked');
    navigate('/how-it-works');
  };

  // Helper function to render HTML content safely
  const renderTranslatedContent = (content: string) => {
    const translatedContent = t(content);
    // Check if the content contains HTML tags
    if (translatedContent.includes('<') && translatedContent.includes('>')) {
      return <div dangerouslySetInnerHTML={{ __html: translatedContent }} />;
    }
    return translatedContent;
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
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-kwikie-yellow via-kwikie-orange to-kwikie-red overflow-hidden">
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center text-white max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {renderTranslatedContent(getContent('hero_title', 'Professional Home Services'))}
            <br />
            <span className="text-white/90">
              {renderTranslatedContent(getContent('hero_subtitle', 'at Your Fingertips'))}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
            {renderTranslatedContent(getContent('hero_description', 'Book trusted professionals for cleaning, driving, babysitting, elderly care, and laundry services in your area.'))}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/services">
              <Button 
                size="lg" 
                className="bg-white text-kwikie-orange hover:bg-gray-100 font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {t('Book a Service')}
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-kwikie-orange font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {t('Learn More')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

