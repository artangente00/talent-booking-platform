
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ContentSection {
  section_name: string;
  content_value: string;
  content_type: string;
}

interface PageContent {
  title: string;
  meta_description?: string;
  sections: Record<string, string>;
}

export const usePageContent = (pageName: string) => {
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
          const pageContent: PageContent = {
            title: data[0].page_title,
            meta_description: data[0].meta_description,
            sections: {}
          };

          data.forEach((item: any) => {
            pageContent.sections[item.section_name] = item.content_value;
          });

          setContent(pageContent);
        } else {
          // Fallback to default content if no enhanced content found
          setContent({
            title: `${pageName.charAt(0).toUpperCase() + pageName.slice(1)} Page`,
            sections: {}
          });
        }
      } catch (err) {
        console.error('Error fetching page content:', err);
        setError('Failed to load page content');
        // Set fallback content on error
        setContent({
          title: `${pageName.charAt(0).toUpperCase() + pageName.slice(1)} Page`,
          sections: {}
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPageContent();
  }, [pageName]);

  const getContent = (sectionName: string, fallback: string = '') => {
    return content?.sections[sectionName] || fallback;
  };

  return {
    content,
    loading,
    error,
    getContent
  };
};
