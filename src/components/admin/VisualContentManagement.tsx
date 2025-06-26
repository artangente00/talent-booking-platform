import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Save } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import ContentSectionCard from './ContentSectionCard';

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

const VisualContentManagement = () => {
  const [pageContents, setPageContents] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const { toast } = useToast();

  // Homepage section groups for better organization
  const homepageSectionGroups = [
    {
      title: 'Hero Section',
      sections: ['hero_title', 'hero_subtitle', 'hero_feature_1', 'hero_feature_2', 'hero_feature_3']
    },
    {
      title: 'Services Section',
      sections: ['services_title', 'services_description']
    },
    {
      title: 'How It Works',
      sections: ['how_it_works_title', 'how_it_works_description']
    },
    {
      title: 'Testimonials',
      sections: ['testimonials_title', 'testimonials_description']
    },
    {
      title: 'Call to Action',
      sections: ['cta_title', 'cta_description']
    }
  ];

  const pageLayouts = {
    home: [
      { section_name: 'hero_title', content_type: 'text', label: 'Hero Title' },
      { section_name: 'hero_subtitle', content_type: 'textarea', label: 'Hero Subtitle' },
      { section_name: 'hero_feature_1', content_type: 'text', label: 'Hero Feature 1' },
      { section_name: 'hero_feature_2', content_type: 'text', label: 'Hero Feature 2' },
      { section_name: 'hero_feature_3', content_type: 'text', label: 'Hero Feature 3' },
      { section_name: 'services_title', content_type: 'text', label: 'Services Section Title' },
      { section_name: 'services_description', content_type: 'textarea', label: 'Services Description' },
      { section_name: 'how_it_works_title', content_type: 'text', label: 'How It Works Title' },
      { section_name: 'how_it_works_description', content_type: 'textarea', label: 'How It Works Description' },
      { section_name: 'testimonials_title', content_type: 'text', label: 'Testimonials Title' },
      { section_name: 'testimonials_description', content_type: 'textarea', label: 'Testimonials Description' },
      { section_name: 'cta_title', content_type: 'text', label: 'Call to Action Title' },
      { section_name: 'cta_description', content_type: 'textarea', label: 'Call to Action Description' }
    ],
    about: [
      { section_name: 'hero_title', content_type: 'text', label: 'Page Title' },
      { section_name: 'hero_subtitle', content_type: 'textarea', label: 'Page Subtitle' },
      { section_name: 'mission_title', content_type: 'text', label: 'Mission Section Title' },
      { section_name: 'mission_content', content_type: 'textarea', label: 'Mission Content' }
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
          let defaultValue = '';
          
          // Set realistic default values based on section names
          if (pageName === 'home') {
            switch (section.section_name) {
              case 'hero_title':
                defaultValue = 'Find Trusted Talent for Your Home Services';
                break;
              case 'hero_subtitle':
                defaultValue = 'Easily book trusted professionals for cleaning, driving, childcare, elder care, laundry, and a wide range of other services—all in just a few clicks.';
                break;
              case 'hero_feature_1':
                defaultValue = 'Verified Professionals';
                break;
              case 'hero_feature_2':
                defaultValue = 'Fixed Rates';
                break;
              case 'hero_feature_3':
                defaultValue = 'Satisfaction Guaranteed';
                break;
              case 'services_title':
                defaultValue = 'Our Services';
                break;
              case 'services_description':
                defaultValue = 'Choose from our wide range of professional home services designed to make your life easier.';
                break;
              case 'how_it_works_title':
                defaultValue = 'How It Works';
                break;
              case 'how_it_works_description':
                defaultValue = 'Getting the help you need is simple and straightforward.';
                break;
              case 'testimonials_title':
                defaultValue = 'What Our Customers Say';
                break;
              case 'testimonials_description':
                defaultValue = 'Read testimonials from our satisfied customers.';
                break;
              case 'cta_title':
                defaultValue = 'Ready to Get Started?';
                break;
              case 'cta_description':
                defaultValue = 'Join thousands of satisfied customers who trust us with their home service needs.';
                break;
              default:
                defaultValue = `Default ${section.label.toLowerCase()}`;
            }
          } else {
            defaultValue = `Default ${section.label.toLowerCase()}`;
          }

          defaultContents.push({
            page_id: pageId,
            page_name: pageName,
            page_title: `${pageName.charAt(0).toUpperCase() + pageName.slice(1).replace('-', ' ')} Page`,
            section_name: section.section_name,
            content_type: section.content_type,
            content_value: defaultValue,
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

      setEditingSection(null);
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

  const getSectionByName = (page: PageContent, sectionName: string) => {
    return page.sections.find(s => s.section_name === sectionName);
  };

  const getSectionLabel = (pageName: string, sectionName: string) => {
    const layout = pageLayouts[pageName as keyof typeof pageLayouts];
    const sectionLayout = layout?.find(l => l.section_name === sectionName);
    return sectionLayout?.label || sectionName;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const homePage = pageContents.find(p => p.page_name === 'home');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Visual Content Management</h2>
        <p className="text-gray-600">Edit your website content with a visual layout that mirrors your actual pages.</p>
      </div>

      <Tabs defaultValue="home" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="home">Home Page</TabsTrigger>
          <TabsTrigger value="other-pages">Other Pages</TabsTrigger>
          <TabsTrigger value="page-settings">Page Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="home">
          {homePage ? (
            <div className="space-y-8">
              {/* Page Title Editor */}
              <Card>
                <CardHeader>
                  <CardTitle>Page Settings</CardTitle>
                  <CardDescription>Configure the overall page settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Page Title</label>
                      <RichTextEditor
                        value={homePage.title}
                        onChange={(value) => {
                          setPageContents(prev => 
                            prev.map(page => 
                              page.id === homePage.id 
                                ? { ...page, title: value }
                                : page
                            )
                          );
                        }}
                        placeholder="Enter page title"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Content Sections Organized by Page Areas */}
              {homepageSectionGroups.map((group, groupIndex) => (
                <Card key={group.title}>
                  <CardHeader>
                    <CardTitle>{group.title}</CardTitle>
                    <CardDescription>Edit content for the {group.title.toLowerCase()} of your homepage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {group.sections.map((sectionName) => {
                        const section = getSectionByName(homePage, sectionName);
                        if (!section) return null;

                        return (
                          <ContentSectionCard
                            key={section.id}
                            sectionName={section.section_name}
                            label={getSectionLabel('home', section.section_name)}
                            value={section.content_value}
                            contentType={section.content_type}
                            isEditing={editingSection === section.id}
                            isSaving={saving === section.id}
                            onEdit={() => setEditingSection(section.id)}
                            onChange={(value) => updateSectionValue(homePage.id, section.id, value)}
                            onSave={() => handleSaveSection(homePage.id, section.id, section.content_value)}
                            onCancel={() => setEditingSection(null)}
                          />
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No home page content found.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="other-pages">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pageContents.filter(p => p.page_name !== 'home').map((page) => (
              <Card key={page.page_name}>
                <CardHeader>
                  <CardTitle className="capitalize">{page.page_name.replace('-', ' ')} Page</CardTitle>
                  <CardDescription>{page.sections.length} content sections</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {page.sections.slice(0, 3).map((section) => (
                      <div key={section.id} className="p-3 bg-gray-50 rounded text-sm">
                        <div className="font-medium">{getSectionLabel(page.page_name, section.section_name)}</div>
                        <div className="text-gray-600 truncate">
                          {section.content_value.replace(/<[^>]*>/g, '') || 'No content'}
                        </div>
                      </div>
                    ))}
                    {page.sections.length > 3 && (
                      <div className="text-sm text-gray-500">
                        +{page.sections.length - 3} more sections
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="page-settings">
          <Card>
            <CardHeader>
              <CardTitle>Page Settings</CardTitle>
              <CardDescription>Configure meta information and page-level settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pageContents.map((page) => (
                  <div key={page.page_name} className="p-4 border rounded-lg">
                    <h3 className="font-medium capitalize mb-2">{page.page_name.replace('-', ' ')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Title:</span> {page.title}
                      </div>
                      <div>
                        <span className="text-gray-600">Sections:</span> {page.sections.length}
                      </div>
                      <div>
                        <span className="text-gray-600">Last Updated:</span> {new Date(page.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VisualContentManagement;
