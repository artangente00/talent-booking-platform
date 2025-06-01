
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, X, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  value: string | null;
  onImageUpload: (url: string | null) => void;
  disabled?: boolean;
}

const ImageUpload = ({ value, onImageUpload, disabled = false }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      
      console.log('Starting upload process for file:', file.name);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = fileName;

      console.log('Uploading to path:', filePath);

      const { data, error: uploadError } = await supabase.storage
        .from('freelancer-profiles')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful, data:', data);

      const { data: urlData } = supabase.storage
        .from('freelancer-profiles')
        .getPublicUrl(filePath);

      console.log('Public URL:', urlData.publicUrl);

      onImageUpload(urlData.publicUrl);
      
      toast({
        title: "Success",
        description: "Profile photo uploaded successfully.",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: `Failed to upload profile photo: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async () => {
    if (value) {
      try {
        // Extract filename from URL
        const url = new URL(value);
        const pathParts = url.pathname.split('/');
        const fileName = pathParts[pathParts.length - 1];
        
        console.log('Removing file:', fileName);
        
        const { error } = await supabase.storage
          .from('freelancer-profiles')
          .remove([fileName]);
          
        if (error) {
          console.error('Error removing file:', error);
        }
      } catch (error) {
        console.error('Error parsing URL for removal:', error);
      }
    }
    onImageUpload(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 5MB.",
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }

      uploadImage(file);
    }
  };

  return (
    <div className="space-y-4">
      <Label>Profile Photo</Label>
      <div className="flex items-center gap-4">
        <Avatar className="w-20 h-20">
          <AvatarImage src={value || undefined} />
          <AvatarFallback>
            <User className="w-8 h-8" />
          </AvatarFallback>
        </Avatar>
        
        <div className="flex flex-col gap-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={disabled || uploading}
            className="w-auto"
          />
          
          {value && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={removeImage}
              disabled={disabled || uploading}
              className="w-fit"
            >
              <X className="w-4 h-4 mr-2" />
              Remove Photo
            </Button>
          )}
        </div>
      </div>
      
      {uploading && (
        <div className="text-sm text-gray-600">Uploading...</div>
      )}
    </div>
  );
};

export default ImageUpload;
