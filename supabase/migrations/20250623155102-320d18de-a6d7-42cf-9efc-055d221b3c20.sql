
-- Enable RLS on notifications table if not already enabled
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view all notifications" ON public.notifications;
DROP POLICY IF EXISTS "Bookers can view all notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can manage notifications" ON public.notifications;
DROP POLICY IF EXISTS "Bookers can manage notifications" ON public.notifications;

-- Allow system/triggers to create notifications (this is the key policy that was missing)
CREATE POLICY "System can create notifications" 
ON public.notifications 
FOR INSERT 
TO authenticated, anon
WITH CHECK (true);

-- Allow admins to view all notifications
CREATE POLICY "Admins can view all notifications" 
ON public.notifications 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

-- Allow bookers to view all notifications
CREATE POLICY "Bookers can view all notifications" 
ON public.notifications 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.bookers 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

-- Allow admins to update notifications (mark as read, etc.)
CREATE POLICY "Admins can manage notifications" 
ON public.notifications 
FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

-- Allow bookers to update notifications (mark as read, etc.)
CREATE POLICY "Bookers can manage notifications" 
ON public.notifications 
FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.bookers 
    WHERE user_id = auth.uid() AND is_active = true
  )
);
