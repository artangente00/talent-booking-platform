
-- Enable Row Level Security on the bookings table
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own bookings
CREATE POLICY "Users can create bookings" 
ON public.bookings 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Allow authenticated users to view their own bookings
CREATE POLICY "Users can view their own bookings" 
ON public.bookings 
FOR SELECT 
TO authenticated 
USING (
  customer_id IN (
    SELECT id FROM public.customers WHERE user_id = auth.uid()
  )
);

-- Allow authenticated users to update their own bookings
CREATE POLICY "Users can update their own bookings" 
ON public.bookings 
FOR UPDATE 
TO authenticated 
USING (
  customer_id IN (
    SELECT id FROM public.customers WHERE user_id = auth.uid()
  )
);
