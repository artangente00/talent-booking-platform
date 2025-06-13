
-- Add a column to store the selected pricing option for services with special pricing
ALTER TABLE public.bookings 
ADD COLUMN selected_pricing jsonb;

-- Add a comment to explain the purpose of this column
COMMENT ON COLUMN public.bookings.selected_pricing IS 'Stores the selected pricing option for services with special pricing (duration and price)';
