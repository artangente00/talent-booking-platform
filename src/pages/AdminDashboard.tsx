import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, TrendingUp, Settings, Star, FileText, Package, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import AdminStats from '@/components/admin/AdminStats';
import CustomersManagement from '@/components/admin/CustomersManagement';
import BookingsManagement from '@/components/admin/BookingsManagement';
import AdminsManagement from '@/components/admin/AdminsManagement';
import TalentManagement from '@/components/admin/TalentManagement';
import ContentManagement from '@/components/admin/ContentManagement';
import ServicesManagement from '@/components/admin/ServicesManagement';
import BookersManagement from '@/components/admin/BookersManagement';

const AdminDashboard = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication and admin status
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
      checkAdminStatus(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
      checkAdminStatus(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('is_admin', { user_uuid: userId });
      
      if (error) throw error;
      
      if (!data) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges to access this page.",
          variant: "destructive",
        });
        navigate('/dashboard');
        return;
      }
      
      setIsAdmin(true);
    } catch (error) {
      console.error('Error checking admin status:', error);
      toast({
        title: "Error",
        description: "Failed to verify admin access.",
        variant: "destructive",
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-kwikie-orange mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Manage your business operations and monitor performance.</p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <div className="overflow-x-auto">
              <TabsList className="grid grid-cols-8 min-w-max md:w-full">
                <TabsTrigger value="overview" className="flex items-center gap-2 px-2 md:px-3">
                  <TrendingUp className="w-4 h-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="customers" className="flex items-center gap-2 px-2 md:px-3">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Customers</span>
                </TabsTrigger>
                <TabsTrigger value="bookings" className="flex items-center gap-2 px-2 md:px-3">
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">Bookings</span>
                </TabsTrigger>
                <TabsTrigger value="bookers" className="flex items-center gap-2 px-2 md:px-3">
                  <UserCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Bookers</span>
                </TabsTrigger>
                <TabsTrigger value="services" className="flex items-center gap-2 px-2 md:px-3">
                  <Package className="w-4 h-4" />
                  <span className="hidden sm:inline">Services</span>
                </TabsTrigger>
                <TabsTrigger value="talents" className="flex items-center gap-2 px-2 md:px-3">
                  <Star className="w-4 h-4" />
                  <span className="hidden sm:inline">Freelancers</span>
                </TabsTrigger>
                <TabsTrigger value="content" className="flex items-center gap-2 px-2 md:px-3">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Content</span>
                </TabsTrigger>
                <TabsTrigger value="admins" className="flex items-center gap-2 px-2 md:px-3">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Admins</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview">
              <AdminStats />
            </TabsContent>

            <TabsContent value="customers">
              <CustomersManagement />
            </TabsContent>

            <TabsContent value="bookings">
              <BookingsManagement />
            </TabsContent>

            <TabsContent value="bookers">
              <BookersManagement />
            </TabsContent>

            <TabsContent value="services">
              <ServicesManagement />
            </TabsContent>

            <TabsContent value="talents">
              <TalentManagement />
            </TabsContent>

            <TabsContent value="content">
              <ContentManagement />
            </TabsContent>

            <TabsContent value="admins">
              <AdminsManagement />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
