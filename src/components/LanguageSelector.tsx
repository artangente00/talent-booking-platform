
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const getLanguageDisplayName = (lang: string) => {
    switch (lang) {
      case 'en':
        return 'English';
      case 'tl':
        return 'Tagalog';
      case 'ceb':
        return 'Bisaya';
      default:
        return 'English';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Globe size={16} className="text-gray-600" />
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="w-32 h-8 border-none shadow-none focus:ring-0 text-sm">
          <SelectValue>
            {getLanguageDisplayName(language)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="tl">Tagalog</SelectItem>
          <SelectItem value="ceb">Bisaya</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
