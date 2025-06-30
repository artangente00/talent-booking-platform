
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Save } from 'lucide-react';
import HomePageEditor from './editors/HomePageEditor';
import AboutPageEditor from './editors/AboutPageEditor';

interface PageEditorProps {
  pageName: string;
  onBack: () => void;
}

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

const PageEditor: React.FC<PageEditorProps> = ({ pageName, onBack }) => {
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPageContent();
  }, [pageName]);

  const fetchPageContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('enhanced_page_contents')
        .select('*')
        .eq('page_name', pageName)
        .order('display_order');

      if (error) throw error;

      if (data && data.length > 0) {
        const groupedData = {
          id: data[0].page_id,
          page_name: data[0].page_name,
          title: data[0].page_title,
          meta_description: data[0].meta_description,
          sections: data.map(item => ({
            id: item.id,
            section_name: item.section_name,
            content_type: item.content_type as 'text' | 'textarea' | 'list' | 'image_url',
            content_value: item.content_value,
            display_order: item.display_order
          })),
          updated_at: data[0].updated_at
        };

        setPageContent(groupedData);
      }
    } catch (error) {
      console.error('Error fetching page content:', error);
      toast({
        title: "Error",
        description: "Failed to load page content.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSection = async (sectionId: string, newValue: string) => {
    setSaving(true);
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
      setPageContent(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          sections: prev.sections.map(section =>
            section.id === sectionId 
              ? { ...section, content_value: newValue }
              : section
          )
        };
      });

      toast({
        title: "Success",
        description: "Content updated successfully.",
      });
    } catch (error) {
      console.error('Error saving section:', error);
      toast({
        title: "Error",
        description: "Failed to save changes.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSectionValue = (sectionId: string, value: string) => {
    setPageContent(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        sections: prev.sections.map(section =>
          section.id === sectionId 
            ? { ...section, content_value: value }
            : section
        )
      };
    });
  };

  const getContent = (sectionName: string, fallback: string = '') => {
    return pageContent?.sections.find(s => s.section_name === sectionName)?.content_value || fallback;
  };

  const getSectionId = (sectionName: string) => {
    return pageContent?.sections.find(s => s.section_name === sectionName)?.id || '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const renderPageEditor = () => {
    switch (pageName) {
      case 'home':
        return (
          <HomePageEditor
            pageContent={pageContent}
            getContent={getContent}
            getSectionId={getSectionId}
            updateSectionValue={updateSectionValue}
            handleSaveSection={handleSaveSection}
            saving={saving}
          />
        );
      case 'about':
        return (
          <AboutPageEditor
            pageContent={pageContent}
            getContent={getContent}
            getSectionId={getSectionId}
            updateSectionValue={updateSectionValue}
            handleSaveSection={handleSaveSection}
            saving={saving}
          />
        );
      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Editor for {pageName} page is not yet implemented.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            ← Back to Pages
          </Button>
          <h2 className="text-2xl font-bold">Edit Page: {pageContent?.title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Preview</Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Save className="mr-2 h-4 w-4" />
            Save All Changes
          </Button>
        </div>
      </div>

      {renderPageEditor()}
    </div>
  );
};

export default PageEditor;
