
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

interface AboutPageEditorProps {
  pageContent: PageContent | null;
  getContent: (sectionName: string, fallback?: string) => string;
  getSectionId: (sectionName: string) => string;
  updateSectionValue: (sectionId: string, value: string) => void;
  handleSaveSection: (sectionId: string, value: string) => Promise<void>;
  saving: boolean;
}

const AboutPageEditor: React.FC<AboutPageEditorProps> = ({
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
          <div className="text-center">
            {renderEditableSection(
              'hero_title',
              'Page Title',
              'About Us'
            )}
            <div className="mt-4">
              {renderEditableSection(
                'hero_subtitle',
                'Page Subtitle',
                'Learn more about our mission and values'
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mission Section */}
      <Card>
        <CardContent className="p-8">
          <div className="max-w-4xl mx-auto">
            {renderEditableSection(
              'mission_title',
              'Mission Section Title',
              'Our Mission'
            )}
            <div className="mt-6 space-y-4">
              {renderEditableSection(
                'mission_content',
                'Mission Content',
                'We are committed to providing exceptional home services by connecting you with trusted, verified professionals.'
              )}
              {renderEditableSection(
                'mission_content_2',
                'Mission Content (Second Paragraph)',
                'Our platform ensures quality, reliability, and peace of mind for every service booking.'
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Values Section */}
      <Card>
        <CardContent className="p-8">
          <div className="text-center mb-8">
            {renderEditableSection(
              'values_title',
              'Values Section Title',
              'Our Values'
            )}
            <div className="mt-4">
              {renderEditableSection(
                'values_description',
                'Values Description',
                'The principles that guide everything we do'
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="text-center">
              <div className="bg-kwikie-yellow/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="font-semibold mb-2">Trust</h3>
              <p className="text-gray-600">All professionals are verified and background-checked</p>
            </div>
            <div className="text-center">
              <div className="bg-kwikie-yellow/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="font-semibold mb-2">Quality</h3>
              <p className="text-gray-600">We maintain high standards for all our services</p>
            </div>
            <div className="text-center">
              <div className="bg-kwikie-yellow/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💯</span>
              </div>
              <h3 className="font-semibold mb-2">Reliability</h3>
              <p className="text-gray-600">Consistent, dependable service every time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Section */}
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            {renderEditableSection(
              'team_title',
              'Team Section Title',
              'Our Team'
            )}
            <div className="mt-4">
              {renderEditableSection(
                'team_description',
                'Team Description',
                'Meet the people behind Kwikie Services'
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom CTA Section */}
      <Card>
        <CardContent className="p-8 bg-kwikie-orange text-white">
          <div className="text-center">
            {renderEditableSection(
              'cta_title',
              'Bottom CTA Title',
              'Ready to Get Started?'
            )}
            <div className="mt-4">
              {renderEditableSection(
                'cta_description',
                'Bottom CTA Description',
                'Join thousands of satisfied customers who trust us with their home service needs.'
              )}
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Button className="bg-white text-kwikie-orange hover:bg-gray-50 text-lg h-12 px-8 pointer-events-none">
                Get Started
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-kwikie-red text-lg h-12 px-8 pointer-events-none">
                Learn More
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutPageEditor;
