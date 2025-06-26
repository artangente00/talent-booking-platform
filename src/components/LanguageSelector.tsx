
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <Globe size={16} className="text-gray-600" />
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="w-20 h-8 border-none shadow-none focus:ring-0 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">EN</SelectItem>
          <SelectItem value="tl">TL</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
