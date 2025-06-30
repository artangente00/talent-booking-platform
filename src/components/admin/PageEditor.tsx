
import React, { useState, useEffect, useCallback } from 'react';
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

  const fetchPageContent = useCallback(async () => {
    try {
      console.log('Starting to fetch page content for:', pageName);
      setLoading(true);
      
      const { data, error } = await supabase
        .from('enhanced_page_contents')
        .select('*')
        .eq('page_name', pageName)
        .order('display_order');

      console.log('Supabase query result:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Always create a default content structure
      const defaultContent = {
        id: data && data.length > 0 ? data[0].page_id : 'default',
        page_name: pageName,
        title: pageName.charAt(0).toUpperCase() + pageName.slice(1),
        meta_description: data && data.length > 0 ? data[0].meta_description : '',
        sections: data && data.length > 0 ? data.map(item => ({
          id: item.id,
          section_name: item.section_name,
          content_type: item.content_type as 'text' | 'textarea' | 'list' | 'image_url',
          content_value: item.content_value,
          display_order: item.display_order
        })) : [],
        updated_at: data && data.length > 0 ? data[0].updated_at : new Date().toISOString()
      };

      console.log('Setting page content:', defaultContent);
      setPageContent(defaultContent);
    } catch (error) {
      console.error('Error fetching page content:', error);
      toast({
        title: "Error",
        description: "Failed to load page content. Using default content.",
        variant: "destructive",
      });
      
      // Always set default content even on error
      const defaultContent = {
        id: 'default',
        page_name: pageName,
        title: pageName.charAt(0).toUpperCase() + pageName.slice(1),
        meta_description: '',
        sections: [],
        updated_at: new Date().toISOString()
      };
      setPageContent(defaultContent);
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  }, [pageName, toast]);

  useEffect(() => {
    console.log('PageEditor mounted for page:', pageName);
    fetchPageContent();
  }, [fetchPageContent]);

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

  const updateSectionValue = useCallback((sectionId: string, value: string) => {
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
  }, []);

  const getContent = useCallback((sectionName: string, fallback: string = '') => {
    const content = pageContent?.sections.find(s => s.section_name === sectionName)?.content_value || fallback;
    console.log(`Getting content for ${sectionName}:`, content);
    return content;
  }, [pageContent]);

  const getSectionId = useCallback((sectionName: string) => {
    const id = pageContent?.sections.find(s => s.section_name === sectionName)?.id || '';
    console.log(`Getting section ID for ${sectionName}:`, id);
    return id;
  }, [pageContent]);

  console.log('PageEditor render state:', { loading, pageContent });

  if (loading) {
    console.log('Rendering loading state');
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading page content...</span>
      </div>
    );
  }

  const renderPageEditor = () => {
    console.log('Rendering page editor for:', pageName);
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
