
import React from 'react';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

interface IdPhotoUploadProps {
  idPhoto: File | null;
  idPhotoPreview: string | null;
  onPhotoChange: (file: File | null) => void;
  disabled?: boolean;
}

const IdPhotoUpload = ({ idPhoto, idPhotoPreview, onPhotoChange, disabled }: IdPhotoUploadProps) => {
  const handleIdPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onPhotoChange(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="idPhoto">ID Photo *</Label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        <input
          id="idPhoto"
          type="file"
          accept="image/*"
          onChange={handleIdPhotoChange}
          className="hidden"
          required
          disabled={disabled}
        />
        <label
          htmlFor="idPhoto"
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          {idPhotoPreview ? (
            <img
              src={idPhotoPreview}
              alt="ID Preview"
              className="max-w-32 max-h-32 object-cover rounded"
            />
          ) : (
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Click to upload your ID photo
              </p>
            </div>
          )}
        </label>
      </div>
    </div>
  );
};

export default IdPhotoUpload;
