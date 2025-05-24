
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Save } from 'lucide-react';

interface PageContent {
  id: string;
  page_name: string;
  title: string;
  content: string;
  meta_description?: string;
  updated_at: string;
}

const ContentManagement = () => {
  const [pageContents, setPageContents] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const { toast } = useToast();

  const defaultPages = [
    { page_name: 'home', title: 'Home Page', content: 'Welcome to Kwikie Services - Your trusted home service provider.' },
    { page_name: 'about', title: 'About Us', content: 'We are a professional home services company dedicated to providing quality services.' },
    { page_name: 'services', title: 'Our Services', content: 'We offer a wide range of professional home services including cleaning, driving, babysitting, elderly care, and laundry services.' },
    { page_name: 'how-it-works', title: 'How It Works', content: 'Our simple 4-step process makes booking home services easy and convenient.' },
    { page_name: 'contact', title: 'Contact Us', content: 'Get in touch with us for any questions or support needs.' }
  ];

  useEffect(() => {
    fetchPageContents();
  }, []);

  const fetchPageContents = async () => {
    try {
      const { data, error } = await supabase
        .from('page_contents')
        .select('*')
        .order('page_name');

      if (error) throw error;

      // If no content exists, create default entries
      if (!data || data.length === 0) {
        await createDefaultContent();
        return;
      }

      setPageContents(data);
    } catch (error) {
      console.error('Error fetching page contents:', error);
      toast({
        title: "Error",
        description: "Failed to load page contents.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createDefaultContent = async () => {
    try {
      const { data, error } = await supabase
        .from('page_contents')
        .insert(defaultPages)
        .select();

      if (error) throw error;
      
      setPageContents(data || []);
      toast({
        title: "Success",
        description: "Default page contents created.",
      });
    } catch (error) {
      console.error('Error creating default content:', error);
      toast({
        title: "Error",
        description: "Failed to create default content.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (pageContent: PageContent) => {
    setSaving(pageContent.id);
    try {
      const { error } = await supabase
        .from('page_contents')
        .update({
          title: pageContent.title,
          content: pageContent.content,
          meta_description: pageContent.meta_description,
          updated_at: new Date().toISOString()
        })
        .eq('id', pageContent.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${pageContent.page_name} page updated successfully.`,
      });

      // Refresh the data
      fetchPageContents();
    } catch (error) {
      console.error('Error saving page content:', error);
      toast({
        title: "Error",
        description: "Failed to save changes.",
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  const updatePageContent = (id: string, field: keyof PageContent, value: string) => {
    setPageContents(prev => 
      prev.map(page => 
        page.id === id ? { ...page, [field]: value } : page
      )
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
        <h2 className="text-2xl font-bold mb-2">Content Management</h2>
        <p className="text-gray-600">Edit the content for different pages of your website.</p>
      </div>

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
                <CardTitle className="capitalize">{page.page_name.replace('-', ' ')} Page</CardTitle>
                <CardDescription>
                  Edit the content and metadata for the {page.page_name} page.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`title-${page.id}`}>Page Title</Label>
                  <Input
                    id={`title-${page.id}`}
                    value={page.title}
                    onChange={(e) => updatePageContent(page.id, 'title', e.target.value)}
                    placeholder="Enter page title"
                  />
                </div>

                <div>
                  <Label htmlFor={`content-${page.id}`}>Page Content</Label>
                  <Textarea
                    id={`content-${page.id}`}
                    value={page.content}
                    onChange={(e) => updatePageContent(page.id, 'content', e.target.value)}
                    placeholder="Enter page content"
                    rows={10}
                  />
                </div>

                <div>
                  <Label htmlFor={`meta-${page.id}`}>Meta Description (Optional)</Label>
                  <Textarea
                    id={`meta-${page.id}`}
                    value={page.meta_description || ''}
                    onChange={(e) => updatePageContent(page.id, 'meta_description', e.target.value)}
                    placeholder="Enter meta description for SEO"
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={() => handleSave(page)}
                  disabled={saving === page.id}
                  className="bg-kwikie-orange hover:bg-kwikie-red"
                >
                  {saving === page.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ContentManagement;
