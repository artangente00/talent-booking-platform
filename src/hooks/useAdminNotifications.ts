
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'new_customer' | 'new_booking' | 'new_talent';
  message: string;
  timestamp: Date;
  read: boolean;
}

export const useAdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to new customers
    const customersChannel = supabase
      .channel('customers-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'customers'
        },
        (payload) => {
          const newNotification: Notification = {
            id: `customer-${payload.new.id}-${Date.now()}`,
            type: 'new_customer',
            message: `New customer signup: ${payload.new.first_name} ${payload.new.last_name}`,
            timestamp: new Date(),
            read: false
          };
          
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          toast({
            title: "New Customer Signup",
            description: newNotification.message,
          });
        }
      )
      .subscribe();

    // Subscribe to new bookings
    const bookingsChannel = supabase
      .channel('bookings-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings'
        },
        (payload) => {
          const newNotification: Notification = {
            id: `booking-${payload.new.id}-${Date.now()}`,
            type: 'new_booking',
            message: `New booking created: ${payload.new.service_type}`,
            timestamp: new Date(),
            read: false
          };
          
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          toast({
            title: "New Booking",
            description: newNotification.message,
          });
        }
      )
      .subscribe();

    // Subscribe to new talent applications
    const talentsChannel = supabase
      .channel('talents-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'talents'
        },
        (payload) => {
          const newNotification: Notification = {
            id: `talent-${payload.new.id}-${Date.now()}`,
            type: 'new_talent',
            message: `New talent application: ${payload.new.full_name}`,
            timestamp: new Date(),
            read: false
          };
          
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          toast({
            title: "New Talent Application",
            description: newNotification.message,
          });
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(customersChannel);
      supabase.removeChannel(bookingsChannel);
      supabase.removeChannel(talentsChannel);
    };
  }, [toast]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications
  };
};
