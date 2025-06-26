
import React, { createContext, useContext, ReactNode } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface TranslationContextType {
  currentLanguage: 'en' | 'ceb';
  translateText: (text: string) => string;
  toggleLanguage: () => Promise<void>;
  isTranslating: boolean;
  t: (text: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const translation = useTranslation();
  
  return (
    <TranslationContext.Provider value={translation}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslationContext = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslationContext must be used within a TranslationProvider');
  }
  return context;
};
