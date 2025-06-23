
-- Create a function to extract price from selected_pricing and update service_rate
CREATE OR REPLACE FUNCTION public.update_service_rate_from_pricing()
RETURNS TRIGGER AS $$
BEGIN
  -- Extract the price from selected_pricing JSON and update service_rate
  IF NEW.selected_pricing IS NOT NULL AND NEW.selected_pricing ? 'price' THEN
    -- Remove currency symbol and convert to numeric (assuming ₱ symbol)
    NEW.service_rate := CASE 
      WHEN NEW.selected_pricing->>'price' ~ '^₱[0-9,]+(\.[0-9]+)?$' THEN
        -- Remove ₱ symbol and commas, then convert to numeric
        REPLACE(REPLACE(NEW.selected_pricing->>'price', '₱', ''), ',', '')::numeric
      WHEN NEW.selected_pricing->>'price' ~ '^[0-9,]+(\.[0-9]+)?$' THEN
        -- Just remove commas and convert to numeric (no currency symbol)
        REPLACE(NEW.selected_pricing->>'price', ',', '')::numeric
      ELSE
        -- If format doesn't match, try to extract numbers only
        REGEXP_REPLACE(NEW.selected_pricing->>'price', '[^0-9.]', '', 'g')::numeric
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update service_rate when booking is inserted or updated
DROP TRIGGER IF EXISTS trigger_update_service_rate ON public.bookings;
CREATE TRIGGER trigger_update_service_rate
  BEFORE INSERT OR UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_service_rate_from_pricing();

-- Update existing bookings that have selected_pricing but no service_rate
UPDATE public.bookings 
SET service_rate = CASE 
  WHEN selected_pricing->>'price' ~ '^₱[0-9,]+(\.[0-9]+)?$' THEN
    REPLACE(REPLACE(selected_pricing->>'price', '₱', ''), ',', '')::numeric
  WHEN selected_pricing->>'price' ~ '^[0-9,]+(\.[0-9]+)?$' THEN
    REPLACE(selected_pricing->>'price', ',', '')::numeric
  ELSE
    REGEXP_REPLACE(selected_pricing->>'price', '[^0-9.]', '', 'g')::numeric
END
WHERE selected_pricing IS NOT NULL 
  AND selected_pricing ? 'price' 
  AND (service_rate IS NULL OR service_rate = 0);
