
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface AddBookerDialogProps {
  onBookerAdded: () => void;
}

const AddBookerDialog = ({ onBookerAdded }: AddBookerDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newBooker, setNewBooker] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
  });
  const { toast } = useToast();

  const handleAddBooker = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newBooker.full_name || !newBooker.email || !newBooker.phone || !newBooker.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (newBooker.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Creating booker with data:', newBooker);
      
      // First create a user account for the booker
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newBooker.email,
        password: newBooker.password,
        options: {
          data: {
            full_name: newBooker.full_name,
            phone: newBooker.phone,
          }
        }
      });

      console.log('Auth signup result:', { authData, authError });

      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }

      if (authData.user) {
        console.log('User created successfully, now creating booker record for user:', authData.user.id);
        
        // Then create the booker record
        const { data: bookerData, error: bookerError } = await supabase
          .from('bookers')
          .insert([{
            user_id: authData.user.id,
            full_name: newBooker.full_name,
            email: newBooker.email,
            phone: newBooker.phone,
            is_active: true
          }])
          .select();

        console.log('Booker insert result:', { bookerData, bookerError });

        if (bookerError) {
          console.error('Booker insert error:', bookerError);
          throw bookerError;
        }

        toast({
          title: "Success",
          description: "Booker added successfully.",
        });

        setNewBooker({ full_name: '', email: '', phone: '', password: '' });
        setIsOpen(false);
        onBookerAdded();
      } else {
        throw new Error('User creation failed - no user returned');
      }
    } catch (error: any) {
      console.error('Error adding booker:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add booker",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
        <form onSubmit={handleAddBooker} className="space-y-4">
          <div>
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={newBooker.full_name}
              onChange={(e) => setNewBooker({ ...newBooker, full_name: e.target.value })}
              placeholder="Enter full name"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={newBooker.email}
              onChange={(e) => setNewBooker({ ...newBooker, email: e.target.value })}
              placeholder="Enter email address"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={newBooker.phone}
              onChange={(e) => setNewBooker({ ...newBooker, phone: e.target.value })}
              placeholder="Enter phone number"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={newBooker.password}
              onChange={(e) => setNewBooker({ ...newBooker, password: e.target.value })}
              placeholder="Enter password"
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-kwikie-orange hover:bg-kwikie-red"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Booker'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookerDialog;
