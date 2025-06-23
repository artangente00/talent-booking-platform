
-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Admins can manage all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Bookers can manage all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view their own customer data" ON public.customers;
DROP POLICY IF EXISTS "Users can update their own customer data" ON public.customers;
DROP POLICY IF EXISTS "Admins can view all customers" ON public.customers;
DROP POLICY IF EXISTS "Bookers can view all customers" ON public.customers;

-- Make sure RLS is enabled on customers table
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Add policies for admins to manage all bookings
CREATE POLICY "Admins can manage all bookings" 
ON public.bookings 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE user_id = auth.uid() AND is_active = true
  )
) 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

-- Add policies for bookers to manage bookings
CREATE POLICY "Bookers can manage all bookings" 
ON public.bookings 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.bookers 
    WHERE user_id = auth.uid() AND is_active = true
  )
) 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.bookers 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

-- Allow users to view their own customer data
CREATE POLICY "Users can view their own customer data" 
ON public.customers 
FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

-- Allow users to update their own customer data
CREATE POLICY "Users can update their own customer data" 
ON public.customers 
FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid());

-- Allow admins to view all customer data
CREATE POLICY "Admins can view all customers" 
ON public.customers 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

-- Allow bookers to view all customer data
CREATE POLICY "Bookers can view all customers" 
ON public.customers 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.bookers 
    WHERE user_id = auth.uid() AND is_active = true
  )
);
