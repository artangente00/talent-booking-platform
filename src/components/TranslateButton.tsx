
import React from 'react';
import { Button } from '@/components/ui/button';
import { Languages, Loader2 } from 'lucide-react';
import { useTranslationContext } from '@/contexts/TranslationContext';

const TranslateButton = () => {
  const { currentLanguage, toggleLanguage, isTranslating } = useTranslationContext();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={toggleLanguage}
        disabled={isTranslating}
        className="bg-kwikie-orange hover:bg-kwikie-red text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full w-14 h-14 p-0"
        size="icon"
      >
        {isTranslating ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <div className="flex flex-col items-center">
            <Languages className="h-5 w-5" />
            <span className="text-xs font-bold mt-0.5">
              {currentLanguage === 'en' ? 'CEB' : 'ENG'}
            </span>
          </div>
        )}
      </Button>
    </div>
  );
};

export default TranslateButton;
