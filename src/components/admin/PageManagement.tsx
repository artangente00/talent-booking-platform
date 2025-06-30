
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Search, Filter, Edit, Eye, Trash2 } from 'lucide-react';
import PageEditor from './PageEditor';

interface PageItem {
  id: string;
  page_name: string;
  page_title: string;
  status: 'published' | 'draft';
  updated_at: string;
  author: string;
  sections_count: number;
}

const PageManagement = () => {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [currentPageName, setCurrentPageName] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('enhanced_page_contents')
        .select('*')
        .order('page_name');

      if (error) throw error;

      // Group by page and create page items
      const groupedData = data?.reduce((acc: any, item: any) => {
        const pageKey = item.page_name;
        if (!acc[pageKey]) {
          acc[pageKey] = {
            id: item.page_id,
            page_name: item.page_name,
            page_title: item.page_title,
            status: 'published', // Default status
            updated_at: item.updated_at,
            author: 'Admin', // Default author
            sections_count: 0
          };
        }
        acc[pageKey].sections_count++;
        return acc;
      }, {});

      setPages(Object.values(groupedData) || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast({
        title: "Error",
        description: "Failed to load pages.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.page_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.page_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || page.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPages(filteredPages.map(page => page.id));
    } else {
      setSelectedPages([]);
    }
  };

  const handleSelectPage = (pageId: string, checked: boolean) => {
    if (checked) {
      setSelectedPages([...selectedPages, pageId]);
    } else {
      setSelectedPages(selectedPages.filter(id => id !== pageId));
    }
  };

  const handleEditPage = (page: PageItem) => {
    setCurrentPageName(page.page_name);
    setShowEditor(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }) + ' at ' + new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPageDisplayName = (pageName: string) => {
    return pageName.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (showEditor && currentPageName) {
    return <PageEditor pageName={currentPageName} onBack={() => setShowEditor(false)} />;
  }

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
        <h2 className="text-2xl font-bold mb-2">Pages</h2>
        <Button className="bg-blue-600 hover:bg-blue-700">Add New</Button>
      </div>

      {/* Status filters */}
      <div className="flex items-center gap-4 text-sm">
        <span 
          className={`cursor-pointer ${filterStatus === 'all' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600'}`}
          onClick={() => setFilterStatus('all')}
        >
          All ({pages.length})
        </span>
        <span className="text-gray-400">|</span>
        <span 
          className={`cursor-pointer ${filterStatus === 'published' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600'}`}
          onClick={() => setFilterStatus('published')}
        >
          Published ({pages.filter(p => p.status === 'published').length})
        </span>
        <span className="text-gray-400">|</span>
        <span 
          className={`cursor-pointer ${filterStatus === 'draft' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600'}`}
          onClick={() => setFilterStatus('draft')}
        >
          Draft ({pages.filter(p => p.status === 'draft').length})
        </span>
      </div>

      {/* Search and filters */}
      <div className="flex items-center gap-4">
        <Select defaultValue="bulk-actions">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bulk-actions" disabled>Bulk actions</SelectItem>
            <SelectItem value="delete">Move to Trash</SelectItem>
            <SelectItem value="publish">Publish</SelectItem>
            <SelectItem value="draft">Move to Draft</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">Apply</Button>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All dates</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>

        <div className="flex-1" />
        
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search Pages"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      {/* Pages table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedPages.length === filteredPages.length && filteredPages.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPages.map((page) => (
                <TableRow key={page.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Checkbox
                      checked={selectedPages.includes(page.id)}
                      onCheckedChange={(checked) => handleSelectPage(page.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditPage(page)}
                          className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {getPageDisplayName(page.page_name)}
                        </button>
                        {page.status === 'draft' && (
                          <Badge variant="secondary" className="text-xs">
                            Draft
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <button 
                          onClick={() => handleEditPage(page)}
                          className="hover:text-blue-600"
                        >
                          Edit
                        </button>
                        <span>|</span>
                        <button className="hover:text-blue-600">Quick Edit</button>
                        <span>|</span>
                        <button className="hover:text-red-600">Trash</button>
                        <span>|</span>
                        <button className="hover:text-blue-600">View</button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-blue-600">
                    {page.author}
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-400">—</span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{page.status === 'published' ? 'Published' : 'Last Modified'}</div>
                      <div className="text-gray-500">{formatDate(page.updated_at)}</div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="text-sm text-gray-500">
        {filteredPages.length} {filteredPages.length === 1 ? 'item' : 'items'}
      </div>
    </div>
  );
};

export default PageManagement;
