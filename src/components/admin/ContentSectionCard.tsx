
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Save, Edit, Eye } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

interface ContentSectionCardProps {
  sectionName: string;
  label: string;
  value: string;
  contentType: string;
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const ContentSectionCard: React.FC<ContentSectionCardProps> = ({
  sectionName,
  label,
  value,
  contentType,
  isEditing,
  isSaving,
  onEdit,
  onChange,
  onSave,
  onCancel
}) => {
  const getContentPreview = (content: string) => {
    // Strip HTML tags and limit to 100 characters
    const stripped = content.replace(/<[^>]*>/g, '');
    return stripped.length > 100 ? stripped.substring(0, 100) + '...' : stripped;
  };

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{label}</CardTitle>
          <Badge variant="outline" className="text-xs">
            {contentType}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="space-y-3">
            <RichTextEditor
              value={value}
              onChange={onChange}
              placeholder={`Enter ${label.toLowerCase()}`}
            />
            <div className="flex gap-2">
              <Button 
                size="sm"
                onClick={onSave}
                disabled={isSaving}
                className="bg-kwikie-orange hover:bg-kwikie-red"
              >
                {isSaving ? (
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
              <Button 
                size="sm"
                variant="outline"
                onClick={onCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="min-h-[60px] p-3 bg-gray-50 rounded-md text-sm text-gray-700">
              {getContentPreview(value) || 'No content set'}
            </div>
            <Button 
              size="sm"
              variant="outline"
              onClick={onEdit}
              className="w-full"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Content
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentSectionCard;
