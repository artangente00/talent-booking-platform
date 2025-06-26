
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
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
              {renderTranslatedContent(getContent('hero_title', 'Find Trusted Talent for Your'))}
              <br />
              <span className="text-kwikie-orange">
                {renderTranslatedContent(getContent('hero_subtitle', 'Home and Business Services'))}
              </span>
            </h1>
            
            <p className="text-lg md:text-xl mb-8 text-gray-600 max-w-2xl leading-relaxed">
              {renderTranslatedContent(getContent('hero_description', 'Easily book trusted professionals for cleaning, driving, childcare, elder care, laundry, and a wide range of other services—all in just a few clicks.'))}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link to="/services">
                <Button 
                  size="lg" 
                  className="bg-kwikie-orange text-white hover:bg-kwikie-red font-semibold px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {t('Browse Services')}
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-kwikie-orange text-kwikie-orange hover:bg-kwikie-orange hover:text-white font-semibold px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {t('How It Works')} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Feature badges */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center text-green-600">
                <div className="w-5 h-5 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="font-medium">{t('Verified Professionals')}</span>
              </div>
              <div className="flex items-center text-green-600">
                <div className="w-5 h-5 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="font-medium">{t('Fixed Rates')}</span>
              </div>
              <div className="flex items-center text-green-600">
                <div className="w-5 h-5 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="font-medium">{t('Satisfaction Guaranteed')}</span>
              </div>
            </div>
          </div>

          {/* Right side - Images placeholder */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* This is where the service images would go */}
              <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                <span className="text-gray-500">Service Images</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
