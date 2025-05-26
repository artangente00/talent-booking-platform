
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import BookerForm from './BookerForm';
import { useBookerCreation } from './useBookerCreation';

interface AddBookerDialogProps {
  onBookerAdded: () => void;
}

const AddBookerDialog = ({ onBookerAdded }: AddBookerDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
  });

  const { createBooker, isLoading } = useBookerCreation(() => {
    setFormData({ full_name: '', email: '', phone: '', password: '' });
    setIsOpen(false);
    onBookerAdded();
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createBooker(formData);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-kwikie-orange hover:bg-kwikie-red">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Booker
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Booker</DialogTitle>
          <DialogDescription>
            Create a new booker account. They will be able to log in with the provided credentials.
          </DialogDescription>
        </DialogHeader>
        <BookerForm
          formData={formData}
          onFormDataChange={setFormData}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddBookerDialog;
