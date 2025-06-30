
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';
import RichTextEditor from '../RichTextEditor';

interface ContentSection {
  id: string;
  section_name: string;
  content_type: 'text' | 'textarea' | 'list' | 'image_url';
  content_value: string;
  display_order: number;
}

interface PageContent {
  id: string;
  page_name: string;
  title: string;
  meta_description?: string;
  sections: ContentSection[];
  updated_at: string;
}

interface HomePageEditorProps {
  pageContent: PageContent | null;
  getContent: (sectionName: string, fallback?: string) => string;
  getSectionId: (sectionName: string) => string;
  updateSectionValue: (sectionId: string, value: string) => void;
  handleSaveSection: (sectionId: string, value: string) => Promise<void>;
  saving: boolean;
}

const HomePageEditor: React.FC<HomePageEditorProps> = ({
  pageContent,
  getContent,
  getSectionId,
  updateSectionValue,
  handleSaveSection,
  saving
}) => {
  const renderEditableSection = (sectionName: string, label: string, placeholder: string) => {
    const sectionId = getSectionId(sectionName);
    const content = getContent(sectionName, placeholder);

    return (
      <div className="border-2 border-dashed border-blue-300 p-4 rounded-lg bg-blue-50/50">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-blue-700">{label}</label>
          <Button 
            size="sm"
            onClick={() => handleSaveSection(sectionId, content)}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-xs"
          >
            {saving ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-1 h-3 w-3" />
                Save
              </>
            )}
          </Button>
        </div>
        <RichTextEditor
          value={content}
          onChange={(value) => updateSectionValue(sectionId, value)}
          placeholder={placeholder}
        />
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card>
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {renderEditableSection(
                'hero_title',
                'Hero Title',
                'Find Trusted Talent for Your Home Services'
              )}
              
              {renderEditableSection(
                'hero_subtitle',
                'Hero Subtitle', 
                'Easily book trusted professionals for cleaning, driving, childcare, elder care, laundry, and a wide range of other services—all in just a few clicks.'
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-kwikie-orange hover:bg-kwikie-red text-lg h-12 px-8 pointer-events-none">
                  Browse Services
                </Button>
                <Button variant="outline" className="border-kwikie-orange text-kwikie-orange text-lg h-12 px-8 pointer-events-none">
                  How It Works →
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderEditableSection(
                  'hero_feature_1',
                  'Feature 1',
                  'Verified Professionals'
                )}
                {renderEditableSection(
                  'hero_feature_2', 
                  'Feature 2',
                  'Fixed Rates'
                )}
                {renderEditableSection(
                  'hero_feature_3',
                  'Feature 3', 
                  'Satisfaction Guaranteed'
                )}
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
        </CardContent>
      </Card>

      {/* Services Section */}
      <Card>
        <CardContent className="p-8">
          <div className="text-center mb-12">
            {renderEditableSection(
              'services_title',
              'Services Section Title',
              'Our Services'
            )}
            <div className="mt-4">
              {renderEditableSection(
                'services_description',
                'Services Description',
                'Choose from our wide range of professional home services designed to make your life easier.'
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-8">
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <div className="text-4xl mb-3">🧹</div>
              <h3 className="font-semibold mb-2">Cleaning Services</h3>
              <p className="text-sm text-gray-600">Professional cleaning for your home</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <div className="text-4xl mb-3">🚗</div>
              <h3 className="font-semibold mb-2">Driver Services</h3>
              <p className="text-sm text-gray-600">Reliable transportation services</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <div className="text-4xl mb-3">👶</div>
              <h3 className="font-semibold mb-2">Babysitting</h3>
              <p className="text-sm text-gray-600">Trusted childcare services</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <div className="text-4xl mb-3">👵</div>
              <h3 className="font-semibold mb-2">Elderly Care</h3>
              <p className="text-sm text-gray-600">Compassionate elder care</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <div className="text-4xl mb-3">👕</div>
              <h3 className="font-semibold mb-2">Laundry Services</h3>
              <p className="text-sm text-gray-600">Professional laundry care</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card>
        <CardContent className="p-8 bg-kwikie-orange text-white">
          <div className="text-center">
            {renderEditableSection(
              'cta_title',
              'Call to Action Title',
              'Ready to Book a Service?'
            )}
            <div className="mt-4">
              {renderEditableSection(
                'cta_description',
                'Call to Action Description',
                'Our professional team is ready to help with your home service needs. Book now and experience the difference.'
              )}
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Button className="bg-white text-kwikie-orange hover:bg-gray-50 text-lg h-12 px-8 pointer-events-none">
                Book a Service
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-kwikie-red text-lg h-12 px-8 pointer-events-none">
                Contact Us
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePageEditor;
