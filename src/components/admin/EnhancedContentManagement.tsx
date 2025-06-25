
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Save, Plus, Trash2 } from 'lucide-react';

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

const EnhancedContentManagement = () => {
  const [pageContents, setPageContents] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const { toast } = useToast();

  const pageLayouts = {
    home: [
      { section_name: 'hero_title', content_type: 'text', label: 'Hero Title' },
      { section_name: 'hero_subtitle', content_type: 'textarea', label: 'Hero Subtitle' },
      { section_name: 'hero_description', content_type: 'textarea', label: 'Hero Description' },
      { section_name: 'services_title', content_type: 'text', label: 'Services Section Title' },
      { section_name: 'services_description', content_type: 'textarea', label: 'Services Description' },
      { section_name: 'how_it_works_title', content_type: 'text', label: 'How It Works Title' },
      { section_name: 'cta_title', content_type: 'text', label: 'Call to Action Title' },
      { section_name: 'cta_description', content_type: 'textarea', label: 'Call to Action Description' }
    ],
    about: [
      { section_name: 'hero_title', content_type: 'text', label: 'Page Title' },
      { section_name: 'hero_subtitle', content_type: 'textarea', label: 'Page Subtitle' },
      { section_name: 'mission_title', content_type: 'text', label: 'Mission Section Title' },
      { section_name: 'mission_content', content_type: 'textarea', label: 'Mission Content' },
      { section_name: 'mission_content_2', content_type: 'textarea', label: 'Mission Content (Second Paragraph)' },
      { section_name: 'values_title', content_type: 'text', label: 'Values Section Title' },
      { section_name: 'values_description', content_type: 'textarea', label: 'Values Description' },
      { section_name: 'team_title', content_type: 'text', label: 'Team Section Title' },
      { section_name: 'team_description', content_type: 'textarea', label: 'Team Description' },
      { section_name: 'cta_title', content_type: 'text', label: 'Bottom CTA Title' },
      { section_name: 'cta_description', content_type: 'textarea', label: 'Bottom CTA Description' }
    ],
    services: [
      { section_name: 'hero_title', content_type: 'text', label: 'Hero Title' },
      { section_name: 'hero_subtitle', content_type: 'textarea', label: 'Hero Subtitle' },
      { section_name: 'cleaning_description', content_type: 'textarea', label: 'Cleaning Services Description' },
      { section_name: 'drivers_description', content_type: 'textarea', label: 'Driver Services Description' },
      { section_name: 'babysitting_description', content_type: 'textarea', label: 'Babysitting Description' },
      { section_name: 'elderly_care_description', content_type: 'textarea', label: 'Elderly Care Description' },
      { section_name: 'laundry_description', content_type: 'textarea', label: 'Laundry Services Description' }
    ],
    'how-it-works': [
      { section_name: 'hero_title', content_type: 'text', label: 'Page Title' },
      { section_name: 'hero_subtitle', content_type: 'textarea', label: 'Page Subtitle' },
      { section_name: 'step_1_title', content_type: 'text', label: 'Step 1 Title' },
      { section_name: 'step_1_description', content_type: 'textarea', label: 'Step 1 Description' },
      { section_name: 'step_2_title', content_type: 'text', label: 'Step 2 Title' },
      { section_name: 'step_2_description', content_type: 'textarea', label: 'Step 2 Description' },
      { section_name: 'step_3_title', content_type: 'text', label: 'Step 3 Title' },
      { section_name: 'step_3_description', content_type: 'textarea', label: 'Step 3 Description' },
      { section_name: 'step_4_title', content_type: 'text', label: 'Step 4 Title' },
      { section_name: 'step_4_description', content_type: 'textarea', label: 'Step 4 Description' },
      { section_name: 'step_5_title', content_type: 'text', label: 'Step 5 Title' },
      { section_name: 'step_5_description', content_type: 'textarea', label: 'Step 5 Description' },
      { section_name: 'why_choose_title', content_type: 'text', label: 'Why Choose Us Title' },
      { section_name: 'why_choose_description', content_type: 'textarea', label: 'Why Choose Us Description' }
    ],
    contact: [
      { section_name: 'hero_title', content_type: 'text', label: 'Page Title' },
      { section_name: 'hero_subtitle', content_type: 'textarea', label: 'Page Subtitle' },
      { section_name: 'get_in_touch_title', content_type: 'text', label: 'Get in Touch Title' },
      { section_name: 'get_in_touch_description', content_type: 'textarea', label: 'Get in Touch Description' },
      { section_name: 'phone_number', content_type: 'text', label: 'Phone Number' },
      { section_name: 'email_address', content_type: 'text', label: 'Email Address' },
      { section_name: 'office_address', content_type: 'text', label: 'Office Address' },
      { section_name: 'support_hours', content_type: 'text', label: 'Support Hours' },
      { section_name: 'emergency_title', content_type: 'text', label: 'Emergency Contact Title' },
      { section_name: 'emergency_description', content_type: 'textarea', label: 'Emergency Contact Description' },
      { section_name: 'emergency_phone', content_type: 'text', label: 'Emergency Phone Number' }
    ]
  };

  useEffect(() => {
    fetchEnhancedPageContents();
  }, []);

  const fetchEnhancedPageContents = async () => {
    try {
      const { data, error } = await supabase
        .from('enhanced_page_contents')
        .select('*')
        .order('page_name');

      if (error) throw error;

      if (!data || data.length === 0) {
        await createDefaultEnhancedContent();
        return;
      }

      // Group sections by page
      const groupedData = data.reduce((acc: any, item: any) => {
        const pageKey = item.page_name;
        if (!acc[pageKey]) {
          acc[pageKey] = {
            id: item.page_id,
            page_name: item.page_name,
            title: item.page_title,
            meta_description: item.meta_description,
            sections: [],
            updated_at: item.updated_at
          };
        }
        acc[pageKey].sections.push({
          id: item.id,
          section_name: item.section_name,
          content_type: item.content_type,
          content_value: item.content_value,
          display_order: item.display_order
        });
        return acc;
      }, {});

      setPageContents(Object.values(groupedData));
    } catch (error) {
      console.error('Error fetching enhanced page contents:', error);
      toast({
        title: "Error",
        description: "Failed to load page contents.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createDefaultEnhancedContent = async () => {
    try {
      const defaultContents = [];
      
      Object.entries(pageLayouts).forEach(([pageName, sections]) => {
        const pageId = crypto.randomUUID();
        sections.forEach((section, index) => {
          defaultContents.push({
            page_id: pageId,
            page_name: pageName,
            page_title: `${pageName.charAt(0).toUpperCase() + pageName.slice(1).replace('-', ' ')} Page`,
            section_name: section.section_name,
            content_type: section.content_type,
            content_value: `Default ${section.label.toLowerCase()}`,
            display_order: index + 1,
            meta_description: `Meta description for ${pageName} page`
          });
        });
      });

      const { data, error } = await supabase
        .from('enhanced_page_contents')
        .insert(defaultContents)
        .select();

      if (error) throw error;
      
      await fetchEnhancedPageContents();
      toast({
        title: "Success",
        description: "Default enhanced page contents created.",
      });
    } catch (error) {
      console.error('Error creating default enhanced content:', error);
      toast({
        title: "Error",
        description: "Failed to create default content.",
        variant: "destructive",
      });
    }
  };

  const handleSaveSection = async (pageId: string, sectionId: string, newValue: string) => {
    setSaving(sectionId);
    try {
      const { error } = await supabase
        .from('enhanced_page_contents')
        .update({
          content_value: newValue,
          updated_at: new Date().toISOString()
        })
        .eq('id', sectionId);

      if (error) throw error;

      // Update local state
      setPageContents(prev => 
        prev.map(page => 
          page.id === pageId 
            ? {
                ...page,
                sections: page.sections.map(section =>
                  section.id === sectionId 
                    ? { ...section, content_value: newValue }
                    : section
                )
              }
            : page
        )
      );

      toast({
        title: "Success",
        description: "Content section updated successfully.",
      });
    } catch (error) {
      console.error('Error saving section:', error);
      toast({
        title: "Error",
        description: "Failed to save changes.",
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  const updateSectionValue = (pageId: string, sectionId: string, value: string) => {
    setPageContents(prev => 
      prev.map(page => 
        page.id === pageId 
          ? {
              ...page,
              sections: page.sections.map(section =>
                section.id === sectionId 
                  ? { ...section, content_value: value }
                  : section
              )
            }
          : page
      )
    );
  };

  const renderContentInput = (page: PageContent, section: ContentSection) => {
    const layout = pageLayouts[page.page_name as keyof typeof pageLayouts];
    const sectionLayout = layout?.find(l => l.section_name === section.section_name);
    const label = sectionLayout?.label || section.section_name;

    if (section.content_type === 'textarea') {
      return (
        <div key={section.id} className="space-y-2">
          <Label htmlFor={`${section.id}`}>{label}</Label>
          <Textarea
            id={`${section.id}`}
            value={section.content_value}
            onChange={(e) => updateSectionValue(page.id, section.id, e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}`}
            rows={4}
          />
          <Button 
            size="sm"
            onClick={() => handleSaveSection(page.id, section.id, section.content_value)}
            disabled={saving === section.id}
            className="bg-kwikie-orange hover:bg-kwikie-red"
          >
            {saving === section.id ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save
              </>
            )}
          </Button>
        </div>
      );
    }

    return (
      <div key={section.id} className="space-y-2">
        <Label htmlFor={`${section.id}`}>{label}</Label>
        <Input
          id={`${section.id}`}
          value={section.content_value}
          onChange={(e) => updateSectionValue(page.id, section.id, e.target.value)}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
        <Button 
          size="sm"
          onClick={() => handleSaveSection(page.id, section.id, section.content_value)}
          disabled={saving === section.id}
          className="bg-kwikie-orange hover:bg-kwikie-red"
        >
          {saving === section.id ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save
            </>
          )}
        </Button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Enhanced Content Management</h2>
        <p className="text-gray-600">Edit the content for different sections of your website pages.</p>
      </div>

      {pageContents.length > 0 ? (
        <Tabs defaultValue={pageContents[0]?.page_name || 'home'} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            {pageContents.map((page) => (
              <TabsTrigger key={page.page_name} value={page.page_name} className="capitalize">
                {page.page_name.replace('-', ' ')}
              </TabsTrigger>
            ))}
          </TabsList>

          {pageContents.map((page) => (
            <TabsContent key={page.page_name} value={page.page_name}>
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{page.page_name.replace('-', ' ')} Page Content</CardTitle>
                  <CardDescription>
                    Edit the specific content sections for the {page.page_name} page.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {page.sections
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((section) => renderContentInput(page, section))}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No enhanced page contents found. Creating default structure...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedContentManagement;
